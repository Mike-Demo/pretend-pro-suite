# Act on the audit: cut critical JS and fix phone-shell LCP

Four changes, each tied to a measured number in `perf/2026-08-30-baseline`. Nothing about the desktop shells' rendering path changes.

## 1. Lazy-load the toast layer (OPP-001)

`src/routes/__root.tsx` imports `Toaster` from `@/components/ui/sonner` statically, which puts **32 KiB raw of sonner inside the 92.5 KiB Brotli entry chunk** on every route (`evidence/bundle/attribution.json`).

Wrap it in `React.lazy` + `Suspense fallback={null}` so the toast runtime is fetched on first render idle rather than blocking the entry chunk. Toast call sites (`toast(...)` from sonner) stay untouched; only the visual container moves.

## 2. Keep seroval off routes that never call a server function (OPP-002)

`__root.tsx` statically imports `getCaptchaGate` from `@/lib/captcha/verify.functions` for its `beforeLoad`. That pulls the shared `createServerFn` chunk — **38.3 KiB, 89.7% unused on `/`, of which 21.5 KiB is seroval** — into every route's eager graph.

Change `beforeLoad` to `await import("@/lib/captcha/verify.functions")` inside the branch that actually needs the gate. The existing early exits already cover the common cases:
- `isOpenPath(location.pathname)` returns before any import (so `/` and `/licenses` never touch it),
- the `sessionStorage` verified flag returns before any import on repeat in-app navigation.

Gate behaviour, redirect logic, and the SSR path are unchanged — only the import timing moves. Openverse apps keep their own server-function usage; their chunks already load lazily.

## 3. Remove the hydration waterfall in front of mobile LCP (OPP-006)

Measured chain on `/android` (`evidence/runtime/runtime.json`, unthrottled): FCP 228 ms but **LCP 756 ms**; on mobile Lighthouse this stretches to **LCP 3131 ms vs FCP 2289 ms** (`/fos`: 2966 vs 2144). The gap is three sequential client steps, not paint cost:

```text
hydrate  ->  lazy shell chunk (AndroidShell/FosShell)  ->  useEffect launch(initialApp)  ->  lazy app-screen chunk  ->  LCP element
```

Fixes in `src/components/pretendpro/mobile/Phone.tsx` (and the two mobile shell modules):

- Launch the onboarding app during state initialisation instead of in a post-hydration `useEffect`, so the foreground app is known on the first render pass rather than one commit later. The "restored session wins" rule is preserved.
- Statically import `AndroidShell` / `FosShell` in their own route-level entry rather than `lazy()` inside `Phone`. Each phone route only ever renders one of the two, so this removes a round trip without adding bytes to the other route. Desktop shells keep their current lazy setup.
- Warm the initial app screen's chunk at module level for the mobile path via the existing `preloadAppScreen`, so its fetch overlaps hydration instead of starting after it.

Target: mobile LCP under 2000 ms on `/android` and `/fos`; no change to `/fruit`, `/apperture`, `/bufferium`.

## 4. Explicitly out of scope

Splitting the 14.5 KiB Brotli stylesheet per OS theme (OPP-007) stays deferred: it is the only "L effort / Medium risk" item in the backlog and it touches every theme's token surface. `tailwind-merge` (26 KiB) and `@tanstack/query-core` (24 KiB) also stay in the entry chunk — `cn()` is used by nearly every component and the query client is a root provider, so moving them relocates bytes without removing a fetch.

## Verification

Rebuild, restart the local Wrangler production server, and re-run the existing harness against the frozen baseline:

- `scripts/perf/bundle.mjs` — entry chunk Brotli size, expect a drop from 92.5 KiB
- `scripts/perf/network.py` — cold JS transferred per route, expect `/` and `/licenses` to lose the `createServerFn` chunk
- `scripts/perf/runtime.py` — coverage plus the FCP/LCP gap on `/android` and `/fos`
- `scripts/perf/lighthouse.mjs` — 3x medians, mobile and desktop, all seven routes
- `scripts/perf/report.mjs` — regenerate into `perf/<today>` and diff budget PASS/FAIL against the baseline

Also confirm by hand: a toast still appears (power settings toggle), `/fruit` still redirects to `/verify` without a valid cookie, and the phone shells still boot into the onboarding-selected app.
