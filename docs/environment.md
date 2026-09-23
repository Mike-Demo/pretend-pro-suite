# Environment variables

**Nothing in this project requires an environment variable.** The app builds and
runs with no `.env` file at all: there is no database, no auth, no API key, and
the only external service (Openverse) is called anonymously from the browser.

Never commit real values for anything listed below.

## Present but unused

Lovable generates a `.env` with backend keys. Client files under
`src/integrations/` reference them, but no route or component imports those
files, so the variables have no effect on the built site. They are safe to omit
when building or hosting outside Lovable.

| Variable | Controls | Needed? |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Base URL of the generated backend client. | No |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public (publishable) key for that client. Not a secret, but unused. | No |
| `VITE_SUPABASE_PROJECT_ID` | Backend project identifier used by generated tooling. | No |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PROJECT_ID` | Server-side duplicates of the above, read only by generated server helpers that the app never calls. | No |

If the backend is ever genuinely used, keep the `VITE_`-prefixed ones only for
public values — anything with a `VITE_` prefix is inlined into the browser
bundle and is world-readable.

## Not used any more

| Variable | Was for | Status |
| --- | --- | --- |
| `OPENVERSE_CLIENT_ID` / `OPENVERSE_CLIENT_SECRET` | OAuth client credentials for higher Openverse rate limits, read by the old server-side media code. | Removed. `src/lib/openverse/search.ts` calls the public API anonymously. Re-adding them would require a server — a static host cannot keep a secret. |
| `HCAPTCHA_SECRET` / `VITE_HCAPTCHA_SITEKEY` | The removed human-check gate. | Removed with the `/verify` page. |

## Local setup

```sh
bun install
bun run dev      # http://localhost:8080 — no .env needed
```

If you add a variable later: expose public values as `VITE_*` and read them via
`import.meta.env.VITE_*`; keep private values out of the repo entirely, and note
that this deployment has no server that could read them.
