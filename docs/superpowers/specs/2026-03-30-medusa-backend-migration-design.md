## Goal

Replace the existing Strapi-backed data + auth + commerce backend with **Medusa** while keeping the **current frontend UI/UX and routing** intact. All Strapi coupling (hardcoded URLs, Strapi response shapes, `populate=*` usage) will be removed from the frontend and replaced with a Medusa-backed integration.

Scope for this project is a **basic ecommerce**:
- products
- categories
- reviews
- addresses
- user management (customers)
- price management
- delivery/shipping options
- payments with **Stripe + Razorpay**

## Current state (what we’re replacing)

- Frontend is a Vite React app using Redux Toolkit.
- API client is centralized in `src/feature/api.js` but is currently **hardcoded** to `http://13.201.41.1:1337/api`.
- Frontend calls Strapi-like endpoints via thunks in `src/feature/leafSlice.js`:
  - `/auth/signup`, `/auth/login`, `/auth/update-passowrd`
  - `/products?populate=*`
  - `/categories?populate=*`
  - `/user-accounts/:id?populate=*`
  - `/addresses` (create/update/delete)
  - `/test?populate=*` (testimonials/content)
- Images are inconsistently built:
  - some use `import.meta.env.VITE_Image_BASE_URL`
  - some hardcode `http://13.201.41.1:1337`

## Target state

- A new Medusa backend lives in `backend/` in this repo.
- Frontend uses **environment variables** for backend base URL(s).
- Frontend data layer is updated so that UI components and pages can stay visually the same, but their data comes from Medusa.
- Payments run through Medusa’s payment flows (no direct `127.0.0.1:5000` payment server).
  - Stripe enabled
  - Razorpay enabled

## Repository layout

- `backend/`: Medusa server (configured for local dev + future deployment)
- `src/`: existing frontend remains; only data access + mapping code changes
- `docker-compose.yml` (repo root): **PostgreSQL + Redis** for local development so the stack always has a real database (Medusa does not replace Strapi’s “single process” dev model).

## Database strategy (Strapi → Medusa)

With **Strapi**, it was common to run everything in one process and use **SQLite in development** or a DB you did not manage explicitly. **Medusa requires PostgreSQL** in normal setups; there is no “skip having a Postgres somewhere” equivalent for a working commerce backend.

### Local development

