# Simple Splash Screen for the PWA

The app is a manifest-only PWA (no service worker), so the splash screen is declarative:

- **Android/Chrome** generates the splash screen automatically from `manifest.webmanifest` — the centered icon on `background_color` (`#faf4e6`). That already works once the app is installed; a `display: standalone` + icon + background color manifest is all it needs.
- **iOS Safari** ignores the manifest for splash screens and only shows one when `apple-touch-startup-image` links with device-specific media queries are present. Without them, launching from the home screen shows a white flash.

## What gets added

1. **iOS startup images** in `public/` — a small set of `splash-<w>x<h>.png` files generated with ImageMagick from the existing 512x512 icon, centered and padded on the site background color `#faf4e6`, covering the common device sizes (iPhone SE/8, iPhone 12/13/14, iPhone Pro Max, iPad portrait/landscape).
2. **`apple-touch-startup-image` link tags** in `head().links` in `src/routes/__root.tsx`, one per image with the matching `media="(device-width: …) and (device-height: …) and (-webkit-device-pixel-ratio: …)"` query.
3. **Cache headers** — add the new `splash-*.png` paths to `public/_headers` alongside the other icons (weekly revalidation).

No service worker, no new dependencies, no runtime code — Android keeps using the manifest, iOS gets real splash images.

## Verification

- Each new asset returns HTTP 200 with the right content type.
- The link tags render in the SSR head.
- Build log is clean.
