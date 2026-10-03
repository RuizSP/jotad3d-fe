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
      '_s([0-2])_m([0-9a-f-]+)_f([0-1])_'
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
    if v_variant[2] in ('0', '1') then
      v_material_fee := case v_variant[2] when '1' then 15 else 0 end;
    elsif v_variant[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
      select additional_price into v_material_fee
      from public.catalog_materials where id = v_variant[2]::uuid and active;
      if not found then raise exception 'O material selecionado não está disponível.'; end if;
    else
      raise exception 'O material selecionado é inválido.';
    end if;
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

  v_access_code := 'PD-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));

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
