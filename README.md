# PAMS - Property and occupant Management System

A modern Laravel + Inertia.js + React starter designed for building robust, type-safe, single-page applications with optional server-side rendering (SSR), Tailwind CSS, and a curated UI stack.

This project pairs a Laravel 12 backend with a React 19 frontend powered by Vite 7 and TypeScript. It ships with sensible defaults for authentication (Laravel Fortify), routing helpers (Ziggy), development tooling (ESLint, Prettier), and a component-driven UI workflow (Radix UI + shadcn/ui).

## Tech Stack

- Backend
  - Laravel 12
  - Inertia.js (Laravel adapter)
  - Laravel Fortify (authentication)
  - Wayfinder (form/route conveniences)
  - Ziggy (route helpers in JS)
- Frontend
  - React 19 + TypeScript 5
  - Vite 7 + @vitejs/plugin-react
  - Tailwind CSS 4
  - Radix UI + shadcn/ui patterns
- Tooling
  - ESLint 9 (flat config) + Prettier 3
  - TypeScript strict mode
  - Inertia SSR entry

## Features

- Full-stack monolith with SPA UX via Inertia.js
- Optional SSR for improved SEO and first paint
- Secure authentication via Laravel Fortify
- Tailwind CSS 4 with modern PostCSS/LighningCSS pipeline
- Strong linting and formatting rules out of the box
- DX-focused scripts to run backend, queues, and frontend concurrently
- Type-safe React code with strict TypeScript configuration and path aliases

## Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18 (recommended) and npm
- SQLite (default) or MySQL/PostgreSQL if you change DB_CONNECTION

## Getting Started

1) Clone and enter the project:
```bash
git clone https://github.com/GilangPambudi/pams.git
cd pams
```

2) Install backend dependencies and set up environment:
```bash
composer install
cp .env.example .env
php artisan key:generate
# If you use SQLite (default), make sure the file exists:
# touch database/database.sqlite
php artisan migrate --force
```

3) Install frontend dependencies:
```bash
npm install
```

4) Run the development environment:
- Run everything concurrently (Laravel server, queue listener, Vite):
```bash
composer run dev
```

- Or run Vite only:
```bash
npm run dev
```

- Laravel server only:
```bash
php artisan serve
```

- Queue worker only:
```bash
php artisan queue:listen --tries=1
```

### Using SSR in development (optional)

Build the SSR bundle and run with the SSR dev script:

```bash
npm run build:ssr
composer run dev:ssr
```

This spawns:
- Laravel server
- Queue listener
- Pail (Laravel log viewer)
- Inertia SSR server via `php artisan inertia:start-ssr`

## Production Build & Deployment

- Build frontend assets (including SSR bundle if you need SSR):
```bash
npm run build        # CSR only
npm run build:ssr    # CSR + SSR bundles
```

- Typical deployment steps:
  - Set environment variables in `.env` (APP_KEY, APP_URL, DB_*, CACHE_*, SESSION_*, etc.)
  - Run migrations: `php artisan migrate --force`
  - Serve the application via your preferred web server (Nginx/Apache) pointing to `public/`
  - If using SSR, run the SSR server process in the background (e.g., Supervisor/PM2):
    - Ensure `npm run build:ssr` has been run
    - Start SSR: `php artisan inertia:start-ssr`

## Scripts

Backend (Composer):
- `composer run setup` — Install and bootstrap (composer install, env copy, key:generate, migrate, npm install, build)
- `composer run dev` — Run Laravel server, queue listener, and Vite together
- `composer run dev:ssr` — As above + Laravel Pail + Inertia SSR
- `composer run test` — Clear config cache and run tests

Frontend (npm):
- `npm run dev` — Start Vite dev server
- `npm run build` — Build client bundle
- `npm run build:ssr` — Build client + SSR bundles
- `npm run format` / `npm run format:check` — Prettier format/check
- `npm run lint` — ESLint fix
- `npm run types` — TS type-check

## Configuration Highlights

- Vite configuration: `vite.config.ts`
  - Laravel Vite plugin
  - React plugin with React Compiler
  - Tailwind CSS Vite plugin
  - Wayfinder integration
  - Alias for Ziggy: `ziggy-js` points to `vendor/tightenco/ziggy`

- TypeScript: `tsconfig.json`
  - Strict mode, `jsx: react-jsx`
  - Path alias `@/*` → `./resources/js/*`
  - Build emits disabled (`noEmit: true`), use Vite for building

- ESLint (flat config): `eslint.config.js`
  - JS/TS/React + React Hooks recommended configs
  - Prettier compatibility
  - Ignores vendor, node_modules, public, etc.

- Tailwind & UI:
  - Tailwind CSS 4
  - shadcn/ui schema in `components.json` with aliases for `@/components`, `@/lib`, `@/hooks`, etc.
  - Radix UI primitives and lucide icons

## Project Structure

Standard Laravel layout with a TypeScript React app:

```
app/                # Laravel application code
bootstrap/
config/
database/
public/             # Document root
resources/
  css/app.css       # Tailwind entry
  js/               # React + TS app (alias: @/*)
    app.tsx         # Client entry
    ssr.tsx         # SSR entry
routes/             # API/web routes
storage/
tests/
vite.config.ts
tsconfig.json
composer.json
package.json
```

## Environment

Key `.env` variables (see `.env.example`):
- App: `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_URL`, `APP_DEBUG`
- Database: `DB_CONNECTION` (defaults to sqlite), `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- Session/Cache/Queue: `SESSION_DRIVER`, `QUEUE_CONNECTION`, `CACHE_STORE`
- Redis/Mail: `REDIS_*`, `MAIL_*`
- Frontend: `VITE_APP_NAME` is forwarded to the client

## Testing

- Run tests:
```bash
php artisan test
# or
composer run test
```

This project includes Pest and PHPUnit tooling.

## Code Quality

- Lint:
```bash
npm run lint
```

- Format:
```bash
npm run format
```

- Type-check:
```bash
npm run types
```

## Troubleshooting

- Missing APP_KEY
  - Run: `php artisan key:generate`
- SQLite database missing
  - Create the file: `touch database/database.sqlite` and ensure `DB_CONNECTION=sqlite`
- SSR doesn’t render
  - Ensure `npm run build:ssr` completed and `php artisan inertia:start-ssr` is running
- Frontend changes not updating
  - Confirm Vite dev server is running (`npm run dev` or `composer run dev`) and that `@vite` assets are correctly referenced

## License

This project is licensed under the MIT License. See `composer.json` for the declared license. If you plan to distribute, consider adding a dedicated `LICENSE` file to the repository root.

## Acknowledgements

- [Laravel](https://laravel.com/)
- [Inertia.js](https://inertiajs.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Ziggy](https://github.com/tighten/ziggy)
