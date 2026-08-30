# Mobile Editions: "Android" and "fOS"

Add two phone-style editions alongside the three desktop styles, each on its own page, and
surface them first in onboarding when the visitor is on a small screen.

## Routes

```text
/android    Material-style phone edition
/fos        Cupertino-style phone edition
```

Both accept the existing `?app=` param so onboarding can preselect the chosen fake work.

## The phone model

Phones do not have windows, so these editions use a true phone shell instead of the desktop
window manager:

- Status bar: clock, signal/wifi/battery glyphs. Android uses a left-aligned clock; fOS uses a
  centered notch-style layout with the clock left of a pill cutout.
- Home screen: grid of all eleven fake apps with labels. fOS adds a bottom dock row; Android adds
  a search pill and an "all apps" sheet feel.
- One app at a time, full screen, with an entry/exit scale-and-fade transition.
- Navigation: Android shows a back / home / recents bar; fOS shows a home indicator you swipe or
  click, plus a back chevron inside app headers.
- Recents / app switcher: horizontally scrolling cards of open apps; tap to resume, dismiss to
  close. Open apps and the last-used order persist per edition, like the desktop layouts do.
- Keyboard equivalents kept for accessibility: `1`-`9` launch apps, `Escape` returns home,
  `Ctrl/Cmd+Tab` cycles recents, `Ctrl/Cmd+K` opens the launcher search, `?` shows shortcuts.
- Everything is keyboard-reachable with visible focus rings and live-region announcements when
  the foreground app changes, matching the desktop pages.

On a desktop browser these pages fill the whole viewport (no simulator bezel); the home grid and
app content simply widen with comfortable max-widths.

## Onboarding

Step 2 keeps the same card layout but becomes device-aware:

- Small screens: a "Recommended for your device" group with Android and fOS first, then a
  "Desktop styles" group with Fruit, Apperture, and BufferiumOS below.
- Large screens: desktop styles first, then a "Mobile styles" group with Android and fOS.
- Both groups are always selectable; ordering and the group heading are the only difference.
- Grouping is decided from the existing `useIsMobile` hook after hydration, so server HTML stays
  stable.

Selecting a mobile style and continuing navigates to `/android` or `/fos` with `?app=`.

## Style switching in-app

The existing "Switch to …" menu grows to all five editions, so a visitor can jump from a phone
edition to a desktop one and back while keeping the current app.

## Licenses page

New entries with links and Apache License 2.0 noted:

- Material Components for Android — Google / Material Components authors, Apache 2.0
- Material Components for iOS — Google / Material Components authors, Apache 2.0

Noted as design references; no Material packages are installed.

## Technical notes

- `OsTheme` in `WindowFrame.tsx` extends to `"android" | "fos"`, and `osThemes` gains both names.
  `themeRoutes` in `desktop/shell-shared.tsx` gains `/android` and `/fos`.
- New `src/components/pretendpro/mobile/` folder: `Phone.tsx` (shared state: home vs app vs
  recents, launch/close/cycle, persistence), `AndroidShell.tsx`, `FosShell.tsx`, `HomeScreen.tsx`,
  `StatusBar.tsx`, `Recents.tsx`. App screens are reused unchanged from
  `src/components/pretendpro/*`.
- `src/lib/pretendpro/phone.ts`: typed reducer/hook for the phone task stack, persisted under
  `pretendpro:phone:${osTheme}` with validation, mirroring `lib/pretendpro/windows.ts`.
- `Suite.tsx` routes to `Desktop` for the three desktop themes and `Phone` for the two mobile
  themes, so route files stay thin; `src/routes/android.tsx` and `src/routes/fos.tsx` mirror
  `fruit.tsx` with their own `head()` metadata.
- New scoped tokens in `src/styles.css` under `[data-os-theme="android"]` and
  `[data-os-theme="fos"]` (radius, status bar, surface, elevation), with `.dark` variants. Material
  3 shape/elevation and Cupertino translucency are expressed as tokens — no hardcoded colors.
- Both new paths are added to the captcha gate the same way the other OS pages are handled, and
  to the sitemap.
