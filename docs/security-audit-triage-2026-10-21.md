# Security audit triage — 2026-10-21

## Prioritization

The audit reports **0 confirmed findings**, so there are no remediation issues to file or confirmed findings to rank. The two leads below remain unranked and have no severity assigned because each depends on an unresolved external fact. The rejected Termageddon candidate is intentionally not included.

Issue creation is unavailable in this session, so the single required needs-validation issue is prepared below for filing.

## Issue to file

**Title:** `[security][needs-validation] Audit leads to validate`

**Body:**

Checklist for the needs-validation leads from [parent issue #4](https://github.com/Mike-Demo/pretend-pro-suite/issues/4). These are not confirmed findings; validate the exact missing facts below before assigning severity or creating remediation work.

- [ ] **No frame-ancestors / X-Frame-Options anywhere: site is framable by any origin (impact confined to local UI state)**
  - Fingerprint: `no-frame-ancestors-clickjacking-local-state`
  - Claimed root cause: Framing protection requires a response header, but the CSP is meta-delivered (`src/routes/__root.tsx`, whose own comment notes frame-ancestors cannot be set via meta) and `public/_headers` supplies no Content-Security-Policy or X-Frame-Options header, leaving no in-repo frame-ancestors control.
  - Missing fact: The live deployed response headers for a prerendered HTML page on pretend.pro (e.g. /en/privacy or /) are unknown from source - specifically whether Content-Security-Policy: frame-ancestors or X-Frame-Options is added by SpaceFast/Lovable outside the repository. The repo alone cannot resolve this decisive fact.

- [ ] **Openverse API URL fields reach visitor href/src sinks with no scheme allowlist (javascript: attribution link)**
  - Fingerprint: `openverse-unvalidated-url-schemes`
  - Claimed root cause: Third-party API URL fields are copied verbatim with no scheme allowlist in `toAsset()` (`src/lib/openverse/search.ts`) and flow unvalidated into the Attribution anchor href and media src sinks.
  - Missing fact: Whether api.openverse.org can return a non-http(s) (e.g. javascript:) value in url, foreign_landing_url, creator_url or license_url for the app's fixed queries - i.e. whether Openverse ingest/API validation enforces http(s) on those fields - is unknown from source and is decisive.
