# Deployment

The site is a folder of static files. Any static host will serve it; no Node
runtime, database or serverless function is required in production.

## Build

```sh
bun install                                            # or npm install
bun run build                                          # or npm run build
# = vite build && node scripts/copy-static-output.mjs
```

| Thing                          | Value                               |
| ------------------------------ | ----------------------------------- |
| Install command                | `bun install` / `npm install`       |
| Build command                  | `vite build && node scripts/copy-static-output.mjs` |
| Publish / output directory      | **`dist/client`**                   |
| Raw prerender output           | `.output/public` (copied into `dist/client`) |
| Node version                   | 20 or newer                         |
| Required env vars              | none                                |

`scripts/copy-static-output.mjs` is idempotent: it cleans and refills
`dist/client`, and no-ops if the site already lives there.

## What ends up in `dist/client`

- One `index.html` per public page — the unprefixed home page plus, for each of
  the 6 locales, the locale home, 5 edition pages, 55 edition + app pages and
  licenses/privacy/terms: **385 pages**.
- `sitemap.xml` (static, all 385 canonical URLs) and `robots.txt` pointing at it.
- `_redirects` and `_headers`.
- Hashed assets, fonts, icons, PWA manifest and splash images, plus `.br`/`.gz`
  precompressed JS/CSS/SVG variants.

The page list lives at the top of `vite.config.ts` under `tanstackStart.pages`
with `prerender: { enabled: true, autoStaticPathsDiscovery: false }`. Adding a
locale, edition or app means updating those arrays and `public/sitemap.xml`.

## URL rewrite / fallback rules

`public/_redirects`:

```text
/*  /index.html  200
```

This is a rewrite, not a redirect: prerendered files win, and anything else
(client-side navigations, the legacy unprefixed paths like `/fruit`, a refreshed
deep link) falls through to the client router. On hosts that use a different
mechanism, configure the equivalent:

- **Netlify / Spacefast / Cloudflare Pages** — `_redirects` is read as-is.
- **Vercel** — add `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
  to `vercel.json`.
- **Nginx** — `try_files $uri $uri/index.html /index.html;`
- **S3 + CloudFront** — set both the index and error document to `index.html`.

## Caching

`public/_headers` sets long-lived immutable caching for `/assets/*` (hashed
filenames) and a one-week revalidate window for icons, the manifest and splash
images. HTML is left to the host's default so a redeploy is picked up promptly.
Hosts that ignore `_headers` should be configured with the same policy.

## Domain & DNS

1. Deploy the build output first — a domain pointed at an empty site serves
   nothing.
2. Add the apex/`www` records your host specifies (usually an `A`/`ALIAS` record
   for the apex and a `CNAME` for `www`), then let the host issue TLS.
3. Canonical host is `https://pretend.pro`. It appears in
   `public/sitemap.xml`, `public/robots.txt`, the JSON-LD in
   `src/routes/__root.tsx` and the canonical/hreflang helpers in
   `src/lib/i18n/head.ts` — **change all of those together** if the domain
   changes.
4. Redirect `www` → apex (or the reverse) at the host so only one canonical host
   is indexed.

## Search engines

- `robots.txt` advertises `https://pretend.pro/sitemap.xml`.
- A Google Search Console ownership meta tag is present in
  `src/routes/__root.tsx` (`google-site-verification`). It is a public
  verification token, not a secret; keep it in place or re-verify by another
  method.
- The sitemap is already submitted for the current property. Re-submit after any
  change that adds or removes pages.

## Lovable preview vs. production

Editing continues in the Lovable editor, which runs the dev server and serves its
own preview/published build. That is independent of this static deployment:
production is whatever `dist/client` you last uploaded to the static host. Commits
pushed to the connected branch sync back into Lovable, so keep the branch
buildable.
