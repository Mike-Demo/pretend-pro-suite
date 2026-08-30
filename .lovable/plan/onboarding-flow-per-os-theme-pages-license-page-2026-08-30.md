# Onboarding Flow + Per-OS Theme Pages + License Page

Split PretendPro 3000 into an onboarding-first experience: the root page asks what kind of work the user wants to mimic and which window style, then routes into a dedicated page per OS theme.

## Routes

```text
/                  Onboarding wizard (Notion-style card picker)
/fruit             PretendPro suite in Fruit (Mac OS X) chrome
/apperture         PretendPro suite in Apperture (Windows) chrome
/bufferium         PretendPro suite in BufferiumOS (ChromiumOS) chrome
/licenses          Open source licenses & attribution
```

## Onboarding (root page)

Modeled on the attached reference: centered warm card, big question, a row of 3 selectable
option cards each with an illustration + title + one-line description, a radio dot top-right,
and a Continue button that stays disabled until a choice is made. A small illustrated character
sits in the lower-left corner of the card.

Two steps, with a simple step indicator:

1. **"How are you planning to pretend to work?"**
   - Deep Document Work (DocuFaker) — Type nonsense with total conviction.
   - Spreadsheet Theater (SheetShenanigans) — Formulas that mean nothing, charts that mean less.
   - Research Browsing (BrowserBuddy) — Tabs that look important. Mostly cats.
   - Urgent Inbox Triage (Inbox Mirage) — Imaginary coworkers, imaginary deadlines.
2. **"Which window style feels most like your job?"**
   - Fruit (Mac OS X), Apperture (Windows), BufferiumOS — each card previews the title bar chrome.

Continue on step 2 navigates to `/fruit`, `/apperture`, or `/bufferium` with the chosen app
preselected via a search param (`?app=docufaker`). Back link returns to step 1.

Illustrations come from the uploaded Transhumans pack by Pablo Stanley (CC0 1.0) — a small
curated subset (about 8 SVGs) is copied into the project; the rest of the 123 MB zip is not.

## OS theme pages

Each theme page renders the existing suite (dock or page tabs, four app screens, sparkles,
sticky note, 99% progress bar, license alert, full-screen window) wrapped in `WindowFrame` with
its theme fixed. Shared UI is extracted once so the three pages stay thin.

Per page: its own `head()` title/description/og tags, a "Change style" link back to onboarding,
and a footer link to `/licenses`. The header's Window Style picker becomes style links (switching
navigates between the three pages) so the current theme always matches the URL.

## License page

Plain readable page listing every open source work used, each with name, author, license, and
link: Transhumans illustrations (Pablo Stanley, CC0 1.0), lucide-react icons (ISC), shadcn/ui
(MIT), Radix UI (MIT), Tailwind CSS (MIT), React (MIT), TanStack Router/Start/Query (MIT),
sonner (MIT), plus the design references consulted (Apple/macOS, Microsoft Fluent docs,
ChromiumOS UX docs) noted as inspiration only. Linked from every page footer.

## Technical notes

- `src/components/pretendpro/Suite.tsx`: extracted shell taking `osTheme` + initial `AppId`;
  holds the app switching, mode toggles, and full-screen overlay currently in `src/routes/index.tsx`.
- `src/routes/index.tsx` becomes the onboarding wizard (local `useState` only, no backend).
- `src/routes/fruit.tsx`, `apperture.tsx`, `bufferium.tsx`: thin routes with `validateSearch`
  for the optional `app` param, each rendering `<Suite osTheme=... />`.
- `src/routes/licenses.tsx`: static content route.
- Selected SVGs copied to `src/assets/transhumans/*.svg`, imported with Vite `?url` and rendered
  in `<img>` tags (kept local rather than CDN so SVGs render inline).
- Existing `WindowFrame`, `chrome.tsx`, app screens, and design tokens are unchanged; no
  hardcoded color utilities, mobile-first responsive cards (stacked on small screens).
