# OS Window Theme Selector for PretendPro 3000

Add an OS-style picker so the PretendPro app window can be dressed in three parody desktop themes, inspired by the linked design references:

- **Fruit (Mac OS X)** — macOS-style chrome: traffic-light buttons (red/yellow/green) top-left, centered title, soft translucent title bar, extra-rounded corners, aqua-tinted accents.
- **Apperture (Windows)** — Fluent-style chrome: minimize/maximize/close glyphs top-right, left-aligned title, sharper corners, acrylic-ish title bar, blue accent.
- **ChromiumOS** — ChromeOS-style chrome: simple gray title bar, tab-like strip feel, minimal controls, material-ish shapes.

## What gets built

**Theme picker**
- New segmented control in the header next to the existing mode toggles: "Window Style: Fruit / Apperture / ChromiumOS" (icons + labels, wraps on mobile).
- Stored in React state (default: Fruit); applies to both the normal app screen frame and the Full-Screen Window overlay.

**Themed window frame**
- Wrap the active app screen in a `WindowFrame` component that renders a fake OS title bar whose layout/controls switch per theme:
  - Fruit: three pastel traffic lights (close is decorative, shows a toast "Nice try."), centered app name.
  - Apperture: left-aligned app name, three square glyph buttons (minimize shows "There is no escape from productivity" toast).
  - ChromiumOS: simple bar with a tab-shaped active tab and a single close dot.
- Per-theme design tokens (accent color, title-bar background, corner radius) added as CSS classes/variables in `src/styles.css`, applied via a `data-os-theme` attribute on the frame — no hardcoded color utilities.
- Fake controls are playful but harmless: they show a humorous sonner toast instead of doing anything destructive.

**Keep everything else**
- Dock, Page View tabs, Animation Mode, sparkles, easter eggs, and all four app screens stay unchanged; only the window dressing and header control are new.

## Technical notes

- `src/components/pretendpro/WindowFrame.tsx`: new presentational component; props: `osTheme`, `appName`, `children`. Pure UI, typed union `OsTheme = "fruit" | "apperture" | "chromiumos"`.
- `src/routes/index.tsx`: add `osTheme` state + picker UI; wrap `<ActiveScreen />` (both normal and full-screen paths) in `WindowFrame`.
- `src/styles.css`: add `[data-os-theme="fruit"|"apperture"|"chromiumos"]` scoped custom properties (titlebar bg, accent, radius) referencing the existing token approach; keep reduced-motion rules intact.
- Mount `Toaster` from `@/components/ui/sonner` in `__root.tsx` if not already mounted, for the fake-control toasts.
- No backend; all client-side state.
