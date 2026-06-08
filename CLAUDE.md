# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install            # install dependencies
npm start              # ng serve → http://localhost:4200
npm run build          # production build → dist/
npm run watch          # incremental dev build
npm test               # unit tests (Karma + Jasmine)

# Run a single spec: narrow Karma to one file
npx ng test --include='src/app/services/article.service.spec.ts'
```

Angular CLI 15. No lint script is configured (`ng lint` is not set up).

## Architecture

Angular 15 **B2B e-commerce storefront** for Olympia (built on the "Molla" Bootstrap template). It is the client front-end for the separate **Olympia .NET API** repo; it does not contain its own backend.

**Module structure:** single root `AppModule` (NgModules, *not* standalone components). All components, pipes and Material modules are declared/imported there — there are no feature modules or lazy loading.

**Routing** (`app-routing.module.ts`): `/` is the public `LoginComponent`. Everything else lives under `/home` (guarded by `AuthGuard`) as child routes rendered inside `HomeComponent` (which wraps header/footer): `shop-*columns`, `shop-list`, `product/:id`, `cart`, `wishlist`, `account`, `category/:category`, `administration`, `password-manager`, `guest`, etc. `**` → `NotFoundComponent`.

**Auth:** `guards/auth.guard.ts` is intentionally minimal — it reads a `loggedIn` boolean from `localStorage` and redirects to `/` if absent. Login (`client.service.ts`) hits three backend endpoints for the three actor types: `/api/Auth/login` (client), `/login/comm` (commercial/VRP), `/login/contact` (contact).

**State management — read this before touching "state":**
- **Cart and wishlist state is NOT NgRx.** `cart.service.ts` and `wishlist.service.ts` hold arrays in memory and persist directly to `localStorage`. This is the live source of truth.
- The `core/` folder (`actions`, `reducers`, `selectors`, `store/store.service.ts`) is **NgRx scaffolding inherited from the Molla template but never wired in** — `StoreModule.forRoot(...)` is absent from `app.module.ts`. Don't assume NgRx is active; prefer the existing services unless deliberately migrating.

**Services → backend mapping** (all use `environment.base_url`):
- `article.service.ts` — catalog, families, tariffs + discounts (`/api/Art`, `/api/TarRemise`, `/api/Remise`), order placement, payment modes
- `client.service.ts` — auth + clients/contacts/commercials (`/api/Auth`, `/api/Cli`)
- `guest.service.ts` — guest CRUD (`/api/Guest`)
- `cart.service.ts`, `wishlist.service.ts` — localStorage only, no HTTP

**Pipes** (`pipes/`): `product`, `produit`, `sref` — client-side search/filtering over product lists.

## Configuration

API base URL lives in `src/environments/environment.ts` as `base_url` (e.g. `https://storeolympia.com`; localhost `https://localhost:7166` is commented inline). This file is **git-ignored** — copy `environment.example.ts` → `environment.ts` after cloning. `environment.prod.ts` replaces it for production builds via `angular.json` `fileReplacements`.

## Gotchas

- **Dependency vs. usage gap:** `package.json` ships NgRx, `@ngx-translate`, `@syncfusion/*`, `ngx-toastr`, and `@ng-select/ng-select`, but most are **not imported** in `app.module.ts`. Verify a library is actually wired in before relying on it. Actually-used UI: Angular Material (select/button/form-field/input/card/snackbar), `ngx-mat-select-search`, `sweetalert2`, and the Bootstrap/Molla CSS under `src/assets/`.
- One call in `article.service.ts` (`getTacod`) is **hardcoded to `https://localhost:7166`** instead of `environment.base_url` — fix it if you touch that area.
- `CheckoutComponent` and `RegisterComponent` are declared but their routes are commented out / unused.
- The heavy `src/assets/css/demos/*` and `skins/*` are template leftovers, not all in use.
