# New Logo, Favicon, App Icons, and Nebula Sans

Three changes: the uploaded gradient "P" mark becomes the logo and favicon, the 11 fake-app icons get restyled to match it, and Nebula Sans becomes the site's default typeface.

## Logo

- Host `Pretend_Pro_logo.svg` as a CDN asset and render it next to the "PretendPro 3000" wordmark in the onboarding header and on the licenses/privacy/terms headers.
- Keep the wordmark text (now set in Nebula Sans) instead of the current solid pink pill, so the blue mark and the name read as one lockup.

## Favicon and install icons

Regenerate the whole icon set from the new logo, replacing the procrastinate artwork:

- `public/favicon.ico` (16/32/48), `public/favicon-16.png`, `public/favicon-32.png`
- `public/apple-touch-icon.png` (180, padded on white since iOS ignores transparency)
- `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png`
- `theme_color` in `manifest.webmanifest` and the `theme-color` meta change from pink `#e9639c` to the logo blue

The Flaticon procrastinate attribution is removed from the licenses page since that icon is no longer used.

## App icons in the new style

Today each app is a Lucide glyph on a flat pastel chip. To match the logo, each of the 11 apps gets a rounded-square gradient tile with a white glyph and a soft drop shadow — the same visual language as the mark, with a per-app hue instead of pastel fills:

- DocuFaker / ReaderRealm — blue
- SheetShenanigans / PhotoPretender — green
- DeckDreamer / SoundStage — orange
- BrowserBuddy / CodeFaker / ReelPretender — indigo-violet
- Inbox Mirage / CodeFaker: Game — teal-cyan

Glyphs stay Lucide (already licensed and credited). Tiles apply everywhere icons appear: desktop launchers and docks, command palette, mobile home grid and dock, and recents. Existing hover/selection pop animations and reduced-motion handling are preserved, as is the bordered-tile geometry so nothing reflows.

## Nebula Sans as the default font

- Convert the uploaded TTFs to WOFF2 (Light, Book, Medium, Semibold, Bold plus Book/Semibold italics) and host them as CDN assets.
- Declare `@font-face` rules and set Nebula Sans as the default UI font for onboarding, licenses, privacy, terms, and the general web chrome, with a system-font fallback stack.
- The three desktop editions keep their OS-authentic font stacks (Fruit, Apperture/Fluent, Bufferium) so they still look like the OS they parody — Nebula Sans is the site font, not an override on the fake operating systems.
- Preload the two weights used above the fold so first paint doesn't swap; `font-display: swap` on the rest.
- Update the inline critical CSS font stack to start with Nebula Sans.
- Add a licenses entry: Nebula Sans, Nebula Entertainment & Broadcasting LLC, SIL Open Font License 1.1, linking https://www.nebulasans.com/license/.

## Technical notes

- Fonts converted with `fonttools ttLib.woff2`; icons generated with ImageMagick using `-background`/`-extent` so nothing stretches.
- Logo and font files ship as `.asset.json` CDN pointers; only the favicon set lives as real files in `public/`.
- `public/_headers` gains long-lived cache rules for the font assets.
- Verification: build clean, every new icon and manifest URL returns 200, Nebula Sans renders on onboarding, and desktop LCP/Lighthouse stays in the current range.
