# Roadmap

Consolidated from the archived build plans in `.lovable/plan/`. Completed
milestones are kept as a record of what shipped; open items are ideas, not
commitments.

## Shipped

- [x] PretendPro 3000 parody productivity suite mockup — the original concept and
      landing page.
- [x] Onboarding flow: pick a pretend OS, then a task; per-edition theme pages.
- [x] Reordered onboarding (OS first) with desktop/mobile tabs, page transitions
      with a loader, and a retuned mono-brand palette.
- [x] Colored illustration variants on the selected onboarding card, with the
      animation moved from the page to the card images.
- [x] Fixed the collapsed/overlapping onboarding cards (caused by a global
      third-party stylesheet forcing native button heights).
- [x] OS window theme selector; real windows, a real dock, and desktop shells for
      Fruit, Apperture (Fluent 2) and Bufferium.
- [x] Mobile editions: Android and FOS shells with home screen, recents and
      status bar.
- [x] Eleven parody apps, including six added later with real Openverse media.
- [x] Power button with an OS-styled fake loading screen, plus the pretend power
      center: restart, status, settings, shortcuts, fake updates.
- [x] Onboarding always lands in a real working suite (no dead ends).
- [x] Multilingual mode: flag picker and locale sub-folder URLs for six locales.
- [x] Licenses, privacy and terms pages.
- [x] New logo, favicon, full icon set, web app manifest and Nebula Sans fonts.
- [x] Social preview images replaced with the PretendPro banner.
- [x] Simple PWA splash screen (manifest + iOS startup images).
- [x] Performance work: deep-dive audit, critical JS cut, phone-shell LCP fix,
      critical inline CSS, font preloads, Brotli/gzip precompression.
- [x] Fixed OS pages sitting too low and clipping the dock.
- [x] SEO basics: per-route head metadata, `html lang`, static sitemap, robots,
      Google Search Console verification and sitemap submission.
- [x] Removed the Openverse API setup page and the hCaptcha gate.
- [x] Fully static build: all 385 pages prerendered, output copied to
      `dist/client`, SPA fallback via `_redirects`.
- [x] Repository hand-off docs: README, `docs/architecture.md`,
      `docs/deployment.md`, `docs/environment.md`, this roadmap.

## Open

- [ ] Work through the remaining items in the performance backlog
      (`.lovable/plan/deep-dive-performance-audit-optimization-backlog-2026-08-30.md`):
      further route-level code splitting and image budget tightening.
- [ ] Accessibility pass: keyboard traversal of the dock, windows and power
      center; focus-visible states in all five shells; reduced-motion handling
      for animation mode.
- [ ] Openverse resilience: persist the media cache across visits and show a
      quiet "using placeholders" hint when the API is rate-limited.
- [ ] More locales (non-English strings rather than English variants) and an
      automated hreflang check.
- [ ] More pretend apps (calendar, chat, a fake VPN status widget) and more
      easter eggs.
- [ ] Automate the page list: generate `tanstackStart.pages` and
      `public/sitemap.xml` from the locale/edition/app registries so adding one
      is a single-file change.
- [ ] Regression tests for the window machine and the onboarding flow, plus a
      smoke check that every prerendered page renders after hydration.
