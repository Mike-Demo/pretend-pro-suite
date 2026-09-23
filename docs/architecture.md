# Architecture

PretendPro Office Suite is a fully static React 19 + TanStack Start site. Every
public page renders the same HTML for every visitor and is baked to a file at
build time.

## Codebase layout

```text
src/
  routes/                  file-based routes (TanStack Router)
    __root.tsx             html shell, head metadata, fonts, PWA links, JSON-LD
    index.tsx              onboarding / landing page
    $locale/               locale-prefixed pages (the real site)
      route.tsx            validates the locale param, provides i18n context
      index.tsx            locale home
      fruit|apperture|bufferium|android|fos.tsx        edition layout
      *.index.tsx          edition home  (/:locale/:edition)
      *.$app.tsx           edition + app (/:locale/:edition/:app)
      licenses|privacy|terms.tsx
    fruit|apperture|...|licenses|privacy|terms.tsx     legacy unprefixed redirects
    routeTree.gen.ts       GENERATED — never edit by hand
  components/pretendpro/
    Onboarding.tsx         two-step "pick a style, pick a task" entry flow
    Suite.tsx              renders the chosen edition shell
    WindowFrame.tsx        OS theme definitions + window chrome
    desktop/               Fruit/Apperture/Bufferium shells, AppWindow, dock,
                           command palette, shortcuts overlay
    mobile/                Android/FOS shells, home screen, recents, status bar
    power/                 pretend power center (menu, settings, status, battery)
    <AppName>.tsx          the eleven parody apps
    app-screens.tsx        app id -> screen component registry
    chrome.tsx             AppId type, titles, icons
  lib/
    pretendpro/            windows.ts (window state machine), content.ts (fake
                           copy), appearance, fullscreen, fun-mode, phone,
                           power, search, app-ids
    i18n/                  locales.ts (locale ids + metadata), strings.ts,
                           context.tsx, head.ts (hreflang/canonical)
    openverse/             search.ts (browser-side API client), types.ts
    seo.ts                 shared head() metadata helper
  design-system/           vendored Web Awesome + Font Awesome copy (do not edit)
  integrations/            generated Lovable Cloud clients — UNUSED by the app
  assets/                  fonts, illustrations, logo (asset-pointer JSON)
scripts/
  copy-static-output.mjs   .output/public -> dist/client after the build
  perf/                    lighthouse / bundle / network measurement helpers
public/                    icons, manifest, splash images, sitemap.xml,
                           robots.txt, _redirects, _headers
vite.config.ts             prerender page list + asset precompression plugin
```

## Design decisions

**URL is the source of truth.** Locale is the first path segment, edition and app
are path params (`/us-en/fruit/docufaker`). Every screen is therefore
linkable, shareable and prerenderable. Transient UI state (open window, active
tab, fun mode) lives in component state or query params so hydration can restore
it; nothing important hides in memory only.

**Locale handling.** `src/lib/i18n/locales.ts` is the single registry of the six
locales and their `htmlLang`. `$locale/route.tsx` validates the param and
provides the strings context; `__root.tsx` derives `<html lang>` from the first
path segment with an `en` fallback. Unprefixed legacy paths (`/fruit`,
`/licenses`, …) are redirect-only routes and are intentionally not prerendered —
the SPA fallback resolves them.

**Window state.** `src/lib/pretendpro/windows.ts` owns the desktop window
machine (open/focus/minimize/geometry) and `phone.ts` the mobile equivalent.
Shells are presentational; they read and dispatch against those modules. This
keeps the eleven app components free of any layout knowledge.

**Client vs. server boundary.** There is no server boundary: no server
functions, no API routes, no loaders that need a request. Data fetching happens
in the browser only. TanStack Query is used for the Openverse lookups; route
loaders are not used for remote data.

**Openverse media.** `src/lib/openverse/search.ts` calls the public Openverse
API anonymously from the browser and memoizes results in an in-memory cache
(10-minute TTL, 200-entry cap). Failures and rate limits resolve to an empty
result so the components fall back to bundled placeholder art — the apps never
look broken.

**Performance patterns.**
- Critical inline CSS in `__root.tsx` paints the right background/font on first
  paint; the stylesheet and fonts are preloaded.
- `vite.config.ts` precompresses hashed JS/CSS/SVG to `.br` and `.gz`, keeping a
  variant only when it is actually smaller.
- Illustrations ship as WebP with SVG sources; colored variants load only for the
  selected onboarding card.
- The edition heading is screen-reader-only (`sr-only`) so the full-height OS
  screen is not pushed down and the dock is never clipped.

## Gotchas & lessons learned

- **Do not add the global Web Awesome stylesheet.** Its `native.css` forces every
  native `<button>` to a fixed ~43px height, which collapsed the ~198px
  onboarding cards into overlapping strips. The design-system folder stays
  vendored and unused at runtime; only the Font Awesome 7.3.1 stylesheet is
  linked. Loading a `WebAwesomeLoader` would register 70 unused custom elements.
- **Prerender must be able to exit.** Never create timers, pollers or clients at
  module scope in code the server bundle reaches. If a build writes every page
  and then hangs, look for a module-scope `setInterval`, a TanStack Query
  `gcTime`, or an eagerly constructed client. Fix with lazy creation, `.unref()`,
  or a `process.env.TSS_PRERENDERING` guard.
- **Prerendering is opt-in and silent when misconfigured.**
  `@lovable.dev/vite-tanstack-config` must be ≥ 2.20.0; older versions exit 0 and
  bake nothing. `tanstackStart.pages` takes concrete paths only — parameterized
  routes cannot be patterns — with
  `prerender: { enabled: true, autoStaticPathsDiscovery: false }`.
- **Adding a locale, edition or app is a three-file change:** the registry
  (`locales.ts` / `app-ids.ts` / edition routes), the arrays at the top of
  `vite.config.ts`, and `public/sitemap.xml`.
- **Never set `nitro: { preset: "static" }`** — it breaks the SSR build with
  "rolldownOptions.input should not be an html file". The normal SSR build
  already prerenders into `.output/public`.
- **Hydration safety.** Read `localStorage`/`matchMedia` in an effect, not in a
  `useState` initializer — a `typeof window` guard still mismatches on hydration.
  Appearance and locale preferences follow this pattern.
- **`src/routeTree.gen.ts` is generated.** Add or rename files under
  `src/routes/` instead; the plugin rewrites it. A `FileRoutesByPath` type error
  means a referenced route file does not exist yet.
- **Head metadata lives in each route's `head()`** (via `src/lib/seo.ts`) so
  titles, descriptions and og tags are baked into the prerendered HTML. Anything
  set only after hydration is invisible to crawlers.
- **Removed on purpose:** the hCaptcha gate, the `/verify` page and the `/auth`
  sign-in page — all needed request-time secrets or a session, which a static
  host cannot provide. Do not reintroduce them without a server.
