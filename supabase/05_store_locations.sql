create table if not exists public.store_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Loja principal',
  address_line text not null,
  address_number text not null,
  address_complement text,
  neighborhood text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  instructions text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists store_locations_single_active_uidx
  on public.store_locations (is_active)
  where is_active;

alter table public.store_locations enable row level security;

drop policy if exists "Public read active store location"
  on public.store_locations;
create policy "Public read active store location"
  on public.store_locations
  for select to anon, authenticated
  using (is_active);

grant select on public.store_locations to anon, authenticated;
revoke insert, update, delete on public.store_locations from anon, authenticated;

alter table public.pedidos
  add column if not exists store_location_id uuid
  references public.store_locations(id);