# Six New Pretend Apps + Real Openverse Media

## What you get

Onboarding step 1 grows from 4 to 10 work options, each launching its own fake app:

| Work option | New app |
| --- | --- |
| Code (Web) | CodeFaker — web mode |
| Code (Game) | CodeFaker — game mode |
| Presentation | DeckDreamer |
| Reading documents | ReaderRealm |
| Editing photos | PhotoPretender |
| Editing videos | ReelPretender |
| Editing sound | SoundStage |

All six appear in the Fruit dock, Apperture taskbar and Bufferium shelf, in the command palette, and as draggable/snappable windows exactly like the existing four. Number keys extend to `1`–`9`, plus palette search for the rest.

App sketches (all fake, all wholesome):
- CodeFaker — a fake editor with a file tree, animated "compiling" log, nonsense TypeScript/game-loop snippets, and a Look Busy terminal that scrolls forever.
- DeckDreamer — slide sorter plus a presenter view; slides titled "Q4 Vibes Roadmap" with real Openverse photo backgrounds.
- ReaderRealm — a PDF-ish reader with a page-turn feel, highlight tool, and Openverse cover art.
- PhotoPretender — layer panel, sliders that do apply real CSS filters, and a stock-photo canvas from Openverse.
- ReelPretender — timeline with clips, playhead, and an "always rendering at 99%" export (only cheeky when Fun Mode is on).
- SoundStage — waveform track view playing real CC-licensed Openverse audio with transport controls.

## Openverse integration

Real Creative-Commons media, fetched through a server function so no key ever reaches the browser:
- Images: DeckDreamer backgrounds, ReaderRealm covers, PhotoPretender canvas, BrowserBuddy image results.
- Audio: SoundStage tracks and ReelPretender clip audio.
- A shared "Stock Assets" panel any app can open to search Openverse.
- Every asset shows creator + license with a link back to the source, and licenses page gains an Openverse credit.
- Results are cached and every surface has a built-in placeholder, so the apps still look right if the API is slow or rate-limited.

## API keys — how we get them

Openverse works anonymously with tight rate limits, so the build ships working either way. To raise the limits:
1. I add a small one-time "Register Openverse key" server action that posts your app name, description and email to Openverse's registration endpoint.
2. Openverse emails you a verification link; clicking it activates the credentials.
3. You paste the returned client ID and secret into the secure secret form I open (`OPENVERSE_CLIENT_ID`, `OPENVERSE_CLIENT_SECRET`).
4. The server function then uses OAuth token auth automatically, falling back to anonymous when the secrets are absent.

## Technical notes

- `chrome.tsx`: extend `AppId` to the 10 ids with icons/chips; `search.ts` validates the widened union so old `?app=` links still work.
- New components under `src/components/pretendpro/`: `CodeFaker.tsx`, `DeckDreamer.tsx`, `ReaderRealm.tsx`, `PhotoPretender.tsx`, `ReelPretender.tsx`, `SoundStage.tsx`, plus `StockAssets.tsx` panel. `Suite.tsx`/`Desktop.tsx` render by id from one registry map.
- `src/lib/openverse/openverse.functions.ts`: `searchOpenverseImages` / `searchOpenverseAudio` via `createServerFn` with Zod-validated input, in-memory response cache, typed DTOs (`id`, `url`, `thumbnail`, `title`, `creator`, `creatorUrl`, `license`, `licenseUrl`, `foreignLandingUrl`). Token logic and `process.env` reads live in `openverse.server.ts`, called inside the handler.
- `src/lib/openverse/register.functions.ts`: one-shot registration call to `https://api.openverse.org/v1/auth_tokens/register/`.
- Client fetches use TanStack Query with `useServerFn`; no direct API calls from components.
- Window layout persistence, snapping, keyboard shortcuts and Fun Mode gating all apply unchanged to the new apps; onboarding grid reflows to 2/3/5 columns responsively.
- Media rendered with `loading="lazy"`, audio never autoplays, and reduced-motion preferences respected.
