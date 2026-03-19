# Repository Guidelines

## Project Structure & Module Organization
This repository is a Laravel 12 app with an Inertia React frontend. Keep backend concerns layered: controllers in `app/Http/Controllers` should stay thin, request validation belongs in `app/Http/Requests`, business workflows belong in `app/Services`, and reusable domain actions belong in `app/Actions`. Eloquent models live in `app/Models`. Frontend code is also layered: route-level screens in `resources/js/pages`, shared UI in `resources/js/components`, layouts in `resources/js/layouts`, reusable state/behavior in `resources/js/hooks`, utility helpers in `resources/js/lib`, and shared types in `resources/js/types`.

## Build, Test, and Development Commands
- `composer setup`: install dependencies, create `.env`, generate the app key, migrate, and build assets.
- `composer dev`: run Laravel, queue listener, and Vite together.
- `npm run dev`: start the Vite frontend only.
- `npm run build`: create production assets.
- `composer test`: clear config and run the full Laravel test suite.
- `npm run lint`: run ESLint with auto-fix.
- `npm run format` / `npm run format:check`: format or verify files in `resources/`.
- `vendor/bin/pint`: format PHP code to Laravel standards.

## Coding Style & Naming Conventions
Use PSR-12 for PHP and keep controllers focused on orchestration, not business logic. Prefer extracting repeated backend logic into `Services` or small `Actions`. In frontend code, keep page components thin and move reusable behavior into hooks or shared components. Use PascalCase for PHP classes and React component filenames, camelCase for hooks and helpers, and snake_case for database fields. Follow existing patterns such as `pages/tenancies/_form.tsx` for shared page-local form fragments.

## Testing Guidelines
The project uses Pest with Laravel helpers. Put end-to-end HTTP, database, and authorization behavior in `tests/Feature`; isolated logic belongs in `tests/Unit`. Add tests when changing validation, filters, redirects, services, or multi-step tenancy/payment flows. Run `composer test` before opening a PR.

## Commit & Pull Request Guidelines
Commit history follows Conventional Commit style, mainly `feat:` and `fix:`. Keep commits focused, for example `fix: extract shared index filters from tenant listing`. PRs should include a concise summary, impacted routes or pages, migration notes, linked issues, and screenshots for UI changes. Call out architectural moves such as logic extracted from controllers into services/hooks.

## Security & Configuration Tips
Do not commit `.env` or secrets. Whitelist sortable columns and validate request-driven filters. When touching tenancy, payment, or property workflows, verify related service logic and feature tests still cover redirects, statuses, and side effects.
