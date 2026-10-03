# Catálogo e gestão para impressão 3D

Frontend React, TypeScript e Vite para lojas de impressão 3D. Cada empresa usa uma instalação e um projeto Supabase próprios. A identidade da empresa é configurada no painel, sem alterar o código para cada cliente.

## Instalação

1. Execute `yarn install`.
2. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os valores do projeto da empresa. Não coloque a service role key no frontend.
3. Aplique, em ordem, todas as migrações de `supabase/` (`01` a `14`) pelo SQL Editor do projeto.
4. Crie a conta administrativa em **Authentication > Users** e atribua a role no SQL Editor:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('role', 'admin')
where email = 'admin@exemplo.com';
```

Substitua o e-mail e faça login novamente para renovar o token. O painel fica em `/admin/login`.

5. Em **Administração > Configurações**, preencha a identidade da empresa, envie o logo e cadastre o WhatsApp e endereço. O endereço habilita a retirada na loja.
6. Execute `yarn dev` para desenvolvimento ou `yarn build` para gerar a versão de produção.

## Personalização

A migração `13` cria `store_branding`, um registro público de leitura com nome, logo, textos da vitrine, tema, cor de destaque e textos dos orçamentos. Somente contas com `app_metadata.role = admin` podem alterá-lo. Os logos ficam no bucket público `brand-assets`, com envio restrito a administradores. O frontend usa esses dados no cabeçalho, rodapé, aba do navegador, vitrine, mensagens de WhatsApp e calculadora. O tema escolhido no painel vale para todos os visitantes.

A migração `14` troca o prefixo de novos códigos de pedido para `PD-`. Pedidos anteriores com `JD-` continuam aceitos na consulta. Para uma empresa nova, configure produtos, categorias, cores e materiais no seu próprio Supabase; o frontend não compartilha dados entre instalações.

## Verificação

Antes de publicar uma instalação, execute `yarn lint` e `yarn build`. Verifique manualmente a vitrine e o checkout em tela pequena e grande, o envio de pedido e orçamento por WhatsApp, a consulta de pedido e o acesso administrativo. Confirme que uma conta pública consegue ler a identidade, mas não consegue editá-la nem enviar logos.
