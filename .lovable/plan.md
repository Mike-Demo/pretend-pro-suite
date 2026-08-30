# Deep-Dive Performance Audit + Optimization Backlog

Goal: run a repeatable, evidence-first performance test suite against the real production build (not the dev server), then produce a ranked, quantified list of optimization suggestions.

Baseline already established in earlier work: production Lighthouse score 96 (FCP 2.0s, LCP 2.4s, TBT 0ms, CLS 0.001), with three known leftovers: ~42 KiB unused JS in the 106 KiB entry chunk, one render-blocking stylesheet (~15 KB Brotli), and ~40 ms forced reflow during hydration. This plan verifies those and hunts for the rest.

## Phase 1 — Test harness (repeatable, no guesswork)

1. Build production output and serve it locally through Wrangler so headers, compression, and the Worker runtime match production.
2. Write a scripted audit runner under `scripts/perf/` that:
   - runs Lighthouse 3x per route and reports the median (single runs are noisy),
   - covers desktop and mobile throttling profiles,
   - audits every route: `/`, `/fruit`, `/apperture`, `/bufferium`, `/android`, `/fos`, `/licenses`,
   - saves JSON + HTML reports under `/mnt/documents/perf/<date>/`.
3. Bypass the hCaptcha gate for measurement only by seeding the verification cookie in the Playwright/Lighthouse context, so protected OS routes can actually be measured (this blocked earlier runs).
4. Capture cold vs. warm cache runs to prove the `_headers` immutable caching is effective.

## Phase 2 — Deep-dive measurements beyond Lighthouse

- **Bundle composition**: per-route JS/CSS transfer sizes (Brotli), chunk graph, duplicate dependency detection, and which chunks each route pulls. Identify heavy libs actually reaching the client (recharts, cmdk, date-fns, embla, react-day-picker, radix packages).
- **Coverage with source attribution**: Chrome DevTools JS/CSS coverage on `/` and each OS route. Every unused-JS finding reports package name, import path, chunk name, unused bytes, and routes affected.
- **Runtime profiling**: performance traces of (a) hydration, (b) launching all 11 fake apps, (c) dragging/resizing/snapping a window, (d) power/reboot overlay animations. Report long tasks >50 ms, dropped frames, and layout-thrash sources with the responsible component/trace event.
- **Interaction latency**: INP measurement for dock launch, window drag start, command palette open, theme/appearance toggle.
- **Memory (quantified)**: open and close all windows 25 times; report retained node count delta, retained listener count delta, heap delta, and detached DOM node count.
- **Network waterfall**: request count, critical path depth, Openverse media calls (cache hit rate, image sizes, whether they block paint).
- **SSR cost**: server response time per route and time-to-first-byte from the Worker.

## Phase 3 — Budgets and evidence rules

Evaluate every route against these budgets and report PASS/FAIL per budget:

- JS entry chunk < 75 KiB Brotli
- render-blocking CSS < 5 KiB Brotli
- LCP < 2.0 s mobile
- INP < 200 ms
- CLS < 0.01
- individual route JS < 150 KiB transferred

Hard rules for every finding and recommendation:

- Tagged with exactly one confidence label: `[MEASURED]`, `[LIKELY]`, or `[HYPOTHESIS]`. An untagged item is invalid and must be dropped.
- Must name affected routes, responsible bundle/chunk (or request/trace event), and measured cost in bytes or milliseconds.
- Must state current measured value, projected value after the change, and estimated delta.
- Must name the Core Web Vital it improves: LCP, INP, CLS, TTFB, or None.
- Baseline measurements are recorded once and preserved unchanged for future diffs.
- Ranking is computed, not opinionated: `Impact Score` = estimated user-facing gain, `Effort Score` = implementation complexity, `Priority Score = Impact / Effort`, sorted descending.
- Do not recommend code splitting, lazy loading, tree shaking, image optimization, caching, or SSR improvements unless a specific measured asset, component, request, or trace event proves the opportunity.


## Phase 3 — Deliverable

A markdown report at `/mnt/documents/perf/report.md` containing:
- Score table per route (desktop + mobile), before-numbers only in this phase.
- Evidence section: waterfalls, coverage numbers, trace findings, screenshots.
- **Ranked optimization list**, each item with: measured cost, estimated saving, implementation effort, risk, and rollback note. Split into Quick wins / Medium / Structural, e.g. candidates to be confirmed by data:
  - trim unused entry-chunk JS (route-level splitting of shell chrome, drop unused shadcn/radix imports),
  - drop or lazy-load heavy deps that only one app screen uses,
  - CSS slimming: Tailwind output audit, per-theme token CSS loaded only for the active OS,
  - eliminate hydration forced reflow by caching window/desktop measurements,
  - image pipeline: AVIF variants alongside WebP, correct `sizes`, Openverse thumbnail sizing,
  - animation cost: promote transforms only, avoid layout-triggering properties in drag/snap,
  - prefetch tuning (intent vs. viewport) and SSR/streaming opportunities.
- Explicit confidence labels (measured fact vs. hypothesis) on every recommendation.

No production behavior changes in this plan — it is measurement plus a prioritized backlog. Implementation happens in follow-up passes you approve item by item.

## Technical notes

- Perf scripts live in `scripts/perf/` and are dev-only; nothing is added to the shipped bundle.
- Lighthouse/Playwright/Chromium are already available in the sandbox; no new runtime dependencies.
- All measurements run against `dist/` served by Wrangler; the Vite dev server is explicitly excluded as unrepresentative.
