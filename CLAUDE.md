# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AVA CMS** is a custom Content Management System built for an EMR (Electronic Medical Records) platform that streamlines patient record management and clinic operations. The CMS serves as the administrative backbone of the EMR platform, enabling clinics and healthcare staff to efficiently manage patient data, medical records, and operational content while maintaining data integrity, security, and compliance.

## Tech Stack

- **Framework**: Next.js 15 with App Router (React 18.2.0, TypeScript 5)
- **State Management**: Zustand (global state) + TanStack Query (server-state)
- **UI Library**: Ant Design 5 with next-themes for dark/light mode
- **Charts**: Recharts (AreaChart sparklines, BarChart — used in dashboard analytics)
- **HTTP Client**: Axios with custom request wrapper
- **Icons**: Lucide React
- **Authentication**: JWT-based with cookie storage (ava_cms_session)
- **Node Version**: 20.11.1

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (dashboard)/              # Protected dashboard routes (require auth)
│   │   ├── bill-exemption/
│   │   ├── business-intelligence/ (general, basic-stats, other)
│   │   ├── clinics/
│   │   ├── dashboard/
│   │   ├── drugs/
│   │   ├── mco/
│   │   ├── patients/
│   │   └── user/                 (cms-admins, practitioners, subscribers)
│   ├── api/v1/[...path]/         # Demo mode catch-all API route handler
│   │   └── route.ts              # Handles all /api/v1/* endpoints via mock data
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Login page (public)
│   └── globals.css
├── components/                   # Reusable React components
│   ├── [feature]/                # Feature-specific components (table, create, edit, details, etc.)
│   ├── login-form.tsx
│   ├── menu.tsx                  # Desktop sidebar menu
│   ├── mobile-menu.tsx
│   ├── user-avatar.tsx
│   └── theme-switcher.tsx
├── mocks/
│   └── store.ts                  # In-memory mock data store (demo mode only)
├── services/                     # API service layer (request wrappers)
│   ├── auth.ts                   # Login/logout
│   ├── patients.ts
│   ├── clinics.ts
│   └── [other-resources].ts
├── stores/                       # Zustand stores (global state)
│   ├── sidebarStore.ts           # Sidebar collapse state
│   └── userStore.ts              # Authenticated user data
├── hooks/                        # Custom React hooks
│   └── useAuthCheck.ts
├── utilities/                    # Helper functions and utilities
│   ├── pageAuth.ts               # Auth check hook for pages
│   ├── token.ts                  # Token validation and refresh
│   ├── request.ts                # Axios request wrapper
│   ├── isTokenExpired.ts
│   └── helpers/
├── providers/                    # Context providers
│   └── ant-design-providers.tsx  # Theme, TanStack Query, Ant Design setup
└── middleware.ts                 # Next.js middleware for session validation
```

## Key Architecture Patterns

### Authentication Flow

1. **Session Cookie**: Auth state stored in `ava_cms_session` cookie containing JWT tokens, CSRF token, and user info
2. **Token Refresh**: Automatic token refresh on expiry via `getValidToken()` utility before requests
3. **Protected Routes**: Middleware redirects unauthenticated requests to login page; dashboard layout checks auth via `usePageAuth()`
4. **Target App Validation**: Users must have CMS in their `target_apps` to access the platform

**Auth Files**: `src/middleware.ts`, `src/utilities/pageAuth.ts`, `src/utilities/token.ts`, `src/services/auth.ts`

### API Communication

- **Base URL**: `/api/v1` (next.config.mjs rewrites to backend via `MDX_BEND_HOST` and `MDX_BEND_PORT`)
- **Request Wrapper**: All requests go through `src/utilities/request.ts` which automatically includes Bearer token
- **Pattern**: Services in `src/services/` call `request.get/post/put/patch/delete()` with endpoint paths
- **Response Handling**: Most services extract `.data?.data` or `.data?.pagination` from responses

**Example Service Pattern**:
```typescript
export async function getResourceService(id: any) {
  const response = await request.get(`/resource/${id}/`);
  return response?.data?.data;
}
```

### State Management

- **Zustand Stores** (`src/stores/`): UI state (sidebar collapse, authenticated user data)
- **TanStack Query** (`src/providers/ant-design-providers.tsx`): Server-state caching and synchronization
- **User Store**: Stores `firstName`, `accessToken`, `cms_role` for authenticated user

### Component Organization

- Feature-based components live in `src/components/[feature-name]/`
- Each feature typically has: `table.tsx`, `create.tsx`, `edit.tsx`, `details.tsx`, `add.tsx`
- Components use Ant Design for UI, Lucide React for icons
- Form submission typically uses Ant Design Form with TanStack Query mutations

### Layout Structure

- **Root Layout** (`src/app/layout.tsx`): AntDesignProviders, theme cookie handling
- **Dashboard Layout** (`src/app/(dashboard)/layout.tsx`): Responsive sidebar + header with user avatar
  - Desktop: Fixed sidebar (80px collapsed / 200px expanded)
  - Mobile: Drawer-based menu (triggered by header button)
- **Sidebar State**: Managed via `useSidebarStore` (Zustand)
- **Theme**: Toggled via cookies, applied through `next-themes` + Ant Design ConfigProvider

## Common Development Tasks

### Running the Development Server

**Demo mode (no backend required):**
```bash
npm run dev:demo
```
Runs on port 3000. Requires `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local` (already set).

**Original mode (requires Django backend + env vars):**
```bash
npm run dev
```
Requires `MDX_CMS_PORT`, `MDX_BEND_HOST`, `MDX_BEND_PORT`, `DEPLOY_ENV` to be set.

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Important Implementation Notes

### Authentication Checks

- Use `usePageAuth(requiresAuth: boolean)` hook in client components to check auth status
  - `true`: redirects to login if not authenticated
  - `false`: redirects to dashboard if already authenticated (login page)
- Returns `isChecking` boolean to show loading state while validating session

### API Request Headers

All private API requests automatically include:
- `Authorization: Bearer ${accessToken}`
- `Content-Type: application/json`
- `Accept: application/json`

Public endpoints (e.g., login) pass `isPrivate: false` as third parameter to request methods.

### Protected Routes

- **Demo mode**: Middleware protects all non-API routes — any request without an `ava_cms_session` cookie is redirected to `/` (login). API routes (`/api/*`) are always allowed through.
- **Production mode**: Middleware protects `/dashboard`; all other protected routes rely on client-side `usePageAuth(true)` checks.

### Error Handling

- Login errors: Extracted from `response.data.error.detail` or `response.data.error.non_field_errors`
- Service methods should be wrapped in try/catch in components
- Ant Design Message API used for user notifications

### Responsive Design

- Uses Ant Design's `Grid.useBreakpoint()` hook to detect mobile (`!screens.lg`)
- Sidebar collapses to drawer on mobile
- Menu component has separate desktop (Menu) and mobile (Drawer) variants

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_DEMO_MODE` | `true` enables demo mode (mock auth + mock API, no backend needed) |
| `MDX_CMS_PORT` | Port the CMS runs on (original mode only) |
| `MDX_BEND_HOST` | Backend hostname, e.g. `localhost` (original mode only) |
| `MDX_BEND_PORT` | Backend port, e.g. `8000` (original mode only) |
| `DEPLOY_ENV` | `local` or production — determines HTTP vs HTTPS for backend rewrites (original mode only) |

`.env.local` currently has `NEXT_PUBLIC_DEMO_MODE=true`.

---

## Demo Mode

The app can run fully self-contained with no Django backend. Set `NEXT_PUBLIC_DEMO_MODE=true` and run `npm run dev:demo`.

### How it works

**Simulated auth flow** — demo mode runs the real login/logout/protected-route flow end-to-end, using mock credentials and a mock API instead of a Django backend:

- `src/components/login-form.tsx`: Pre-populates the login form with demo credentials (`admin@demo.com` / `demo1234`) and shows an info banner. Sets the `ava_cms_session` cookie without the `secure` flag so it works on `http://localhost`.
- `middleware.ts`: In demo mode, protects all non-API routes — redirects to `/` if no `ava_cms_session` cookie is present. Does **not** auto-inject a session cookie (users must log in).
- `src/utilities/token.ts`: Reads the access token from the real `ava_cms_session` cookie (no demo shortcut).
- `src/utilities/pageAuth.ts`: Reads and parses the real `ava_cms_session` cookie to populate the user Zustand store (no demo shortcut).
- Mock login (`POST /api/v1/account/login/`): Returns a mock session payload that `login-form.tsx` stores as the `ava_cms_session` cookie, exactly like production.
- Mock logout (`POST /api/v1/account/logout/`): Returns 200; `user-avatar.tsx` clears the cookie and redirects to `/`.

**Mock API** — `next.config.mjs` skips the Django proxy rewrite in demo mode. Requests to `/api/v1/*` are handled by the catch-all Next.js route handler at `src/app/api/v1/[...path]/route.ts`.

**Response shape contract** — services read responses as:
- Non-paginated: `response?.data?.data` → API JSON body: `{ data: <object or array> }`
- Paginated: `response?.data?.data` + `response?.data?.pagination` → API JSON body: `{ data: [...], pagination: { count, next, previous } }`

**In-memory data store** — `src/mocks/store.ts` holds module-level arrays for all entities. CRUD mutations (POST/PATCH/DELETE) mutate these arrays in-place. Data persists for the lifetime of the dev server process and resets on restart.

### Path matching in the catch-all handler

All API route services append trailing slashes (e.g. `/account/cms/ca1/`). Next.js passes the catch-all segments including an empty string for the trailing slash: `["account", "cms", "ca1", ""]`. Every HTTP method handler strips empty segments before matching:

```typescript
segments.splice(0, segments.length, ...segments.filter(Boolean));
```

The `match()` helper does exact-length segment matching with `:param` placeholders.

### Mock data entity shapes

All entities in `src/mocks/store.ts`. The shapes below are what components actually read — do not change field names without checking the table/detail components first.

| Entity | Key fields |
|---|---|
| `clinics` | `id, name, is_active, subscriber, subscriber_id, practice, contact_number, license_number` |
| `branches` | `id, clinic_id, name, address, contact_number, is_active, created, modified` |
| `mcos` | `id, name, code, kind, email, contacts: [{label, phone}], notes` |
| `mcoEntries` | `id, clinic_id, mco, mco_name, code, name, kind, email, contacts, notes, status, is_active` |
| `drugs` | `id, generic_name, brand_name, dosage` |
| `billExemptions` | `id, recipient_name, email, subscription_type, duration, status, subscription_date, activate_date, deactivate_date, inactive_reason, subscriber` |
| `cmsAdmins` | `id, display_name, email, contact_number, cms_role, is_active` |
| `subscribers` | `id, display_name, email, contact_number, subscription, clinic_role, is_active, clinic_name, clinic_id` |
| `practitioners` | `id, practice, branch_name, branch_id, clinic_id, branches: [{id, name, clinic_id, clinic_name}], account: {display_name, first_name, middle_name, last_name, email, contact_number, subscription}` |
| `clinicUsers` | `id, display_name, email, contact_number, user_type, clinic_role, subscription, is_active, clinic_id, clinic_name, branch_id, branch_name` (patients also need `branch_name`) |
| `patientMcos` | `id, patient_id, mco: {id, name, code}, mco_name, mco_number, policy_number, plan, valid_until, is_active` |
| `billings` | `id, clinic_id, name, amount, amount_due, amount_due_currency, subscription_type, status, payment_status, due_date, paid_date, created, modified` |
| `biGeneral` | `{ basic: {subscriptions, total_users}, pro, biz, prime, extra: {total_clinic_users, total_subscriptions, total_clinics} }` |
| `biActiveAccounts` | `{ basic: [["key", value], ...], pro, biz, prime, total }` — tuple arrays consumed by `flattenData()` |

### Dashboard Analytics Page

`src/app/(dashboard)/dashboard/page.tsx` — client component with live data from three services:

| Service | Data used |
|---|---|
| `getGeneralsService()` | `extra.total_clinics`, `extra.total_clinic_users`, `extra.total_subscriptions` for stat cards |
| `getBasicStatsService()` | `biActiveAccounts` tuple arrays — `flattenClinicRanking()` extracts per-clinic user counts for the ranking list |
| `getClinicsService()` | Clinic list — derives `activeClinics` count and `activeRate` |

**Layout:**
- **Top row** (4 cards, responsive xs→sm→lg = 1→2→4 columns):
  - Total Clinics — number + trend arrows + active count
  - Total Users — number + purple `AreaChart` sparkline (Recharts)
  - Subscriptions — number + blue `BarChart` mini-chart (Recharts)
  - Clinic Active Rate — number + Ant Design `Progress` bar + trend arrows
- **Bottom card** — tab switcher (Subscriptions / Users) + period filter (Today / This Week / This Month / This Year) → slices `MONTHLY_SUBSCRIPTIONS` or `MONTHLY_USERS` static arrays → `BarChart` (left 70%) + clinic ranking list (right 30%)

**Static trend data** — `MONTHLY_SUBSCRIPTIONS` and `MONTHLY_USERS` are 12-entry arrays defined in the page file. They represent simulated historical data since the mock store has no time-series records. The sparklines always display the full 12 months; the main bar chart slices them by the selected period.

**Clinic ranking** — `flattenClinicRanking(stats)` iterates `["basic", "pro", "biz", "prime"]` plan keys in `biActiveAccounts`, finds the `"clinics"` tuple in each, and flattens all clinic entries into a single array sorted by `total_users` descending. Top 3 get filled circle badges; the rest get gray outlines.

### Deploying to Vercel

1. Push repo to GitHub
2. Connect to Vercel
3. Set environment variable: `NEXT_PUBLIC_DEMO_MODE=true`
4. Deploy — no database or external service needed
