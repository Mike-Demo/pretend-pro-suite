# Spacefast build spec

PretendPro Office Suite is a fully static site. Every page is rendered to HTML at
build time; there is no server runtime, no database, and no login.

## Commands

| Step    | Command                                             |
| ------- | --------------------------------------------------- |
| Install | `npm install`                                       |
| Build   | `vite build && node scripts/copy-static-output.mjs` |

`npm run build` runs exactly that pair.

## Output

- **Static output directory (deploy this): `dist/client`**
- Raw Nitro/prerender output: `.output/public` — the post-build script copies it
  into `dist/client`, which is where static hosts look.

## What's in the output

- One `index.html` per public page: the unprefixed home page plus, for each of
  the 6 locales, the locale home page, 5 edition pages, 55 edition + app pages,
  and licenses/privacy/terms — 385 pages total.
- `sitemap.xml` — static, lists all 385 canonical URLs.
- `robots.txt` — points at `/sitemap.xml`.
- `_redirects` — `/*  /index.html  200` so deep links and the legacy unprefixed
  URLs (`/fruit`, `/licenses`, ...) resolve through the client router.
- Hashed assets, fonts, icons, PWA manifest and splash images, plus `.br`/`.gz`
  precompressed variants of JS/CSS/SVG.

## Notes

- The page list lives in `vite.config.ts` under `tanstackStart.pages`, with
  `prerender: { enabled: true, autoStaticPathsDiscovery: false }`. Adding a
  locale, edition, or app means adding it to the arrays at the top of that file
  and regenerating `public/sitemap.xml`.
- `@lovable.dev/vite-tanstack-config` must be 2.20.0 or newer; older versions
  prerender nothing without reporting it.
- Do not set `nitro: { preset: "static" }` — it breaks the SSR build.
- Photo/audio content is fetched in the browser from the public Openverse API.
  It needs no credentials, and every surface falls back to built-in placeholder
  art if the request fails.
