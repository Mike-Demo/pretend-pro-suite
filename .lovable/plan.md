# hCaptcha Gate Before Onboarding

Add a human-check screen that appears before anything else — whether someone lands on the homepage or arrives via a direct link like `/fruit?app=inbox` — then sends them on to exactly where they were headed.

## Flow

```text
visit any page  ->  verified?  -- yes -->  original page (or "/" if none)
                       |
                       no
                       v
                  /verify  ->  solve hCaptcha  ->  server verifies  ->  redirect back
```

## What gets built

Verification page (`/verify`)
- Centered card matching the onboarding style (same warm card, rounded corners, appearance toggle, light/dark aware).
- hCaptcha widget loaded from hCaptcha's JS API using the public site key.
- On solve, the token goes to a server function that calls hCaptcha's `siteverify` with the secret key; on success we set a signed, httpOnly session cookie (`pp_verified`, 12 hours) and redirect.
- Friendly on-brand copy ("Prove you're a human pretending to work"), error state with retry if verification fails.
- Not indexed (`robots: noindex`) and excluded from the sitemap.

Gating
- A check in the root route's `beforeLoad`: if the cookie is absent and the requested path is not `/verify`, redirect to `/verify?redirect=<original path + search>`.
- The redirect target is validated as an internal path only (must start with `/`, no protocol/host), so it can't be used to bounce users off-site; anything invalid falls back to `/`.
- `/licenses` stays reachable without the check (legal/attribution page), as do `robots.txt`, `sitemap.xml`, the manifest, and icons.
- Once verified, normal onboarding continues unchanged.

Keys
- `VITE_HCAPTCHA_SITE_KEY` (public, safe in the browser) and `HCAPTCHA_SECRET_KEY` (server only) are collected through the secure secret form — never pasted into code or chat.
- If keys are missing, the gate is skipped rather than locking the site out, and the verify page explains it's unconfigured.

## Technical notes

- `src/lib/captcha/verify.server.ts` — calls `https://api.hcaptcha.com/siteverify`, reads `process.env['HCAPTCHA_SECRET_KEY']` inside the handler.
- `src/lib/captcha/verify.functions.ts` — `verifyCaptcha` server function (`POST`), Zod-validated `{ token, redirect }`, returns `{ ok }` and sets the cookie via response headers.
- `src/lib/captcha/session.ts` — cookie name, HMAC signing/parsing with an app secret, 12h expiry, and the internal-redirect validator.
- `src/routes/verify.tsx` — the gate page; widget mounted client-side after hydration (no SSR of the hCaptcha script).
- `src/routes/__root.tsx` — `beforeLoad` gate with the allowlist above.
- Verification: typecheck, production build, and a Playwright pass confirming an unverified visit to `/fruit?app=inbox` lands on `/verify` and that a verified session restores that exact URL.
