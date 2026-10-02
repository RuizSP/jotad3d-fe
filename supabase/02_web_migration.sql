alter table produtos add column if not exists categoria text default 'Geral';
alter table produtos add column if not exists descricao text;
alter table produtos add column if not exists material text default 'PLA Premium';
alter table produtos add column if not exists dimensoes text;
alter table produtos add column if not exists cores text[] default array['Preto', 'Branco', 'Dourado'];
alter table produtos add column if not exists preco_pintura numeric(10,2);

alter table pedidos add column if not exists entregue boolean default false;
alter table pedidos add column if not exists prazo_entrega date;
alter table pedidos add column if not exists observacoes text;
alter table pedidos add column if not exists whatsapp text;
alter table pedidos add column if not exists email text;
alter table pedidos add column if not exists cep text;
alter table pedidos add column if not exists endereco text;
alter table pedidos add column if not exists numero text;
alter table pedidos add column if not exists bairro text;
alter table pedidos add column if not exists complemento text;

alter table pedido_itens add column if not exists cor_escolhida text default 'Padrão';
alter table pedido_itens add column if not exists acabamento text default 'Filamento';

drop policy if exists "Allow Updates produtos-imagens" on storage.objects;
create policy "Allow Updates produtos-imagens" on storage.objects
  for update using (bucket_id = 'produtos-imagens');

drop policy if exists "Allow Deletes produtos-imagens" on storage.objects;
create policy "Allow Deletes produtos-imagens" on storage.objects
  for delete using (bucket_id = 'produtos-imagens');
