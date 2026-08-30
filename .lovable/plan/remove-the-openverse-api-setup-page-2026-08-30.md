# Remove the Openverse API setup page

Now that `OPENVERSE_CLIENT_ID` and `OPENVERSE_CLIENT_SECRET` are stored as secrets, the in-app registration/setup flow is no longer needed. Removing it reduces the attack surface: the registration endpoint accepts an arbitrary email and returns fresh API credentials, and the status endpoint probes the stored keys — neither needs to be publicly reachable.

## What gets removed

1. **Route:** Delete `src/routes/openverse-setup.tsx` (the whole setup page: registration form, status badge, copy fields).
2. **Server functions:** Delete `src/lib/openverse/register.functions.ts` and `src/lib/openverse/register.server.ts` (Openverse app registration + credential status probing). These are only used by the setup page.
3. **Links:** Remove the "Openverse setup" link from the onboarding header in `src/routes/index.tsx` (keep the "Open source licenses" link).

## What stays

- `src/lib/openverse/openverse.server.ts` and `openverse.functions.ts` — the actual media search used by the apps; it keeps reading the stored secrets server-side.
- The licenses page attribution for Openverse.
- The stored secrets themselves — untouched; the apps keep working with authenticated rate limits.

## Verification

- `bun run typecheck` and production build pass (route tree regenerates without the deleted route).
- Playwright check: `/` loads with no "Openverse setup" link, `/openverse-setup` no longer resolves as a page, and an Openverse-powered app (e.g. DeckDreamer) still renders media.
