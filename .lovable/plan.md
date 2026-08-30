# Fluent 2 for Apperture and the web pages

Bring Microsoft's Fluent 2 design language (from the open-source FluentUI project) to two places: the Apperture (Windows) OS theme, and the app's own web pages — onboarding and licenses. Fruit and BufferiumOS keep their current looks. No new component library is installed; Fluent 2 is recreated with Tailwind design tokens on top of the existing shadcn components.

## What Fluent 2 changes look like

Fluent 2 characteristics we adopt:
- Segoe UI Variable font stack (system fallbacks), with Fluent's type ramp: tighter, more neutral headings than the current playful ones.
- Fluent brand ramp accent (communication blue, `#0F6CBD` family) for primary actions, selection, and focus.
- Neutral gray surfaces layered by elevation instead of pastel cards.
- Fluent corner radii (4 / 6 / 8px) — noticeably crisper than today's 12–20px.
- Fluent shadow ramp (shadow2 / shadow8 / shadow16) for cards, flyouts, and windows.
- Fluent focus ring: 2px dark outline with light inner stroke, on every interactive element.

## Where it applies

Apperture theme (`/apperture`)
- Window frame: squared 8px corners, Mica-like layered title bar, and true Windows 11 caption buttons (46x32px hit targets, thin Segoe-style glyphs, red close hover).
- Taskbar: centered app buttons with the Fluent active-app underline indicator, acrylic background, Fluent tray typography.
- Start menu and quick-settings flyouts: Fluent flyout surface — rounded 8px, shadow16, subtle stroke, pinned-app grid with Fluent hover/pressed states.
- Wallpaper swapped to a Windows 11-style blue bloom gradient.
- Keyboard shortcuts stay the same; only visuals change.

Web pages (onboarding `/` and `/licenses`)
- Onboarding card, selectable option cards, radio indicators, and Continue button restyled to Fluent: neutral surface, blue accent selection, Fluent radius/shadow/focus. Layout, copy, illustrations, and the two-step flow stay as-is.
- Licenses page restyled to the same Fluent surface treatment, and a new entry added for FluentUI (MIT license, Microsoft Open Source Code of Conduct) with a link to the repo.

Unchanged
- Fruit and BufferiumOS shells and window frames.
- The four fake apps (DocuFaker, SheetShenanigans, BrowserBuddy, Inbox Mirage) keep their pastel, playful interiors so the humor survives.
- All existing behavior: app switching, animation mode, maximize, command palette, shortcut overlay.

## Technical notes

- Add a Fluent token block in `src/styles.css`: `--fluent-*` variables (brand ramp, neutral ramp, radii, shadow ramp, type ramp) plus light/dark values, and a `.fluent-surface` / `.fluent-focus` utility pair via `@utility`.
- Scope Fluent to the web pages with a `data-design="fluent"` wrapper on the onboarding and licenses route trees, and to Apperture by extending the existing `[data-os-theme="apperture"]` token block — so token overrides stay CSS-only and Fruit/Bufferium are untouched.
- Load Segoe UI Variable via a `<link>` in `src/routes/__root.tsx` head (Google Fonts fallback family), referenced through a `--font-fluent` theme token; never as a CSS `@import`.
- Edits: `src/styles.css`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/licenses.tsx`, `src/components/pretendpro/WindowFrame.tsx` (Apperture bar only), `src/components/pretendpro/desktop/AppertureShell.tsx`.
- Verification: typecheck, build log, and Playwright screenshots of `/`, `/licenses`, and `/apperture` (plus a Fruit page to confirm no regression).
