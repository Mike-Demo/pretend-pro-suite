# Full Icon Set + Web App Manifest

Right now the site ships one 64x64 PNG icon and no manifest, so installs, Android home screens, and pinned tabs fall back to a blurry or generic icon.

## What gets added

Regenerate every icon from the original 512x512 procrastinate artwork you uploaded (the current favicon is a downscaled 64px copy, too small to upscale):

- `public/favicon.ico` — multi-size 16/32/48 for legacy browsers and pinned tabs
- `public/favicon-16.png`, `public/favicon-32.png` — crisp small tab icons
- `public/apple-touch-icon.png` — 180x180, padded on the site background color (iOS does not honor transparency)
- `public/icon-192.png`, `public/icon-512.png` — standard Android/Chrome install icons
- `public/icon-maskable-512.png` — safe-zone padded version so Android doesn't crop the art

## Manifest

New `public/manifest.webmanifest` with:
- `name`: PretendPro 3000, `short_name`: PretendPro
- `description` matching the site meta
- `start_url`: `/`, `scope`: `/`, `display`: `standalone`
- `theme_color` and `background_color` pulled from the site's existing tokens
- all icon entries above, with `purpose: "maskable"` on the maskable one

Manifest-only, home-screen support. No service worker and no offline caching are added.

## Head tags

Update `head().links` and `head().meta` in `src/routes/__root.tsx`:
- `icon` entries for the .ico plus 16/32 PNGs
- `apple-touch-icon`
- `manifest` link
- `theme-color` meta, plus `apple-mobile-web-app-title` and `apple-mobile-web-app-capable`

## Technical notes

- Icons generated with ImageMagick from `IMG_0032.png`, using `-background` + `-gravity center -extent` so nothing stretches.
- No new dependencies, no `vite-plugin-pwa`.
- Verification: each new asset returns HTTP 200 with the right content type, the manifest parses as JSON, and the build log is clean.
