# Power button with OS-styled fake loading screen

Add a power icon to every PretendPro edition that plays a slow, OS-flavored shutdown/loading animation, then returns to the desktop.

## What gets built

### Shared power overlay (new file: `src/components/pretendpro/PowerOverlay.tsx`)
- Full-screen fixed overlay (z-[100]) with a fade-in, styled per OS theme:
  - **Fruit:** frosted dark backdrop, macOS-style 12-spoke spinning spinner, text: "Shutting down PretendPro…" then "Restarting for no reason…"
  - **Apperture:** Fluent dark backdrop, Windows-style chasing-dots ring, centered caption font, steps: "Locking…" → "Saving pretend work…" → "Turning off…"
  - **Bufferium:** ChromeOS-style solid surface, bouncing-dot loader, "Putting ChromeOS-ish to sleep…"
  - **Android:** Material You backdrop, indeterminate circular arc spinner, "Optimizing pretend apps (1 of 3)…" counting up slowly
  - **fOS:** iOS-style black backdrop, gray spinner, plain "…" status
- Slow progression: cycles through 2–3 status messages (~1.4s each), then a brief black "off" beat, then fades back to the desktop — nothing actually closes.
- **Escape key or clicking the overlay cancels** at any time; keyboard focus moves into the overlay on open and returns to the power button on close; screen-reader announces status changes via `aria-live`.
- Respects `prefers-reduced-motion` (spinner becomes static, fades only).
- Fun Mode ON swaps in joke messages (e.g. "Deleting all real work… just kidding").

### Power buttons in each shell
- **Fruit** (`FruitShell.tsx`): `Power` icon added to the Apple logo menu popover ("Pretend to Shut Down…").
- **Apperture** (`AppertureShell.tsx`): `Power` icon button in the right tray, next to the clock.
- **Bufferium** (`BufferiumShell.tsx`): `Power` icon button in the right tray cluster.
- **Android & fOS** (`mobile/shell-shared.tsx` SystemMenu + status bar): power entry at the top of the system menu.
- Each shell manages a local `powering` state and renders `PowerOverlay` with its `osTheme`.

### Implementation notes
- New keyframes in `src/styles.css`: `spinner-spokes` (12 spoke fade), `windows-ring` (dot orbit), `bounce-dots`, `material-arc` (dash rotation) — pure CSS, no new dependencies.
- `PowerOverlay` is self-contained; no changes to window state, routing, or persistence.

## Verify
- `tsgo` typecheck + production build pass.
- Playwright or manual check: each OS page shows the power control, animation plays and returns, Escape cancels.
