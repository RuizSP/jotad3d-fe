alter table public.produtos
  add column if not exists tempo_estimado_horas numeric(8,2);
