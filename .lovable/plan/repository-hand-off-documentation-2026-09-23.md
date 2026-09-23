# Repository hand-off documentation

Goal: make this repo fully understandable, buildable, and maintainable outside Lovable — documentation only, no application code changes.

## What the audit found

- React 19 + TanStack Start/Router (file-based routes in `src/routes`), Vite 8, Tailwind CSS v4 via `src/styles.css`, shadcn/ui + Radix + lucide icons, TanStack Query, Bun (lockfile) with npm also viable.
- **Fully static.** No database, no login, no request-time server code. The Cloud/backend integration files under `src/integrations/supabase/` exist but no page or component uses them.
- Only external service: the public Openverse media API, called from the browser with no credentials, with built-in placeholder art on failure.
- Build: `vite build && node scripts/copy-static-output.mjs` → static output in `dist/client` (raw prerender output `.output/public`). 385 pages prerendered from the list in `vite.config.ts`, `public/_redirects` provides the SPA fallback, `public/sitemap.xml` + `robots.txt` are static.
- No environment variables are required to build or run the site; the `.env` file holds only Lovable-generated Cloud keys the app does not read.

## Step 1 — Rewrite `README.md`

Replace the boilerplate with: overview and live URL (https://pretend.pro / https://pretend-pro-suite.lovable.app), key features (5 pretend desktop/mobile editions, 11 parody apps, 6 locales, power center, fullscreen + fun modes, PWA with splash screens, prerendered static pages), attribution (Web Awesome / Font Awesome Free MIT, Transhumans illustrations, Nebula Sans, Openverse), tech stack, local development (Node 20+/Bun, install, `bun run dev`, note that no `.env` is needed), build and deployment (command, `dist/client`, static host), and a documentation index linking the new `docs/` files and `roadmap.md`. Keep the Lovable editor link.

## Step 2 — Create `docs/`

- **`docs/architecture.md`** — folder map (`src/routes`, `src/components/pretendpro` and its `desktop`/`mobile`/`power` subtrees, `src/lib/{i18n,pretendpro,openverse}`, `src/design-system`, `scripts`, `public`); design decisions (locale as first URL segment, edition/app as route params so every screen is linkable and prerenderable, window/app state in `src/lib/pretendpro`, query-param state restoration, browser-only Openverse fetching with in-memory cache, critical inline CSS + font preloads + Brotli/gzip precompression, screen-reader-only edition headings so the dock is not clipped); gotchas (why the global Web Awesome stylesheet must stay out — it collapsed the onboarding cards; no module-scope timers or clients because prerender must exit; hydration-safe reads of browser storage; `src/routeTree.gen.ts` is generated; adding a locale/edition/app means updating `vite.config.ts` and the sitemap).
- **`docs/deployment.md`** — static hosting flow (Spacefast or any static host), build command and output dir, `_redirects` fallback rule, `public/_headers` cache policy, custom-domain/DNS notes at a high level, sitemap/robots and Search Console verification meta tag, and how the Lovable preview/publish path relates.
- **`docs/environment.md`** — states that no variables are required, documents each name that appears in `.env` (Cloud project id, URL, publishable key) as unused-by-the-app and safe-to-omit, and the two optional Openverse credential names that the current browser-side client does not use. No real values.

## Step 3 — `roadmap.md`

Consolidate the 29 archived plans in `.lovable/plan/` into one list: completed milestones as checked items (onboarding, editions, apps, locales, power center, icons/PWA, performance work, static build) and open items unchecked (remaining performance backlog items, more locales/apps, Openverse resilience, accessibility pass).

## Step 4 — Verify

Check every markdown link resolves to a committed file, grep the new docs for key/token patterns to confirm no secrets, and run a TypeScript typecheck plus the build-error log to confirm nothing broke. No `check` script exists today; the plan does not add one unless you want it.
