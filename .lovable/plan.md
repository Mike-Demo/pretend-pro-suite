# Static build for Spacefast

The site can be fully static once three server-dependent pieces are removed or moved into the browser, which you approved:

- Delete the human-check page and its gate.
- Fetch photo/audio content straight from the browser instead of through the server.
- Delete the sign-in page.

Everything else already renders the same page for every visitor, so all ~385 public pages can be baked into files at build time.

## What changes

1. **Remove the human check.** Delete the verify page, its server code, and the check that runs before every page load. Visitors go straight in.
2. **Remove sign-in.** Delete the sign-in page and its route.
3. **Media without a server.** Move the Openverse image/audio lookup into browser-side code that calls the public Openverse API directly (anonymous, no credentials). The existing placeholder art still shows if a request fails or is rate-limited, so the apps never look broken. Delete the server-side media code.
4. **Bake every page into a file.** Enumerate all public pages in the build config and turn prerendering on with discovery disabled. Pages: the unprefixed home page, the unprefixed edition and legal pages, and for each of the 6 locales — the locale home page, 5 edition pages, 55 edition + app pages, and licenses/privacy/terms. Bump the build tool to 2.20.0 or newer first; older versions quietly bake nothing.
5. **Output where a static host expects it.** Keep the normal build, then copy the generated pages into `dist/client` with a small re-runnable script, and change the build command to run both steps.
6. **Static sitemap, robots, deep links.** Replace the server-generated sitemap with a plain `public/sitemap.xml` covering every page, confirm `robots.txt` points at it, and add `public/_redirects` with `/*  /index.html  200` so refreshing a deep link works.
7. **Build notes.** Add `SPACEFAST.md` with the install command, the build command, and the output folder.

Page titles and descriptions are already defined per page, so they get baked into each file — nothing to move.

## Technical details

- `vite.config.ts`: `tanstackStart.pages` gets one entry per concrete path (parameterized routes cannot be patterns), plus `prerender: { enabled: true, autoStaticPathsDiscovery: false }`. No `nitro: { preset: "static" }` — it breaks the SSR build.
- `package.json`: `@lovable.dev/vite-tanstack-config` → `^2.20.0`; `build` → `vite build && node scripts/copy-static-output.mjs`.
- `scripts/copy-static-output.mjs`: idempotent copy of `.output/public` → `dist/client`, cleaning the target, no-op when output already lives there.
- Deletions: `src/routes/verify.tsx`, `src/routes/auth.tsx`, `src/lib/captcha/*`, `src/routes/sitemap[.]xml.ts`, and the captcha gate in `src/routes/__root.tsx` `beforeLoad`. `src/lib/openverse/openverse.functions.ts` and `openverse.server.ts` are replaced by a browser fetch module consumed by the existing `useOpenverseImages` / `useOpenverseAudio` hooks; `src/start.ts` keeps its error and CSRF middleware.
- If the build writes every page and then hangs, the cause is a timer held open during prerender (module-scope timers, TanStack Query `gcTime`, module-scope clients) — fixed with lazy creation, `.unref()`, or a `process.env.TSS_PRERENDERING` guard.

## Verification

Typecheck, full build, confirm an `index.html` exists for every listed page plus `sitemap.xml`, `robots.txt` and `_redirects` in `dist/client`, then open a sample of prerendered pages in a browser — home, each edition, an app page, a locale page, and the legal pages — checking that they render and that query-parameter state still restores after load. Anything that only works before the build gets reported rather than glossed over.
