# GEMINI.md

## Project Overview
**PAMS (Property and occupant Management System)** is a modern ERP-style web application for managing rental properties (kos-kosan). It is built as a monolithic SPA using **Laravel 12**, **Inertia.js**, and **React 19**.

### Core Architecture
- **Backend:** Laravel 12 (PHP 8.2+).
- **Frontend:** React 19 with TypeScript, utilizing **shadcn/ui** and **Tailwind CSS 4**.
- **Communication:** Inertia.js (no traditional API needed for internal state).
- **Authentication:** Laravel Fortify.
- **Database:** SQLite (default).

### Backend Layered Architecture (MANDATORY)
Do not dump business logic in Controllers. Follow the established layered pattern:
1.  **Models (`app/Models/`):** Define data structure, relationships, and basic accessors/appends.
2.  **Services (`app/Services/`):** House the core business logic, complex calculations, and multi-step database transactions (e.g., `TenancyService`).
3.  **Controllers (`app/Http/Controllers/`):** Handle request routing, data fetching for Inertia, and delegating write operations to Services.
4.  **Requests (`app/Http/Requests/`):** Handle all validation logic.

### Frontend Modular Architecture (MANDATORY)
Follow the modular UI structure:
1.  **Pages (`resources/js/pages/`):** Entry points for Inertia routes. Keep these lightweight.
2.  **Partial Views/Forms:** Use partial files (like `_form.tsx`) for shared components between Create and Edit views to ensure DRY.
3.  **Shared Components (`resources/js/components/`):** Generic UI elements (mostly shadcn/ui) and layout wrappers (`app-shell.tsx`).
4.  **Types (`resources/js/types/`):** Strictly define TypeScript interfaces for all shared data structures.

---

## Technical Standards & Constraints

### 1. Sizing and Units (CRITICAL)
- **NO STATIC PIXELS:** You are strictly prohibited from using `px` for any size unit (width, height, padding, margin, font-size, etc.).
- **DYNAMIC UNITS ONLY:** Use relative units that align with the framework/library conventions:
  - **Tailwind 4:** Use spacing scales (e.g., `p-4`, `m-2`, `w-1/2`) or relative units like `rem`, `em`, `vh`, `vw`, or `%`.
  - **CSS:** Use `rem`, `em`, `calc()`, etc.

### 2. Documentation and Comments
- **ZERO COMMENTS:** Do not add comments to code unless explicitly instructed for a specific explanation.
- **NO INLINE COMMENTS:** Inline comments are strictly forbidden.

### 3. Logic & Patterns
- **Surgical Changes:** Keep modifications minimal and focused on the requested scope.
- **Service-First:** If a change involves business logic (e.g., calculating payments), it MUST happen in a Service class.
- **DRY (Don't Repeat Yourself):** Reuse existing components and partials.

---

## Development Workflow

### Commands
- **Install All:** `composer run setup`
- **Run Dev Environment:** `composer run dev`
- **Run Tests:** `php artisan test`
- **Lint & Format:** `npm run lint` && `npm run format`

---

## Contextual Instructions
Before making any changes:
1.  **Trace the Logic:** Identify the correct Service before modifying a Controller.
2.  **Check Partial Reuse:** When editing a form, check if it uses a shared `_form.tsx`.
3.  **No Autonomous Decisions:** If a business logic rule is not clear, stop and ask.
