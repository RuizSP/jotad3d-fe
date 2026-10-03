-- Keep imagem_url as the cover used by existing clients. Galleries are keyed by
-- filament color, plus the reserved key "Pintada" for the painted finish.
alter table public.produtos
  add column if not exists imagens_por_variacao jsonb not null default '{}'::jsonb;
