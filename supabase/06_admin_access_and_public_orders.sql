create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.pedido_itens
  add column if not exists produto_nome text,
  add column if not exists imagem_url text;

drop policy if exists "Acesso total produtos" on public.produtos;
drop policy if exists "Public read products" on public.produtos;
drop policy if exists "Admins manage products" on public.produtos;
create policy "Public read products"
  on public.produtos for select to anon, authenticated using (true);
create policy "Admins manage products"
  on public.produtos for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Acesso total pedidos" on public.pedidos;
drop policy if exists "Admins manage pedidos" on public.pedidos;
create policy "Admins manage pedidos"
  on public.pedidos for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Acesso total pedido_itens" on public.pedido_itens;
drop policy if exists "Admins manage pedido_itens" on public.pedido_itens;
create policy "Admins manage pedido_itens"
  on public.pedido_itens for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read active store location"
  on public.store_locations;
drop policy if exists "Admins manage store locations"
  on public.store_locations;
create policy "Public read active store location"
  on public.store_locations for select to anon, authenticated
  using (is_active);
create policy "Admins manage store locations"
  on public.store_locations for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

grant select on public.produtos to anon, authenticated;
grant insert, update, delete on public.produtos to authenticated;
grant select, insert, update, delete on public.pedidos to authenticated;
grant select, insert, update, delete on public.pedido_itens to authenticated;
grant select on public.store_locations to anon, authenticated;
grant insert, update, delete on public.store_locations to authenticated;

drop policy if exists "Allow Uploads produtos-imagens" on storage.objects;
drop policy if exists "Allow Updates produtos-imagens" on storage.objects;
drop policy if exists "Allow Deletes produtos-imagens" on storage.objects;
drop policy if exists "Admins upload produtos-imagens" on storage.objects;
drop policy if exists "Admins update produtos-imagens" on storage.objects;
drop policy if exists "Admins delete produtos-imagens" on storage.objects;
create policy "Admins upload produtos-imagens"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'produtos-imagens' and public.is_admin());
create policy "Admins update produtos-imagens"
  on storage.objects for update to authenticated
  using (bucket_id = 'produtos-imagens' and public.is_admin())
  with check (bucket_id = 'produtos-imagens' and public.is_admin());
create policy "Admins delete produtos-imagens"
  on storage.objects for delete to authenticated
  using (bucket_id = 'produtos-imagens' and public.is_admin());

