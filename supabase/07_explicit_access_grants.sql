revoke all privileges on table public.produtos from anon;
revoke all privileges on table public.pedidos from anon;
revoke all privileges on table public.pedido_itens from anon;
revoke all privileges on table public.store_locations from anon;

revoke all privileges on table public.produtos from public;
revoke all privileges on table public.pedidos from public;
revoke all privileges on table public.pedido_itens from public;
revoke all privileges on table public.store_locations from public;

grant select on table public.produtos to anon, authenticated;
grant select on table public.store_locations to anon, authenticated;
grant select, insert, update, delete
  on table public.produtos, public.pedidos, public.pedido_itens,
  public.store_locations to authenticated;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.create_public_order(
  text, text, text, text, uuid, text, text, text, text, text, text,
  numeric, text, jsonb
) to anon, authenticated;
grant execute on function public.get_public_order_tracking(text)
  to anon, authenticated;