create extension if not exists "pgcrypto";

create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  preco numeric(10,2) not null,
  imagem_url text,
  criado_em timestamptz default now()
);

create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_nome text not null,
  cidade text not null,
  valor_total numeric(10,2) default 0,
  pago boolean default false,
  pronto_para_entrega boolean default false,
  concluido boolean default false,
  data_criacao timestamptz default now(),
  data_conclusao timestamptz
);

create table if not exists pedido_itens (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid references pedidos(id) on delete cascade,
  produto_id uuid references produtos(id),
  quantidade int not null default 1,
  preco_unitario numeric(10,2) not null
);

alter table produtos enable row level security;
alter table pedidos enable row level security;
alter table pedido_itens enable row level security;

drop policy if exists "Acesso total produtos" on produtos;
create policy "Acesso total produtos" on produtos
  for all using (true) with check (true);

drop policy if exists "Acesso total pedidos" on pedidos;
create policy "Acesso total pedidos" on pedidos
  for all using (true) with check (true);

drop policy if exists "Acesso total pedido_itens" on pedido_itens;
create policy "Acesso total pedido_itens" on pedido_itens
  for all using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('produtos-imagens', 'produtos-imagens', true)
on conflict (id) do nothing;

drop policy if exists "Public Access produtos-imagens" on storage.objects;
create policy "Public Access produtos-imagens" on storage.objects
  for select using (bucket_id = 'produtos-imagens');

drop policy if exists "Allow Uploads produtos-imagens" on storage.objects;
create policy "Allow Uploads produtos-imagens" on storage.objects
  for insert with check (bucket_id = 'produtos-imagens');
