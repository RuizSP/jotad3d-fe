# Repository Guidelines

## Project Structure & Module Organization

This is a React, TypeScript, and Vite frontend. Entry points are `src/main.tsx`, `src/App.tsx`, and `src/router.tsx`. Screens live in `src/pages/`; reusable UI is in `src/components/`. Put shared state in `src/providers/`, data hooks in `src/hooks/`, API calls in `src/services/`, domain types in `src/shared/interfaces/`, and themes in `src/themes/`. Static files belong in `public/`; imported assets belong in `src/assets/`. Apply numbered SQL migrations in `supabase/` in order. `dist/` is generated output.

## Build, Test, and Development Commands

Use Yarn, matching the committed `yarn.lock`:

- `yarn install` installs dependencies.
- `yarn dev` starts the Vite development server.
- `yarn lint` runs ESLint across the repository.
- `yarn build` runs TypeScript project checks and produces `dist/`.
- `yarn preview` serves the production build locally.

Run `yarn lint` and `yarn build` before a pull request. There is no `test` script or automated test framework.

## Coding Style & Naming Conventions

Follow the existing two-space indentation, double quotes, semicolons, and trailing commas in TypeScript and TSX files. Use PascalCase for React components and interfaces (`ProductsTable.tsx`, `Product`), `use`-prefixed camelCase for hooks (`useOrders.ts`), and camelCase for service modules (`products.service.ts`). Keep route-specific code near its page and extract shared behavior into hooks or components. ESLint is configured in `eslint.config.js` with TypeScript, React Hooks, and Vite React Refresh rules; resolve lint errors instead of suppressing them without a reason.

## Testing Guidelines

Until a test runner is added, verify changed flows manually in `yarn dev`, especially public store, checkout, order tracking, and admin routes when affected. For changes to data access, check both successful requests and error handling against an appropriate Supabase project. Record the manual checks in the pull request. If automated tests are introduced, colocate them with the affected module using `*.test.ts` or `*.test.tsx` and add a documented test script.

## Commit & Pull Request Guidelines

Recent commits use short, imperative Portuguese summaries describing the user-facing change (for example, `Adiciona opção de retirada na loja`). Follow that pattern and keep commits focused. Pull requests should explain the change, list verification performed, link any relevant issue, and include screenshots for visible UI changes. Call out SQL migration or configuration steps explicitly.

## Configuration & Security

Copy `.env.example` to `.env` and fill in the `VITE_*` values for local development. Never commit `.env` or secrets. Admin access depends on the Supabase `admin` role in `app_metadata`; review related policies and migrations when changing protected flows.
