# PretendPro Office Suite

**PretendPro 3000 — the world's most advanced productivity suite for getting absolutely nothing done.**

A playful parody office suite: pick a pretend operating system, boot into a full
fake desktop or phone, and open eleven equally fake apps that look busy and do
nothing useful. Everything is a static site — no accounts, no data, no server.

- **Live site:** https://pretend.pro
- **Lovable-hosted build:** https://pretend-pro-suite.lovable.app
- **Editor:** https://lovable.dev/projects/2062ba14-0b45-477d-8691-b3b7cc4732d8

## Key features

- **Five pretend editions** — three desktop shells (Fruit, Apperture, Bufferium)
  and two mobile shells (Android, FOS), each with its own window chrome, dock or
  home screen, and loading animation.
- **Eleven parody apps** — DocuFaker, SheetShenanigans, BrowserBuddy, Inbox
  Mirage, CodeFaker (web + game), DeckDreamer, ReaderRealm, PhotoPretender,
  ReelPretender and SoundStage.
- **Real windowing** — draggable/resizable windows, a dock, recents, a command
  palette, keyboard shortcuts and a pretend power center (restart, status,
  settings, fake updates).
- **Six locales** — `us-en`, `ca-en`, `uk-en`, `au-en`, `at-en` and `tlh`
  (Klingon), each as a URL prefix with its own `lang`/`hreflang`.
- **Fun extras** — fullscreen cinematic mode, bouncy animation mode, light/dark
  appearance, a progress bar stuck at 99% and other easter eggs.
- **Free media, gracefully** — photo and audio surfaces pull from the public
  Openverse API in the browser and fall back to built-in placeholder art.
- **Installable PWA** — full icon set, web app manifest and iOS splash screens.
- **Static and fast** — all 385 public pages are prerendered to HTML at build
  time, with critical inline CSS, font preloads and Brotli/gzip precompression.

## Attribution

- Web component/icon tooling from **Web Awesome 3** and **Font Awesome Free 7**
  (MIT / CC BY 4.0 for icons) — see `src/design-system/`.
- Illustrations from the **Transhumans** set — see `src/assets/transhumans/`.
- **Nebula Sans** webfonts — see `src/assets/fonts/`.
- Photos and audio from **Openverse** (openly licensed works; per-item credit is
  shown in the app and on the in-app licenses page).
- Full in-app credits live at `/licenses` (`src/components/pretendpro/LicensesView.tsx`).

This project is not a fork. It parodies real office software; no trademarks of
any real vendor are used.

## Tech stack

| Layer      | Choice                                                        |
| ---------- | ------------------------------------------------------------- |
| Framework  | React 19 + TanStack Start (SSR/prerender) with Vite 8         |
| Routing    | TanStack Router, file-based under `src/routes`                 |
| Styling    | Tailwind CSS v4 (`src/styles.css`), shadcn/ui, Radix, lucide   |
| Data       | TanStack Query (client-side only)                              |
| Validation | Zod                                                           |
| Tooling    | TypeScript (strict), ESLint, Prettier, Bun or npm              |

There is **no database, no auth and no request-time server code**. Generated
Lovable Cloud client files exist under `src/integrations/` but no page uses them.

## Local development

Prerequisites: **Node.js 20+** (Node 22 recommended). **Bun 1.1+** is optional
and used for the committed `bun.lock`.

```sh
git clone <this-repository-url>
cd <repository-name>

bun install      # or: npm install
bun run dev      # or: npm run dev   → http://localhost:8080
```

**`.env` is not required.** Nothing in the app reads an environment variable at
build or runtime; the Lovable-generated `.env` only holds unused backend keys.
See [docs/environment.md](docs/environment.md).

Other scripts: `bun run lint`, `bun run format`, `bun run preview`.

## Build & deployment

```sh
bun run build    # vite build && node scripts/copy-static-output.mjs
```

- Prerendering writes every page into `.output/public`.
- The post-build script copies that to **`dist/client`** — this is the folder to
  deploy.
- Serve `dist/client` from any static host. `public/_redirects`
  (`/*  /index.html  200`) makes deep links and refreshes work, and
  `public/_headers` sets the cache policy.

Details and host-specific notes: [docs/deployment.md](docs/deployment.md).

## Documentation index

- [docs/architecture.md](docs/architecture.md) — codebase layout, design
  decisions, gotchas and lessons learned.
- [docs/deployment.md](docs/deployment.md) — hosting, redirects, domain/DNS,
  sitemap and search-console notes.
- [docs/environment.md](docs/environment.md) — every environment variable name
  and what it controls (no values).
- [SPACEFAST.md](SPACEFAST.md) — short build spec for the static host.
- [roadmap.md](roadmap.md) — completed milestones and open ideas.