- Run **PostgreSQL** and **Redis** via Docker Compose from the repo root (`docker-compose.yml`).
- Set `DATABASE_URL` in `backend/.env` to the Compose Postgres URL (see `backend/.env.example`).
- Set `REDIS_URL` to the Compose Redis URL (default `redis://localhost:6379`).
- After the DB is up:
  - If you used `create-medusa-app` **without** `--skip-db`, the installer may have created the DB and run migrations already.
  - If you used **`--skip-db`**, you **must** point `DATABASE_URL` at Postgres and then **run migrations** (and optionally seed) using Medusa’s CLI from `backend/` — otherwise the API will not start. See [create-medusa-app reference](https://docs.medusajs.com/resources/create-medusa-app) for `--skip-db` / `--db-url` behavior.

### Production (AWS)

- Use **Amazon RDS for PostgreSQL** (or another managed Postgres). Store `DATABASE_URL` in **Secrets Manager** or **SSM Parameter Store**.
- Redis: **ElastiCache** if you keep file cache / events on Redis; align `REDIS_URL` with that.

### Why this is in the spec

Without an explicit Postgres (local or cloud), the Medusa backend cannot serve products, carts, or orders. This section removes the assumption that “no separate DB” from the Strapi era carries over unchanged.

## Environment configuration

Frontend:
- `VITE_API_BASE_URL`: Medusa base URL (e.g. `http://localhost:9000`)
- `VITE_IMAGE_BASE_URL`: image/public asset base (may be same as API in dev, can become CDN later)

Backend:
- **`DATABASE_URL`**: PostgreSQL connection string (required for a running backend)
- **`REDIS_URL`**: Redis connection string (matches starter template; Compose provides Redis locally)
- JWT/session secrets (`JWT_SECRET`, `COOKIE_SECRET`)
- CORS: `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` — must include the Vite dev origin `http://localhost:5173` and production storefront origin(s)
- Stripe keys
- Razorpay keys

## Integration approach (recommended)

### Adapter layer in frontend (keep UI stable)

Create a small “backend adapter” boundary so the rest of the UI doesn’t care whether data came from Strapi or Medusa:

- Update `src/feature/api.js` to:
  - use `import.meta.env.VITE_API_BASE_URL` (no hardcoded host)
  - add auth token handling once we pick Medusa auth strategy (customer session/JWT)
- Introduce mapping helpers for:
  - product shape used by UI (`title`, `OrigialPrice`, `image[]`, `documentId` usage)
  - category shape used by UI (`Name`, `image`)
  - review shape used by UI (name/rating/text/image)

This keeps UI components largely unchanged and localizes “Medusa vs old shape” logic.

## Medusa domain mapping

### Products

Old UI expects fields like `title`, `price`, `OrigialPrice`, and arrays of images.
Medusa products typically contain:
- product title
- variants (prices)
- product images

Plan:
- List products from Medusa Store API.
- Map Medusa product fields into the existing UI expectations.
- For “documentId” currently used in routes, use Medusa product `id` consistently.

### Categories

Old code fetches `/categories`.
Medusa supports product categories (and also collections).

Plan:
- Use Medusa product categories for “categories”.
- Map category `name` + image reference if needed.
  - If category images are required, store them either:
    - as category metadata (best minimal approach), or
    - via a small custom endpoint/module that associates media with categories.

### Users / Auth / Addresses

Old endpoints are custom (`/auth/signup`, `/auth/login`) and store a `leafUserid` in localStorage.

Plan:
- Use Medusa customer auth.
- Replace “leafUserid” with Medusa customer `id` and/or rely on session token.
- Addresses will be managed via Medusa customer endpoints and then adapted to match existing address forms.

### Orders / Cart

Current frontend has cart state in Redux.

Plan:
- Keep local cart UI state, but synchronize with Medusa cart:
  - create cart on first add-to-cart
  - update line items on quantity changes
  - fetch totals from Medusa to ensure accurate pricing

### Delivery / shipping options

Current frontend shows delivery/serviceability checks and “shipping info” UI.

Plan:
- Use Medusa regions + shipping options to represent deliverability and shipping methods.
- For pincode serviceability (if required), add a small custom endpoint in the Medusa backend that:
  - checks whether a pincode is deliverable (via your carrier API or rules)
  - returns estimated dates / method availability

### Reviews

Current frontend shows “reviews”/testimonials content.

Plan (basic ecommerce):
- Prefer Medusa-native product reviews if available via a community module/plugin; otherwise implement a small custom resource in the Medusa backend:
  - list reviews for a product
  - create review (authenticated customer)
  - moderate/approve if desired later (optional)

### Payments (Stripe + Razorpay)

Current frontend calls local endpoints for Stripe (`http://127.0.0.1:5000/create-payment-intent`) and uses Stripe Elements.

Plan:
- Configure Medusa payment providers in backend:
  - Stripe provider
  - Razorpay provider
- Frontend checkout flow:
  - create/update cart
  - initiate payment session via Medusa
  - confirm payment using provider-specific client flow (exact API depends on Medusa version/provider)
- Remove dependency on the `127.0.0.1:5000` payment server.

## Admin / price management

Basic ecommerce needs price + product management.

Plan:
- Use Medusa Admin (admin UI) for product/catalog management.
- Prices are controlled via variants and price rules (depending on Medusa version/features enabled).
- This repo will host the Medusa server; the Medusa Admin UI can run separately but will point at the `backend/` API.

## Required frontend changes (high level)

- Remove hardcoded API base URL in `src/feature/api.js` and switch to env.
- Replace hardcoded image host strings with a single helper that uses `VITE_IMAGE_BASE_URL`.
- Update thunks in `src/feature/leafSlice.js` to call Medusa endpoints (and content endpoints).
- Ensure routing uses Medusa IDs consistently.

## Non-goals

- Visual redesign of UI.
- Migrating historical Strapi data automatically (can be added later).

## Acceptance criteria

- App runs locally with:
  - **Docker Compose** bringing up Postgres + Redis (`docker compose up -d` from repo root)
  - `DATABASE_URL` / `REDIS_URL` configured for `backend/`
  - `npm run dev` for frontend
  - Medusa backend running from `backend/` (`npm run dev` / `yarn dev`)
- Products, categories, testimonials load from Medusa (not Strapi).
- Signup/login works against Medusa.
- Addresses CRUD works.
- Cart and checkout complete successfully using Medusa + Stripe (no `127.0.0.1:5000` dependency).
- Cart and checkout complete successfully using Medusa + Razorpay as an alternative payment option.
- No hardcoded Strapi hosts remain in frontend.

