-- Uma instalação usa um projeto Supabase e uma identidade pública.
create table if not exists public.store_branding (
  id smallint primary key default 1 check (id = 1),
  company_name text not null check (length(trim(company_name)) between 2 and 80),
  tagline text not null default '',
  hero_eyebrow text not null default '',
  hero_title text not null default '',
  hero_highlight text not null default '',
  hero_description text not null default '',
  quote_payment_text text not null default 'Forma de pagamento a combinar',
  quote_delivery_text text not null default 'Entrega ou retirada conforme disponibilidade',
  logo_url text,
  theme_name text not null default 'elegantGold' check (theme_name in ('elegantGold', 'darkElegance')),
  accent_color text not null default '#D4AF37' check (accent_color ~ '^#[0-9A-Fa-f]{6}$')
);

insert into public.store_branding (
  id, company_name, tagline, hero_eyebrow, hero_title, hero_highlight, hero_description
) values (
  1, 'Sua marca', 'Impressão 3D e projetos sob medida', 'IMPRESSÃO 3D SOB DEMANDA',
  'SUAS IDEIAS EM', 'TRÊS DIMENSÕES.',
  'Explore nosso catálogo ou peça um orçamento para transformar sua ideia em uma peça única.'
) on conflict (id) do nothing;

alter table public.store_branding enable row level security;
create policy "Public reads store branding" on public.store_branding
  for select to anon, authenticated using (true);
create policy "Admins insert store branding" on public.store_branding
  for insert to authenticated with check (public.is_admin());
create policy "Admins update store branding" on public.store_branding
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.store_branding to anon, authenticated;
grant insert, update on public.store_branding to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('brand-assets', 'brand-assets', true, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp'];

create policy "Admins upload brand assets" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'brand-assets' and public.is_admin());
create policy "Admins delete brand assets" on storage.objects
  for delete to authenticated
  using (bucket_id = 'brand-assets' and public.is_admin());
