# Fix the collapsed, overlapping onboarding cards

## What's happening

Every native `<button>` in the app is being forced to a fixed ~43px height by a
stylesheet that was recently added to the site's `<head>`. The onboarding option
cards are buttons containing an illustration plus two lines of text, so their
contents (about 180px tall) spill outside the squashed 43px box and land on top of
each other and on neighbouring cards — exactly what the screenshot shows.

Confirmed by measuring the live page: the selected card's box is 43px tall while its
illustration and labels render from 60px above it to 60px below it, and the matched
CSS rule setting `height` on the button comes from the Web Awesome native-element
stylesheet loaded from a CDN, not from the app's own styles.

## The fix

Stop loading the Web Awesome global stylesheet. Nothing in the app uses Web Awesome
components — it was pulled in as a blanket stylesheet and its only visible effect is
restyling and resizing every native button, input, select and textarea in the app.
Removing it restores the card layout with no loss of function.

Font Awesome icons stay: the footer and sign-in page use `fa-` classes. Two different
Font Awesome versions are currently loaded from two different CDNs; keep one (the
7.3.1 build) and drop the duplicate so icons keep rendering with one fewer round trip.

## Verification

- Reload the onboarding page at phone width and confirm each style/work card again
  shows illustration, title and description stacked inside its own border, with no
  overlap and no clipping.
- Spot-check the continue button, the tab strip, the locale flag row, the footer
  icons and the sign-in page so nothing else depended on the removed stylesheet.

## Technical detail

- `src/routes/__root.tsx`: remove the `@awesome.me/webawesome@3.12.0` stylesheet link
  and the duplicate `font-awesome/6.5.2` cdnjs link from the root `head().links`,
  keeping the `@fortawesome/fontawesome-free@7.3.1` link.
- No component or Tailwind token changes; the card markup in
  `src/components/pretendpro/Onboarding.tsx` is already correct.
