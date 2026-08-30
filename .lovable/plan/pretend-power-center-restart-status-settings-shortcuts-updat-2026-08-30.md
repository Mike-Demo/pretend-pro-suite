# Pretend power center: restart, status, settings, shortcuts, updates

Extend the existing fake power overlay into a small "power center" shared by all five shells (Fruit, Apperture, Bufferium, Android, fOS).

## What gets built

### Shared power state
A new hook/module `src/lib/pretendpro/power.ts` owns one typed pretend power state machine:
`idle | locking | saving | updating | rebooting | off`, plus the action that started it (`shutdown | restart | lock | update`).
- Sequence definitions per OS theme and per action live here (message list + phase), so overlays and indicators read the same source of truth.
- Speed setting and toggles persist in localStorage under `pretendpro:power-settings`.

### Restart action
- Menu entry "Restart PretendPro" in every shell (next to the existing shut down entry).
- Plays the OS-styled reboot sequence: shutdown messages → brief black beat → boot phase (OS logo/glyph + loader, e.g. "Starting PretendPro…") → returns to the desktop.
- On return, a sonner toast: "Rebooted. Still nothing done." (Fun Mode swaps in a joke variant.)

### Shutdown keeps the screen off
- `shutdown` ends in a persistent black screen with a small "Press any key to pretend to power on" hint; pressing a key / clicking wakes it with a short boot beat.
- `restart` never sticks — it always continues into boot and returns to the desktop.
- Escape still cancels mid-sequence.

### Power status indicator
- Small `PowerStatus` chip rendered in each shell's tray / status bar (Fruit menu bar right side, Apperture + Bufferium tray, Android/fOS status bar cluster).
- Shows a dot + short label for the current state (Idle, Locking, Saving, Updating, Off), colored per state, with `aria-live="polite"` so screen readers hear transitions. Compact (dot only) below `sm`.

### Software update action
- "Check for updates…" / "Update pretend software" entry per shell, opening the same overlay in `updating` phase:
  - Fruit: "Downloading PretendPro 3000.1…" → "Preparing…" → "Installing (this will take forever)…" → restart-style boot.
  - Apperture: "Working on updates 12%… 47%… 98%" → "Don't turn off your pretend PC".
  - Bufferium: "Your ChromeOS-ish is almost up to date" → "Restart to finish".
  - Android/fOS: Material/iOS-flavored progress copy.
- Ends with the reboot path + toast: "Updated to a version that changes nothing."

### Settings control
- New `PowerSettings` panel (shadcn `Dialog`) opened from each shell menu ("Power settings…"):
  - Animation speed: slider / segmented Slow · Normal · Fast · Instant (multiplier applied to every step duration).
  - Toggle: sparkles during power sequences.
  - Toggle: pretend sounds (chime on boot / shutdown, synthesized via WebAudio, off by default; no audio files added).
  - Reduced-motion note: when the OS prefers reduced motion, spinners stay static and the speed setting only affects text pacing — behavior is never overridden.

### Power shortcut palette
- New `PowerPalette` (shadcn `Command`) opened with `Ctrl/⌘ + Shift + P`, listing: Pretend shutdown, Restart, Lock, Check for updates, Power settings, Cancel.
- Direct shortcuts wired globally in `Desktop.tsx` and the mobile `Phone.tsx`: `Ctrl/⌘+Shift+Q` shutdown, `Ctrl/⌘+Shift+R` restart, `Ctrl/⌘+Shift+L` lock, `Esc` cancel.
- Shortcut hints appear inline in every power menu entry and are added to `ShortcutsOverlay.tsx`.

## Technical notes
- `PowerOverlay.tsx` is refactored to take `{ osTheme, action, funMode }` and drive itself from the shared sequence + speed multiplier; loaders stay as they are.
- Power state is provided once per page (Desktop / Phone) via a small context so shells and status chips share it instead of each holding local `powering` state; the current per-shell `powering` useState is removed.
- Sounds use a tiny WebAudio oscillator helper, gated by the setting and skipped when reduced motion or the toggle is off. No new dependencies.

## Verify
- `tsgo` typecheck + production build pass.
- Manual/Playwright: each OS shows the status chip; restart returns with a toast; shutdown stays black until a keypress; update sequence runs; shortcut palette opens and Cancel aborts; speed setting visibly changes pacing.
