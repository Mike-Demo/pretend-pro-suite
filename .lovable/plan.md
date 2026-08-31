# Retune the onboarding transition: mono-brand palette, readable loader, 50% slower

Adjust the existing StepTransition overlay only — no flow, routing, or step logic changes.

## Palette: mono brand

Replace the four washed-out `panelTints` in `src/components/pretendpro/StepTransition.tsx` with a single-hue blue ramp:

```text
#0ea5e9  ->  #0284c7  ->  #0369a1  ->  #0c4a6e
```

Defined as CSS custom properties in `src/styles.css` (`--transition-panel-1..4`, light/dark aware if needed) and referenced by the panels, so the sweep reads as one cohesive brand wave instead of pastel blocks.

## Readable loader text

- Loader lockup, spinner, and status line sit on a small dark frosted chip: rounded-2xl, `bg-black/55`, `backdrop-blur-md`, subtle ring, padding around the whole loader group.
- Text/spinner use white (`text-white` via a scoped override class on the chip, since the chip guarantees a dark backdrop in both light and dark mode).
- Chip gets the existing `animate-loader-in` entrance.

## Timing: 50% slower

Scale all durations in `StepTransition.tsx` by 1.5x:

```text
cover   620ms  -> 930ms
reveal  520ms  -> 780ms
stagger  70ms  -> 105ms
default hold 420ms -> 630ms
```

Matching keyframe durations in `src/styles.css` (`pretend-panel-cover`, `pretend-panel-reveal`) are updated to 930ms/780ms so CSS and JS stay in sync. Reduced-motion branch stays a quick fade, unchanged.

## Technical notes

- Files touched: `src/components/pretendpro/StepTransition.tsx`, `src/styles.css` only.
- Panel animation-delay math and reveal order stay the same; only constants change.
- Verify with `bunx tsgo --noEmit` and a quick Playwright pass through onboarding step 1 -> 2 to screenshot the new palette and chip.
