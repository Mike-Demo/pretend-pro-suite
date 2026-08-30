# Make the OS pages feel like real desktops

Turn `/fruit`, `/apperture`, and `/bufferium` into full desktop environments instead of a marketing page with a window in the middle, and remove the system-alert popup.

## Desktop shell per OS

Each theme page becomes a full-viewport desktop: wallpaper background, the app window floating on it, and OS-appropriate chrome.

- **Fruit (Mac OS X)** — top menu bar (PretendPro logo, app name, faux menus: File / Edit / Pretend / Help, right side clock + battery + wifi glyphs) and a bottom center-floating magnifying dock with the four app icons, running-app dots, and a Licenses icon.
- **Apperture (Windows)** — bottom taskbar: Start button opening a Start menu panel with the app list and a "Change style" entry, pinned/running app buttons with active underline, and a right-side system tray with clock and tray glyphs.
- **BufferiumOS (ChromeOS)** — bottom shelf: launcher circle at left opening an app grid overlay, pinned app icons with active indicators, and a right status tray (clock, battery, wifi) that opens a small quick-settings bubble.

Shared behavior:
- Clicking an app icon switches the active app; the window title bar and window title update.
- Clock shows live local time, updating each minute.
- Window can be maximized (fills the desktop area) or restored; the existing playful traffic-light/glyph toasts stay.
- Easter eggs stay: sticky note on the window, 99% progress bar (moved into the window footer area), and animation mode toggle now lives in the OS chrome (menu bar / start menu / quick settings) rather than as a pink pill row.
- The old centered hero header (big "PretendPro 3000" title, pill toggles, Window Style row) is removed from the theme pages; style switching moves into the OS chrome (Fruit menu bar menu, Windows Start menu, Bufferium quick settings) and still links to the other two routes with the current app preserved in `?app=`.
- Licenses link stays reachable from the OS chrome.
- Mobile: chrome collapses to a compact bottom bar with icon-only app switching; window fills the screen.

## Keyboard shortcuts

Global on the theme pages, with a help overlay listing them:

- `1`–`4` — jump to DocuFaker / SheetShenanigans / BrowserBuddy / Inbox Mirage
- `Ctrl/Cmd + Tab` and `Ctrl/Cmd + Shift + Tab` — cycle apps forward/back
- `F` — toggle maximize; `Esc` — restore / close overlays
- `Ctrl/Cmd + K` — command-palette-style app switcher (type to filter apps, Enter to open)
- `?` — toggle the shortcuts cheat-sheet overlay
- `A` — toggle animation mode

Shortcuts are ignored while typing in an input/textarea/contenteditable.

## Remove the system alert

Delete the `LicenseAlert` popup component and its usage. The "license expired due to excessive pretending" joke is preserved as passive text in the OS chrome (menu bar / tray tooltip line: "License expired due to excessive pretending"), so nothing interrupts the user.

## Technical notes

- New `src/components/pretendpro/desktop/` components: `Desktop.tsx` (shell + state + shortcuts), `FruitShell.tsx`, `AppertureShell.tsx`, `BufferiumShell.tsx`, `ShortcutsOverlay.tsx`, `CommandPalette.tsx` (client-side filter only, no backend).
- `Suite.tsx` is rewritten to render `Desktop` with a fixed `osTheme`; app state (`active`, `maximized`, `animated`, overlays) lives there. Existing four app screens and `WindowFrame` are reused unchanged.
- Keyboard handling in one `useEffect` keydown listener in `Desktop.tsx`.
- Wallpaper gradients and shelf/taskbar/menubar surfaces added as `[data-os-theme=...]` scoped tokens in `src/styles.css` (no hardcoded color utilities).
- `LicenseAlert` removed from `chrome.tsx`; `Dock`/page-tabs helpers there are superseded by the per-OS shells and removed if unused.
- Theme routes (`fruit.tsx`, `apperture.tsx`, `bufferium.tsx`) keep their metadata and `?app=` search validation; only the rendered shell changes.
