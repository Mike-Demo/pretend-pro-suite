# Move animation from page to card images

## Problem
- The locale-switch tumble animation (`animate-locale-swap`) is applied to the whole page wrapper in `src/routes/$locale/route.tsx`, so the entire page animates when changing languages — remove it.
- The fun animation should instead play on the onboarding card images when they get selected (the mono → color swap currently snaps instantly).

## Changes

### 1. Remove page-level locale animation
- `src/routes/$locale/route.tsx`: drop the `animate-locale-swap` class (and the unnecessary `key={locale}` re-mount) from the wrapper div.
- `src/styles.css`: remove the `pretend-locale-swap` keyframes, the `animate-locale-swap` utility, and its reduced-motion entry.

### 2. Add selection animation to card images
- `src/styles.css`: add a new playful keyframe + utility, e.g. `pretend-art-pop` (quick scale/rotate bounce with a slight brightness lift as the color version lands), plus `prefers-reduced-motion` handling.
- `src/components/pretendpro/Onboarding.tsx` (`SelectionCard`): apply the animation class to the `<Illustration>` when `selected` is true, keyed by the selected state (e.g. `key={String(selected)}` or `key={selected ? "color" : "mono"}` on the wrapper) so it replays each time a card becomes selected. Animation only on the image inside the card, not the card itself.

## Scope notes
- No behavior change for other routes; no prefetch changes (already in place).
- Reduced motion users see an instant mono → color swap.

## Verification
- `bunx tsgo --noEmit`
- Manual: switch languages → no page tumble; click an OS/work card → its image pops into color with the bounce.
