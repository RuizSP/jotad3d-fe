alter table public.pedidos
  add column if not exists delivery_method text not null default 'delivery';