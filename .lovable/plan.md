# Onboarding page transitions with loader

Add a full-screen animated transition + loader between onboarding steps and into the OS, styled with existing brand tokens. Inspired by a CodePen by John Heiner, credited on the licenses page.

## Where it plays

1. **Step 1 (OS choice) -> Step 2 (work choice)** — transition covers, step swaps behind it, transition reveals.
2. **Step 2 -> the chosen OS edition** — transition covers, loader holds while the edition route chunk loads, then navigation happens behind the cover and it reveals into the desktop/phone shell.

## The effect

- Four vertical panels sweep up from the bottom in a staggered cascade to cover the screen, using brand accent tokens (primary, primary-glow, accent, and a muted brand tint) so it reads as the PretendPro palette rather than raw colors.
- Once covered, a centered brand loader appears: the PretendPro lockup with a ring/arc spinner and a short rotating status line ("Warming up the pretending...").
- Reveal is the reverse cascade, panels sliding off the top in the opposite stagger order.
- Total duration around 900ms cover + short loader hold + 700ms reveal; the step-to-step one is snappier than the step-to-OS one.
- Reduced motion: no panel sweep, a simple fade with the loader still shown briefly, so the flow stays understandable.
- Overlay is `aria-hidden` decorative with an `aria-live` polite status for the loader text; focus returns to the newly rendered step heading after reveal.

## Credit

Add an entry to the licenses page crediting the transition concept: "Page transition concept by John Heiner — https://codepen.io/johnheiner", alongside the existing attributions.

## Technical notes

- New `src/components/pretendpro/StepTransition.tsx`: a client component driven by a small state machine (`idle | covering | holding | revealing`) exposing an imperative `run(action)` helper that awaits the cover phase, runs the caller's callback (setStep or navigate), then reveals.
- New keyframes/utilities in `src/styles.css` (`pretend-panel-cover`, `pretend-panel-reveal`, staggered `--panel-delay` custom property, loader arc reuse of the existing `pretend-arc-rotate`/`pretend-arc-dash` keyframes) plus a `prefers-reduced-motion` branch.
- `Onboarding.tsx`: `onContinue` routes through the transition instead of calling `setStep`/`navigate` directly. Fullscreen request stays inside the click handler (user-gesture requirement) and fires before the transition starts. Existing route preloading keeps warming the edition chunk so the loader hold is usually short.
- Loader status strings added to `src/lib/i18n/strings.ts` under `onboarding` for all six locales (Klingon included).
- No routing, backend, or data changes.
