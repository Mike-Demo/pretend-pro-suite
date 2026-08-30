# Multilingual mode with flag picker and locale sub-folder URLs

Add five locales, each with its own URL folder, a flag-based picker, and fully localized copy (onboarding, licenses, OS chrome, menus, toasts, and all 11 fake app contents).

## Locales

| Flag | Locale | URL prefix |
| --- | --- | --- |
| US | US English | `/us-en` |
| CA | Canadian English | `/ca-en` |
| GB | UK English | `/uk-en` |
| AU | Australian English | `/au-en` |
| AT | Austrian English | `/at-en` |
| Klingon trefoil | Klingon | `/tlh` |

Flavour per locale: US is the baseline; Canadian adds "eh", "toque", -our spellings; UK adds "whilst", "faff", "cheers"; Australian adds "arvo", "heaps", "no worries"; Austrian adds Alpine/German loan words ("Jause", "Kaffeepause"); Klingon uses Klingon-styled phrasing with an English gloss where needed so the UI stays usable.

## URL structure

Every route becomes locale-prefixed:

```text
/                     -> redirect to detected locale (Accept-Language, then saved choice, default /us-en)
/us-en                -> onboarding
/us-en/fruit          -> Fruit edition   (same for ca-en, uk-en, au-en, at-en, tlh)
/us-en/apperture
/us-en/bufferium
/us-en/android
/us-en/fos
/us-en/licenses
/verify               -> stays unprefixed (captcha gate), returns user to their locale URL
```

Old unprefixed paths (`/fruit`, `/licenses`, ...) keep working via permanent redirects into the saved or detected locale so existing links and search results are not broken.

## What gets built

**Locale picker (flags)**
- A compact flag button row/dropdown in the onboarding header and in each OS shell's system menu, showing the current flag plus locale name.
- Switching locale navigates to the same page under the new prefix, preserving the app query param, and persists the choice.

**Translation layer**
- One typed dictionary per locale covering: onboarding copy and task options, licenses page, desktop/mobile shells, dock and launcher labels, command palette, power menu/overlay/settings, shortcuts overlay, toasts, and all 11 fake app screens' nonsense text (documents, formulas, tabs, emails, code, slides, reader, photos, reels, sound).
- A small provider + hook (`useI18n`) supplies strings; missing keys fall back to US English so nothing ever renders blank.
- App names stay recognizable but get localized joke subtitles/taglines.

**SEO**
- Per-locale `title`, `description`, OG/Twitter tags, self-referencing canonical, and `hreflang` alternates linking all six locales plus `x-default`.
- `html lang` set per locale (`en-US`, `en-CA`, `en-GB`, `en-AU`, `en-AT`, `tlh`).
- Sitemap regenerated to list all locale × route combinations with alternate links.

## Technical notes

- New route folder `src/routes/$locale/` (`index.tsx`, `fruit.tsx`, `apperture.tsx`, `bufferium.tsx`, `android.tsx`, `fos.tsx`, `licenses.tsx`) with a `$locale/route.tsx` layout that validates the locale segment and throws `notFound()` for unknown values; existing top-level route files become thin redirects.
- `src/lib/i18n/` holds the locale registry (id, prefix, flag, label, html lang), typed `Strings` interface, six dictionaries, detection/persistence helpers (`pretendpro:locale`), and path helpers for locale-aware links.
- All existing hardcoded strings in components move into dictionary keys; components read them via the hook, so `Suite.tsx`, shells, power components, and app screens change to consume strings instead of literals.
- Locale route params feed the layout context, so dictionaries load per route without a client round-trip; dictionaries are code-split per locale to keep bundle size flat.
- Existing features are untouched in behaviour: fullscreen, power center, window snapping/persistence, Fun Mode, appearance, captcha gate.
- Verification: production build, a rendered check that each locale route returns 200 with correct `lang`, canonical, and hreflang set, plus a Playwright pass switching locale on desktop and phone shells.
