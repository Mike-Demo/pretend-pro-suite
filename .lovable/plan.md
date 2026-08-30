# Colored illustration variants on selected onboarding cards

## Goal

On the onboarding screen, each option card (OS editions + work types) shows its Transhumans illustration in black & white by default and switches to the colored version when the card is selected.

## Waiting on you

You chose to upload the colored artwork yourself. Please upload the 8 colored illustrations (any common format: PNG, WebP, or SVG), ideally named to match the current set:

- pondering
- coffee
- growth
- experiments
- looking-ahead
- chillin
- waiting
- feliz

If names differ, I'll map them by similarity.

## What gets built (once the art is uploaded)

1. **Import the colored files** into `src/assets/transhumans/` (e.g. `pondering-color.webp`), optimized like the existing set (SVG + WebP via the existing pipeline conventions).
2. **Extend `Illustration.tsx`**:
   - Add an optional `color?: boolean` prop (or a parallel `coloredIllustrations` map keyed by `IllustrationName`).
   - When colored art exists for a name, render the colored variant when `color` is true; otherwise fall back to the current B&W art.
3. **Onboarding cards** (`Onboarding.tsx` `OptionCard`): pass `color={selected}` so the illustration swaps to the colored version on selection, with the existing transition classes for a smooth feel. No layout shift — colored assets get the same dimensions as the B&W ones.
4. **Preload safety**: keep the priority/LCP behavior unchanged (only the single above-the-fold illustration loads eagerly; colored variants load lazily).
5. **Licenses page**: the existing Transhumans (Pablo Stanley, CC0 1.0) credit already covers these; update the note if the colored files come from a different source.

## Verification

- `bunx tsgo --noEmit` passes.
- Visual check on `/us-en`: cards show B&W art, selecting a card swaps to the colored version instantly with no flicker or layout shift, on desktop and mobile widths.
- Confirm dark mode still looks right.

## Technical details

- Files touched: `src/components/pretendpro/Illustration.tsx`, `src/components/pretendpro/Onboarding.tsx`, new files in `src/assets/transhumans/`.
- No routing, i18n, or backend changes.
