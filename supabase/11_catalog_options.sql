create table if not exists public.catalog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(trim(name)) > 0 and lower(trim(name)) <> 'todos'),
  active boolean not null default true
);
create table if not exists public.catalog_colors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(trim(name)) > 0 and lower(trim(name)) <> 'pintada'),
  hex text not null check (hex ~ '^#[0-9A-Fa-f]{6}$'),
  active boolean not null default true
);
create table if not exists public.catalog_materials (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(trim(name)) > 0),
  additional_price numeric(10,2) not null default 0 check (additional_price >= 0),
  active boolean not null default true
);

insert into public.catalog_categories (name)
select option_name from unnest(array['Decoração','Colecionáveis','Setup & Escritório','Engenharia','Utilitários','Outros','Geral']) as options(option_name)
on conflict (name) do nothing;
insert into public.catalog_categories (name)
select distinct trim(categoria) from public.produtos
where nullif(trim(categoria), '') is not null and lower(trim(categoria)) <> 'todos'
on conflict (name) do nothing;

insert into public.catalog_colors (name, hex) values
  ('Preto','#111111'),('Branco','#F5F5F5'),('Rosa','#E91E63'),
  ('Azul','#1976D2'),('Azul Bebê','#81D4FA'),
  ('Verde com Violeta','#7B1FA2'),('Azul com Rosa','#5C6BC0'),('Dourado','#D4AF37')
on conflict (name) do nothing;
insert into public.catalog_colors (name, hex)
select distinct color_name, '#888888' from public.produtos, unnest(coalesce(cores, array[]::text[])) as colors(color_name)
where nullif(trim(color_name), '') is not null and lower(trim(color_name)) <> 'pintada'
on conflict (name) do nothing;

insert into public.catalog_materials (name, additional_price) values
  ('PLA Silk / Matte',0),('PETG Reforçado',15),('PLA Silk Premium',0),
  ('PLA Matte',0),('PLA Duocolor Especial',0),('PETG Técnico',0),
  ('ABS Automotivo',0),('Resina 8K Ultra',0),('PLA Premium',0)
on conflict (name) do nothing;
insert into public.catalog_materials (name)
select distinct trim(material) from public.produtos where nullif(trim(material), '') is not null
on conflict (name) do nothing;

alter table public.catalog_categories enable row level security;
alter table public.catalog_colors enable row level security;
alter table public.catalog_materials enable row level security;

create policy "Public reads categories" on public.catalog_categories for select to anon, authenticated using (true);
create policy "Admins manage categories" on public.catalog_categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Public reads colors" on public.catalog_colors for select to anon, authenticated using (true);
create policy "Admins manage colors" on public.catalog_colors for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Public reads materials" on public.catalog_materials for select to anon, authenticated using (true);
create policy "Admins manage materials" on public.catalog_materials for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.catalog_categories, public.catalog_colors, public.catalog_materials to anon, authenticated;
grant insert, update, delete on public.catalog_categories, public.catalog_colors, public.catalog_materials to authenticated;

create or replace function public.sync_catalog_option_name()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if new.name = old.name then return new; end if;
  if tg_table_name = 'catalog_categories' then
    update public.produtos set categoria = new.name where categoria = old.name;
  elsif tg_table_name = 'catalog_materials' then
    update public.produtos set material = new.name where material = old.name;
  elsif tg_table_name = 'catalog_colors' then
    update public.produtos
    set cores = array_replace(cores, old.name, new.name),
        imagens_por_variacao = case
          when imagens_por_variacao ? old.name
          then (imagens_por_variacao - old.name) || jsonb_build_object(new.name, imagens_por_variacao -> old.name)
          else imagens_por_variacao end
    where old.name = any(cores);
  end if;
  return new;
end;
$$;
revoke all on function public.sync_catalog_option_name() from public;

create trigger sync_category_name after update of name on public.catalog_categories
for each row execute function public.sync_catalog_option_name();
create trigger sync_color_name after update of name on public.catalog_colors
for each row execute function public.sync_catalog_option_name();
create trigger sync_material_name after update of name on public.catalog_materials
for each row execute function public.sync_catalog_option_name();
