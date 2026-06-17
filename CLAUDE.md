# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next/core-web-vitals`)

There is no test suite/framework configured in this repo.

## Architecture

This is "Pulse Press", a Next.js App Router blog CRUD app with **no database or auth of its own** — all post data lives on a shared public external API.

- `services/http.js` — single axios instance, `baseURL` pointed at `https://blog-api-t6u0.onrender.com/posts` (a third-party API shared by all users of this codebase, not something this repo controls).
- `services/request-handlers.js` — `successHandler(response)` / `errorHandler(error)` normalize any axios response/error into `{ data, status, result }` (`result` is a boolean).
- `services/posts.js` — raw CRUD against the API (`readPost`, `createPost`, `updatePost`, `deletePost`), built on the handlers above. Every function always returns the `{ data, status, result }` object (never throws) so callers branch on `result.result`. `normalizePost` adds a `displayId` field mirroring `id` and is applied to every function's `data`.
- `services/posts.server.js` — server-only (uses `next/headers` `cookies()`); this is what every page imports for reads, never `services/posts.js` directly.

**Ownership model:** because the external API has no concept of users, "your posts" is simulated entirely client-side. Whenever a post is created, its id is appended to a cookie (`pulse-owned-post-ids`, see `shared/lib/tracked-posts.js`) and that cookie is the only record of which posts belong to the current browser. `services/posts.server.js#getPosts`/`getPost` read that cookie and filter/guard against it — a post that exists on the shared API but isn't in the cookie is treated as not found (`notFound()` is called). `shared/hooks/useTrackedPosts.js` is the client-side mirror used by create/delete flows to keep the cookie in sync after a mutation.

**Route/component split:** pages under `app/` (`app/page.jsx`, `app/posts/page.jsx`, `app/posts/[id]/page.jsx`, `app/posts/[id]/edit/page.jsx`, `app/create/page.jsx`) are server components exporting `dynamic = "force-dynamic"` and fetch via `services/posts.server.js`. All mutation UI is isolated into `"use client"` components/hooks under `features/posts/` (`PostForm`, `DeletePostButton`, `useSavePost`, `useDeletePost`), which call `services/posts.js` directly, sync the tracked-posts cookie via `useTrackedPosts` on success, and report errors back into local state (no global error/store).

**Shared layer:** `shared/ui` holds the presentational kit (`Button`, `Modal`, `ConfirmModal`, `EmptyState`, `StatusPanel`, `Kicker`, `LoadingState`, `EditorialFormLayout`) used across both server and client components. `shared/providers` holds app-wide wrappers mounted in `app/layout.jsx`: `AppToaster` (sonner-based toasts, driven by `shared/lib/notifications.js`). Render errors are handled by Next's own `app/error.jsx`/`app/not-found.jsx` segment boundaries — there's no extra manual error-boundary component.

Path alias: `@/*` maps to the project root (`jsconfig.json`).