create or replace function public.create_public_order(
  p_customer_name text,
  p_whatsapp text,
  p_email text,
  p_delivery_method text,
  p_store_location_id uuid,
  p_cep text,
  p_address text,
  p_number text,
  p_neighborhood text,
  p_city text,
  p_complement text,
  p_total_amount numeric,
  p_notes text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.pedidos%rowtype;
  v_location public.store_locations%rowtype;
  v_item jsonb;
  v_order_items jsonb := '[]'::jsonb;
  v_product_candidate text;
  v_product_id uuid;
  v_product public.produtos%rowtype;
  v_variant text[];
  v_quantity integer;
  v_scale numeric;
  v_material_fee numeric;
  v_finish_fee numeric;
  v_unit_price numeric;
  v_calculated_total numeric := 0;
  v_scale_label text;
  v_city text;
  v_access_code text;
begin
  if nullif(trim(p_customer_name), '') is null then
    raise exception 'O nome do cliente é obrigatório.';
  end if;
  if length(regexp_replace(coalesce(p_whatsapp, ''), '\D', '', 'g')) < 8 then
    raise exception 'Informe um WhatsApp válido.';
  end if;
  if p_delivery_method not in ('delivery', 'pickup') then
    raise exception 'Forma de recebimento inválida.';
  end if;
  if p_total_amount is null or p_total_amount < 0 then
    raise exception 'O total do pedido é inválido.';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'Os itens do pedido são inválidos.';
  end if;
  if jsonb_array_length(p_items) = 0 then
    raise exception 'O pedido precisa conter ao menos um item.';
  end if;

  if p_delivery_method = 'pickup' then
    if p_store_location_id is null then
      raise exception 'Selecione um endereço ativo para retirada.';
    end if;
    select * into v_location
      from public.store_locations
      where id = p_store_location_id and is_active;
    if not found then
      raise exception 'O endereço de retirada não está ativo.';
    end if;
    v_city := v_location.city;
  else
    if nullif(trim(p_cep), '') is null
      or nullif(trim(p_address), '') is null
      or nullif(trim(p_number), '') is null
      or nullif(trim(p_neighborhood), '') is null
      or nullif(trim(p_city), '') is null then
      raise exception 'Informe o endereço completo para entrega.';
    end if;
    v_city := trim(p_city);
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_product_candidate := split_part(coalesce(v_item ->> 'productId', ''), '_s', 1);
    v_variant := regexp_match(
      coalesce(v_item ->> 'productId', ''),
      '_s([0-2])_m([0-1])_f([0-1])_'
    );
    if v_variant is null
      or v_product_candidate !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
      raise exception 'Um dos produtos do pedido não é válido.';
    end if;

    select * into v_product
      from public.produtos
      where id = v_product_candidate::uuid;
    if not found then
      raise exception 'Um dos produtos não está mais disponível.';
    end if;

    v_quantity := coalesce((v_item ->> 'quantity')::integer, 0);
    if v_quantity < 1 or v_quantity > 100 then
      raise exception 'A quantidade de um produto é inválida.';
    end if;

    v_scale := case v_variant[1]
      when '0' then 1
      when '1' then 1.25
      else 1.5
    end;
    v_scale_label := case v_variant[1]
      when '0' then 'Padrão'
      when '1' then 'Médio'
      else 'Grande'
    end;
    v_material_fee := case v_variant[2] when '1' then 15 else 0 end;
    v_finish_fee := case v_variant[3]
      when '1' then coalesce(v_product.preco_pintura, 35)
      else 0
    end;
    v_unit_price := round(
      (v_product.preco * v_scale + v_material_fee + v_finish_fee)::numeric,
      2
    );
    v_calculated_total := v_calculated_total + v_unit_price * v_quantity;
    v_product_id := v_product.id;

    v_order_items := v_order_items || jsonb_build_array(jsonb_build_object(
      'produto_id', v_product_id,
      'produto_nome', v_product.nome || ' (' || v_scale_label || ')',
      'imagem_url', v_product.imagem_url,
      'quantidade', v_quantity,
      'preco_unitario', v_unit_price,
      'cor_escolhida', left(coalesce(nullif(v_item ->> 'color', ''), 'Padrão'), 160)
    ));
  end loop;

  if abs(v_calculated_total - p_total_amount) > 0.01 then
    raise exception 'Os preços do pedido mudaram. Atualize o carrinho e tente novamente.';
  end if;

  v_access_code := 'JD-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));

  insert into public.pedidos (
    access_code, status, delivery_method, store_location_id,
    cliente_nome, whatsapp, email, cep, endereco, numero, bairro,
    cidade, complemento, valor_total, pago, pronto_para_entrega,
    concluido, observacoes
  ) values (
    v_access_code, 'recebido', p_delivery_method, p_store_location_id,
    trim(p_customer_name), trim(p_whatsapp), nullif(trim(p_email), ''),
    case when p_delivery_method = 'delivery' then trim(p_cep) else null end,
    case when p_delivery_method = 'delivery' then trim(p_address) else null end,
    case when p_delivery_method = 'delivery' then trim(p_number) else null end,
    case when p_delivery_method = 'delivery' then trim(p_neighborhood) else null end,
    v_city,
    case when p_delivery_method = 'delivery' then nullif(trim(p_complement), '') else null end,
    v_calculated_total, false, false, false, nullif(trim(p_notes), '')
  ) returning * into v_order;

  for v_item in select value from jsonb_array_elements(v_order_items)
  loop
    insert into public.pedido_itens (
      pedido_id, produto_id, produto_nome, imagem_url,
      quantidade, preco_unitario, cor_escolhida
    ) values (
      v_order.id,
      (v_item ->> 'produto_id')::uuid,
      v_item ->> 'produto_nome',
      v_item ->> 'imagem_url',
      (v_item ->> 'quantidade')::integer,
      (v_item ->> 'preco_unitario')::numeric,
      v_item ->> 'cor_escolhida'
    );
  end loop;

  return jsonb_build_object(
    'id', v_order.id,
    'access_code', v_order.access_code,
    'order_number', v_order.order_number,
    'status', v_order.status,
    'data_criacao', v_order.data_criacao,
    'store_location', case when v_location.id is null then null else jsonb_build_object(
      'id', v_location.id,
      'name', v_location.name,
      'address_line', v_location.address_line,
      'address_number', v_location.address_number,
      'address_complement', v_location.address_complement,
      'neighborhood', v_location.neighborhood,
      'city', v_location.city,
      'state', v_location.state,
      'postal_code', v_location.postal_code,
      'instructions', v_location.instructions
    ) end
  );
end;
$$;

create or replace function public.get_public_order_tracking(p_access_code text)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'id', p.id,
    'access_code', p.access_code,
    'order_number', p.order_number,
    'status', p.status,
    'delivery_method', p.delivery_method,
    'store_location_id', p.store_location_id,
    'store_location', case when location.id is null then null else jsonb_build_object(
      'id', location.id,
      'name', location.name,
      'address_line', location.address_line,
      'address_number', location.address_number,
      'address_complement', location.address_complement,
      'neighborhood', location.neighborhood,
      'city', location.city,
      'state', location.state,
      'postal_code', location.postal_code,
      'instructions', location.instructions
    ) end,
    'cliente_nome', p.cliente_nome,
    'cep', p.cep,
    'endereco', p.endereco,
    'numero', p.numero,
    'bairro', p.bairro,
    'cidade', p.cidade,
    'complemento', p.complemento,
    'pedido_itens', coalesce((
      select jsonb_agg(jsonb_build_object(
        'produto_id', i.produto_id,
        'produto_nome', i.produto_nome,
        'imagem_url', i.imagem_url,
        'quantidade', i.quantidade,
        'preco_unitario', i.preco_unitario,
        'cor_escolhida', i.cor_escolhida,
        'produtos', case when product.id is null then null else jsonb_build_object(
          'nome', product.nome,
          'imagem_url', product.imagem_url
        ) end
      ) order by i.id)
      from public.pedido_itens i
      left join public.produtos product on product.id = i.produto_id
      where i.pedido_id = p.id
    ), '[]'::jsonb),
    'valor_total', p.valor_total,
    'pago', p.pago,
    'observacoes', p.observacoes,
    'data_criacao', p.data_criacao
  )
  from public.pedidos p
  left join public.store_locations location on location.id = p.store_location_id
  where upper(p.access_code) = upper(trim(p_access_code))
    and length(trim(p_access_code)) between 11 and 20
  limit 1;
$$;

revoke all on function public.create_public_order(
  text, text, text, text, uuid, text, text, text, text, text, text, numeric, text, jsonb
) from public;
grant execute on function public.create_public_order(
  text, text, text, text, uuid, text, text, text, text, text, text, numeric, text, jsonb
) to anon, authenticated;

revoke all on function public.get_public_order_tracking(text) from public;
grant execute on function public.get_public_order_tracking(text) to anon, authenticated;