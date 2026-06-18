# Pulse Press

A blog CRUD app built with Next.js App Router and TypeScript. There's no database or auth of its own — all post data lives in a shared, third-party REST API, and "your posts" is simulated client-side via a cookie that tracks which post IDs you created in this browser.

## Stack

- **Next.js 16** (App Router, Server Components, `next/image`)
- **TypeScript** — all types live under a centralized `types/` folder that mirrors the source tree
- **Axios** for HTTP, **sonner** for toast notifications
- Plain CSS Modules for styling (dark, minimal "premium SaaS" theme)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the shared posts API (see `.env.example`) |

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next/core-web-vitals`)

There is no test suite configured in this repo.

## Architecture

- `services/http.ts` — single axios instance, `baseURL` read from `NEXT_PUBLIC_API_BASE_URL`.
- `services/posts.ts` — CRUD functions (`readPost`, `createPost`, `updatePost`, `deletePost`). Every function returns an `ApiResult<Post>` and never throws; callers branch on `result.result`.
- `services/posts.server.ts` — server-only data access (uses `next/headers` cookies). All pages read through this, not `services/posts.ts` directly.
- **Ownership model:** the shared API has no concept of users, so "your posts" is simulated entirely client-side. Creating a post adds its ID to a `pulse-owned-post-ids` cookie; `services/posts.server.ts` filters reads against that cookie, so a post that exists in the API but isn't in your cookie is treated as not found.
- `app/` pages are server components that fetch data via `services/posts.server.ts`. All mutation UI (`PostForm`, `DeletePostButton`, search) is isolated as `"use client"` components/hooks under `features/posts/`.
- `shared/ui` holds the cross-cutting UI kit (`Button`, `Modal`, `EmptyState`, etc.), `shared/hooks` holds reusable client hooks (`useDebounce`, `useDisclosure`, `useTrackedPosts`), `shared/providers` wires up app-wide providers like the toaster.

See `CLAUDE.md` for the full architecture writeup, including TypeScript conventions.

## Features

- Create, read, update, and delete posts against the shared API
- Per-browser "my posts" list via a tracked-post-ids cookie
- Debounced (500ms) client-side search by title on the archive page
- SEO metadata per post (`generateMetadata`), dark theme, toast notifications for success/error states
