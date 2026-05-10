# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AVA CMS** is a custom Content Management System built for an EMR (Electronic Medical Records) platform that streamlines patient record management and clinic operations. The CMS serves as the administrative backbone of the EMR platform, enabling clinics and healthcare staff to efficiently manage patient data, medical records, and operational content while maintaining data integrity, security, and compliance.

## Tech Stack

- **Framework**: Next.js 15 with App Router (React 18.2.0, TypeScript 5)
- **State Management**: Zustand (global state) + TanStack Query (server-state)
- **UI Library**: Ant Design 5 with next-themes for dark/light mode
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

```bash
npm run dev
```

The app runs on the port specified by `$MDX_CMS_PORT` environment variable. Environment variables should be set as:
- `MDX_CMS_PORT`: Port for CMS (default uses env var)
- `MDX_BEND_HOST`: Backend hostname (e.g., `localhost` for local)
- `MDX_BEND_PORT`: Backend port (e.g., `8000`)
- `DEPLOY_ENV`: `local` or production; determines if HTTP or HTTPS is used

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

Dashboard routes require valid session cookie. Middleware in `src/middleware.ts` enforces this for `/dashboard` matcher. Other protected routes rely on client-side `usePageAuth(true)` checks.

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
| `MDX_CMS_PORT` | Port the CMS runs on |
| `MDX_BEND_HOST` | Backend hostname (e.g., `localhost`) |
| `MDX_BEND_PORT` | Backend port (e.g., `8000`) |
| `DEPLOY_ENV` | `local` or production — determines HTTP vs HTTPS for backend rewrites |
