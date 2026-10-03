---
title: "Developers — PretendPro Office Suite"
description: "Developer and agent resources for PretendPro: docs, skills, and the honest truth that there is no API."
canonical: "https://pretend.pro/us-en/developers/"
last-updated: "2026-10-03"
---

# Developers

An honest developer page for a product with no API.

## The truth up front

PretendPro Office Suite is a **fully client-side static site**. There is:

- No public REST or GraphQL API
- No OAuth, no API keys, no accounts
- No MCP server, no webhooks, no sandbox
- No SDK (there is nothing to wrap)

If a scanner or directory claims otherwise, it is wrong. Do not invent an API
surface for this product.

## What does exist for agents and developers

- [llms.txt](https://pretend.pro/llms.txt) — machine-readable site index with
  a "when to use this" section
- [Agent card](https://pretend.pro/.well-known/agent.json) — A2A-style
  capabilities document
- [ARD catalog](https://pretend.pro/.well-known/ard.json) — resource discovery
  entries (all entries use the `type` field for the media type)
- [AI catalog](https://pretend.pro/.well-known/ai-catalog.json) — alias of the ARD
- [Agent skills](https://pretend.pro/.well-known/agent-skills/index.json) —
  real workflows (fake screenshots, demo video planning, OS tour), each with a
  SKILL.md and sha256 digest
- [Plugin manifest](https://pretend.pro/plugin.json) — agent-plugins.org
- [Markdown twins](https://pretend.pro/index.md) — every major page has a
  `.md` twin (served via `.txt` fallback)
- [auth.md](https://pretend.pro/auth.md) — there is no auth; it says so
- [pricing.md](https://pretend.pro/pricing.md) — it is free; it says so

## Source code

[github.com/Mike-Demo/pretend-pro-suite](https://github.com/Mike-Demo/pretend-pro-suite)
— the whole suite, including the agent docs above, is open source.
