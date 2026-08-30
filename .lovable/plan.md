# PretendPro 3000 — Parody Productivity Suite Mockup

A single-page, poster-style interactive mockup of a fake office suite. Cheerful pastel retro styling, rounded corners, playful micro-animations, sparkles.

## What gets built

**Home / poster hero** (at `/`)
- Big wordmark "PretendPro 3000" with tagline "The world's most advanced productivity suite for getting absolutely nothing done."
- Retro dock of 4 app icons (DocuFaker, SheetShenanigans, BrowserBuddy, Inbox Mirage) that switch the screen below.
- Three toggles: Full-Screen Mode (cinematic dark vignette + dramatic lighting), Animation Mode (bouncy elements), Page View Mode (tab bar for each app).

**DocuFaker** — fake doc editor
- Nonsense paragraphs ("synergizing waffle metrics"), animated typewriter mode, giant "Look Busy" button that fills the page with jargon and flashes toolbars.

**SheetShenanigans** — fake spreadsheet
- Grid with absurd formulas (`=VLOOKUP(CHAOS)`, `=SUM(VIBES:INFINITY)`), rainbow bar/pie charts, "Quarterly Vibes Report" header.

**BrowserBuddy** — parody browser
- Tab strip: "Important Research", "Definitely Work", "Cat Videos (Incognito)"; fake URL bar, fake page content per tab.

**Inbox Mirage** — fake email client
- Auto-generates urgent messages from imaginary coworkers on a timer (client-side generator, no backend), unread badges, "URGENT!!" flags.

**Easter eggs** (persistent chrome)
- Progress bar frozen at 99% ("Almost done…").
- Motivational sticky note: "You're doing great, probably."
- Fake system alert dialog: "Your PretendPro license has expired due to excessive pretending" — dismissible, reappears occasionally.
- Floating sparkles layer.

## Technical notes

- Rewrite `src/routes/index.tsx` as the single suite shell; app screens as components under `src/components/pretendpro/` (Dock, ModeToggles, DocuFaker, SheetShenanigans, BrowserBuddy, InboxMirage, StickyNote, StuckProgress, LicenseAlert, Sparkles).
- Fake content generators live in `src/lib/pretendpro/` (jargon phrases, coworker emails, formulas) — pure TS, separate from UI.
- Add pastel/retro design tokens to `src/styles.css` (`@theme` + `:root` oklch values): mint, bubblegum, butter, sky, grape, plus chart colors, soft shadows, and a cinematic overlay token. No hardcoded color utilities in components.
- Animation via CSS keyframes/tw-animate-css, gated by an Animation Mode flag in React state; respects `prefers-reduced-motion`.
- shadcn/ui for buttons, tabs, dialog, cards; mobile-first responsive (dock wraps, spreadsheet scrolls horizontally).
- Route `head()` gets a PretendPro-specific title, description, og/twitter tags.
- No backend needed — everything is client-side fake state.
