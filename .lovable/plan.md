# Replace social preview images with the new PretendPro banner

Every page will share one new branded social image, taken from the uploads at the size each platform expects.

## Which upload goes where

| Purpose | Size | Source upload |
| --- | --- | --- |
| Main social preview (Open Graph / Twitter large card) | 1200x630 | IMG_0048.png (already exactly 1200x630) |
| Square preview (messaging apps, some feeds) | 1080x1080 | IMG_0052.png |
| Wide/hero banner variant | 1920x1080 | Header.png |

The near-miss crops (1200x627, 1200x600, 1200x644, 400x400, 1080x1080 duplicate) are redundant and will not be added.

## What changes

- Add `public/og/social.png` (1200x630, from IMG_0048), `public/og/social-square.png` (1080x1080), and `public/og/social-wide.png` (1920x1080), all optimized for size.
- Point the shared image constant at `/og/social.png` and make every route use it: home, the five OS editions (`/fruit`, `/apperture`, `/bufferium`, `/android`, `/fos`), licenses, privacy, and terms — for both `og:image` and `twitter:image`, in all locales.
- Add `og:image:width`, `og:image:height`, and `og:image:alt` so crawlers render the card without guessing.
- Delete the six old per-edition files (`home/fruit/apperture/bufferium/android/fos.png`) now that nothing references them.

## Technical notes

- `src/lib/seo.ts` currently exports `homeOgImage`; it becomes a single `socialOgImage` (with `homeOgImage` kept as an alias if anything else imports it).
- `src/lib/i18n/head.ts` builds per-slug image URLs at line 106 (`/og/${slug}.png`); this switches to the one shared URL.
- Images stay real files in `public/` (not CDN pointers) so absolute `https://pretend.pro/og/...` URLs stay stable for crawlers.
- Cache headers in `public/_headers` already cover `/og/*`; no change needed there.

## After the change

Verification: build, then confirm the new files return 200 and each route's rendered head contains the new absolute image URL. Note that platforms cache previews, so shared links may show the old image until their crawler re-fetches or you force a refresh in a link preview debugger.
