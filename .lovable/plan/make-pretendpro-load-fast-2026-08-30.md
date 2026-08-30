# Make PretendPro load fast

Goal: cut the bytes the browser downloads on first paint, split the heavy fake-app code out of the initial bundle, and add smart prefetching so switching between OS editions feels instant.

## What's slow today (verified in the project)

- The onboarding page (`/`, the landing page everyone hits first) imports eight Transhumans illustrations as raw SVGs — 759 KB total, some single files over 150 KB. They are unoptimized export SVGs.
- Every OS page pulls in all eleven fake app screens eagerly through one shared registry, so visiting `/fruit` downloads DocuFaker, SheetShenanigans, code editor, photo editor, video editor, sound studio, etc. even though only one window opens.
- All five OS shells (Fruit, Apperture, Bufferium, Android, fOS) are imported together by the desktop/phone container, so each edition ships the chrome for editions you are not using.
- No image is preloaded or prioritized, so the largest onboarding illustration competes with JS for bandwidth.
- No route prefetching, so clicking an edition from onboarding does a cold fetch of that route's chunk.

## What gets done

### 1. Shrink the illustrations (biggest win)

- Run an SVG optimization pass (svgo-style: drop editor metadata, collapse groups, trim path precision) over the eight Transhumans files. Expect roughly 50-70% smaller with no visible change.
- Build responsive raster variants (WebP/AVIF) at the sizes actually rendered, and serve them via `<picture>` with the optimized SVG as fallback where crispness matters.
- Preload only the single illustration visible above the fold on `/`, with `fetchpriority="high"`; keep `loading="lazy"` + `decoding="async"` on everything else, and add explicit width/height to remove layout shift.

### 2. Split the fake apps into lazy chunks

- Convert the app registry to lazy component loaders so each fake app (`DocuFaker`, `SheetShenanigans`, `CodeFaker`, `PhotoPretender`, `ReelPretender`, `SoundStage`, …) becomes its own chunk loaded when its window opens, with a lightweight themed placeholder while it loads.
- Warm the chunk on hover/focus of a dock, launcher, or command-palette entry so the window still feels instant.

### 3. Split the OS shells per edition

- Load only the shell for the current theme; the other four shells move to separate chunks that are never fetched.
- Same treatment for the overlay-only UI (command palette, shortcuts sheet, power palette, power settings) which is not needed for first paint.

### 4. Prefetch and cache

- Enable router intent-based prefetching so hovering an edition card on onboarding preloads that route's code.
- Add long-lived immutable caching headers for hashed build assets and a short revalidating policy for HTML, plus explicit `preconnect`/`dns-prefetch` for the Openverse API used by the media-driven apps.
- Confirm compression: the platform edge already serves gzip/brotli for text assets — the plan verifies it with response headers rather than adding a redundant build-time compressor.

### 5. Trim what ships

- Audit unused heavy UI dependencies (charting, carousel, date picker, OTP, resizable panels) that are pulled in by the shadcn component library but not used by the app, and make sure nothing on the critical path imports them.
- Verify icon imports stay tree-shaken (named `lucide-react` imports only).

### 6. Measure

- Record before/after numbers: total transferred bytes for `/` and `/fruit`, largest chunk size, and the count of requests on first load. Report the deltas so the win is evidence-based, and note anything that regressed.

## Technical notes

- Image work: add an SVG optimizer to the build/asset pipeline (or commit optimized files) and generate WebP/AVIF variants; wire `<picture>` in `src/routes/index.tsx` and reuse a small shared `Illustration` component.
- Code splitting: `React.lazy` + `Suspense` inside `src/components/pretendpro/app-screens.tsx`, `src/components/pretendpro/desktop/Desktop.tsx` and `src/components/pretendpro/mobile/Phone.tsx`; keep the exported registry types unchanged so shells and the command palette need no signature changes.
- Prefetching: `defaultPreload: "intent"` in `src/router.tsx` plus manual chunk warm-up handlers on launcher items.
- Headers: static asset cache-control via the Nitro/Cloudflare output config; no change to `vite.config.ts` plugin list (the shared Lovable config owns plugins).
- Reduced-motion and the existing captcha gate, power center, and layout persistence behavior stay untouched.

## Risks

- Lazy-loading windows introduces a brief placeholder; mitigated with hover prefetch and a themed skeleton.
- Aggressive SVG optimization can alter gradients; each file gets a visual diff check before it is kept.
