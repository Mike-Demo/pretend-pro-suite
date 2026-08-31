# Make onboarding always land in a real, working suite

Three parts: fix the empty-desktop bug you hit, give every OS + work type its own real page, then re-measure and optimize.

## 1. Fix "No windows open" (confirmed root cause)

Two separate defects in `Desktop.tsx` / `windows.ts`:

- **The auto-open never retries.** The desktop only launches your chosen app inside an effect that requires the desktop area to already have a measured width. When the first commit measures 0 (which happens coming out of the onboarding transition, out of fullscreen, or on a slow route chunk), the effect bails and its dependencies never change again, so nothing ever opens and you see the empty-desktop message.
- **A saved layout silently overrides your choice.** If a previous visit left any window state in storage, the boot step skips launching entirely — so picking "Editing photos" can drop you into whatever was open last time, or into a desktop where every restored window is minimized (focused = none, empty message again).

Fix:
- Drive the boot step off a measured-size state value plus the window manager's `restored` flag so it runs as soon as the desktop has real dimensions, retrying instead of giving up. Use a `ResizeObserver` on the desktop area rather than a one-shot read.
- Always honour the requested app: after restore, if the chosen app has no window, launch it; if it exists but is minimized, un-minimize and focus it. Never leave a restored session with zero visible windows — if all restored windows are minimized, focus the chosen one.
- Apply the same guarantee to the phone shells (`Phone.tsx`) so Android/fOS always boot into the chosen app in the foreground.

## 2. A real page per OS edition and work type

Today the work type is a `?app=` query on five edition routes. Give each combination its own URL:

```text
/us-en/fruit              -> edition landing (default app)
/us-en/fruit/photos       -> Fruit + Editing photos
/us-en/android/sound      -> Android + Editing sound
```

- Each of the 5 editions becomes a layout route with an `index` leaf (default app) and an `$app` leaf (11 work types), for all 6 locales.
- `$app` is validated against the app registry; an unknown app renders the not-found path rather than silently falling back.
- Onboarding navigates to the new path form instead of a search param. Legacy `?app=` URLs and the unprefixed `/fruit` style routes permanently redirect to the new canonical path, so nothing already shared breaks.
- Per-combination SEO: title/description/canonical/OG/Twitter naming both the edition and the work type, hreflang across the 6 locales, and BreadcrumbList JSON-LD gaining the app crumb. Sitemap expands to the edition + app URLs with locale alternates.
- Captcha open-path handling updated so the new path shapes are treated exactly like today's edition routes (real metadata for crawlers, no `/verify` redirect).

## 3. Performance

Measured, not guessed:
- Baseline Lighthouse (desktop + mobile, median of 3) against a production build for one desktop edition and one phone edition, before any change.
- Keep the existing wins intact (lazy app screens, lazy shells, lazy toaster, Brotli/gzip, immutable caching) and verify no new route file pulls an app screen or shell into the entry chunk — the new `$app` leaves are the main regression risk.
- Preload only the one app screen the URL asks for, and prefetch the edition chunk on onboarding hover/focus as today.
- Re-measure after and report the delta. Target: no regression versus baseline on desktop, and equal or better mobile LCP.

## Technical notes

- Files: `src/components/pretendpro/desktop/Desktop.tsx`, `mobile/Phone.tsx`, `src/lib/pretendpro/windows.ts`, `src/lib/pretendpro/search.ts`, `src/components/pretendpro/Onboarding.tsx`, new `src/routes/$locale/{fruit,apperture,bufferium,android,fos}.{index,$app}.tsx` plus the existing edition files becoming `<Outlet />` layouts, legacy `src/routes/*.tsx` redirects, `src/lib/i18n/head.ts`, `src/lib/seo.ts`, `src/routes/sitemap[.]xml.ts`, `src/lib/captcha/session.ts`.
- Edition layout components render only `<Outlet />` (no page body, no pathname gating).
- Verification: `bunx tsgo --noEmit`, production build, then a Playwright pass through onboarding for a desktop and a phone edition confirming the chosen app opens focused with no empty-desktop message, plus HTTP checks on new paths, redirects, and the sitemap.
