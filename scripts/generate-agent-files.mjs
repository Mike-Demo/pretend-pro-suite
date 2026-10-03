#!/usr/bin/env python3
"""Generate pretend.pro agent-discovery files: ARD, AI catalog, agent-card,
agent-skills index + SKILL.md files, plugin.json. Computes sha256 digests."""
import json, hashlib, os

ROOT = os.path.expanduser("~/workspace/pretend-pro")
WK = os.path.join(ROOT, "public", ".well-known")
SKILLS = os.path.join(WK, "agent-skills", "skills")
os.makedirs(SKILLS, exist_ok=True)

REPO = "https://github.com/Mike-Demo/pretend-pro-suite"
SITE = "https://pretend.pro"

def trust():
    return {
        "identity": REPO,
        "identityType": "source-repository",
        "attestations": [{
            "type": "source-code-availability",
            "statement": f"Source code is published at {REPO} and this catalog entry describes resources served from that codebase.",
        }],
    }

entries = [
    {
        "identifier": "urn:air:pretend.pro:webapp",
        "displayName": "PretendPro Office Suite",
        "description": "Wholesome parody office suite: browser-based fake-content demo tools (fake code editors, inboxes, documents, onboarding flows, social mockups) for realistic product screenshots and demos. Boots a pretend OS with fictional coworkers and nonsense documents. Free, no accounts, no API. Everything on the site is fictional parody.",
        "url": SITE + "/",
        "type": "text/html",
        "tags": ["parody", "demo-tools", "screenshots", "mockups", "office-suite"],
        "representativeQueries": [
            "What is PretendPro Office Suite?",
            "What fake demo tools does pretend.pro offer?",
        ],
        "trustManifest": trust(),
    },
    {
        "identifier": "urn:air:pretend.pro:llms-txt",
        "displayName": "PretendPro llms.txt",
        "description": "Machine-readable index of PretendPro Office Suite: the eleven demo tools, five pretend OS editions, six locales, and key pages. Includes a 'when to use this' section for AI agents.",
        "url": SITE + "/llms.txt",
        "type": "text/plain",
        "tags": ["llms-txt", "agent-docs", "index"],
        "representativeQueries": ["Where is pretend.pro documented for AI agents?"],
        "trustManifest": trust(),
    },
    {
        "identifier": "urn:air:pretend.pro:agent-card",
        "displayName": "PretendPro agent card",
        "description": "A2A-style agent card describing PretendPro Office Suite capabilities, skills, and the documentation-only contact surface. There is no message endpoint: this is a static parody site, not an interactive agent.",
        "url": SITE + "/.well-known/agent.json",
        "type": "application/json",
        "tags": ["agent-card", "a2a", "capabilities"],
        "representativeQueries": ["What are pretend.pro's agent capabilities?"],
        "trustManifest": trust(),
    },
    {
        "identifier": "urn:air:pretend.pro:agent-skills",
        "displayName": "PretendPro agent skills index",
        "description": "Index of agent skills for PretendPro Office Suite: real workflows for generating fake product screenshots, planning a fake demo video, and touring the parody OS editions. Each skill ships a SKILL.md with a sha256 digest.",
        "url": SITE + "/.well-known/agent-skills/index.json",
        "type": "application/json",
        "tags": ["agent-skills", "workflows", "skills"],
        "representativeQueries": ["What agent skills does pretend.pro publish?"],
        "trustManifest": trust(),
    },
    {
        "identifier": "urn:air:pretend.pro:plugin",
        "displayName": "PretendPro agent plugin manifest",
        "description": "Agent Plugins manifest bundling the PretendPro documentation surface and agent skills. No MCP servers: the product is a static site with no API.",
        "url": SITE + "/plugin.json",
        "type": "application/json",
        "tags": ["agent-plugins", "manifest"],
        "representativeQueries": ["Is there a pretend.pro agent plugin?"],
        "trustManifest": trust(),
    },
    {
        "identifier": "urn:air:pretend.pro:tools-feed",
        "displayName": "PretendPro tools JSONL feed",
        "description": "JSONL feed of the eleven PretendPro demo tools as schema.org SoftwareApplication records, with canonical locale-prefixed URLs.",
        "url": SITE + "/feeds/tools.jsonl",
        "type": "application/x-ndjson",
        "tags": ["feed", "jsonl", "schema-org", "tools"],
        "representativeQueries": ["List all PretendPro demo tools with URLs"],
        "trustManifest": trust(),
    },
]

ard = {
    "specVersion": "1.0",
    "host": "pretend.pro",
    "description": "Agent Resource Discovery catalog for PretendPro Office Suite (https://pretend.pro) — a wholesome parody office suite of fake-content demo tools. Static site: all resources are public, read-only, and require no authentication. There is no public API, no OAuth, and no MCP server.",
    "entries": entries,
}
with open(os.path.join(WK, "ard.json"), "w") as f:
    json.dump(ard, f, indent=2, ensure_ascii=False)
    f.write("\n")
with open(os.path.join(WK, "ai-catalog.json"), "w") as f:
    json.dump(ard, f, indent=2, ensure_ascii=False)
    f.write("\n")
print("wrote ard.json + ai-catalog.json (%d entries)" % len(entries))

# A2A agent card (documentation surface only — honest, no message endpoint)
agent_card = {
    "$schema": "https://a2a-protocol.org/schemas/agent-card.json",
    "name": "PretendPro Office Suite",
    "description": "Wholesome parody office suite: browser-based fake-content demo tools for realistic product screenshots and demos. Documentation surface only — this is a static site with no API, no accounts, and no interactive agent endpoint.",
    "url": SITE + "/",
    "provider": {"organization": "Mike \"Demo\" Demopoulos", "url": "https://mikedemo.dev"},
    "version": "1.0.0",
    "capabilities": {"streaming": False, "pushNotifications": False, "stateTransitionHistory": False},
    "defaultInputModes": ["text"],
    "defaultOutputModes": ["text"],
    "documentationUrl": SITE + "/developers",
    "skills": [
        {"id": s["id"], "name": s["name"], "description": s["description"], "tags": s["tags"]}
        for s in json.load(open(os.path.join(WK, "agent.json")))["skills"]
    ],
}
with open(os.path.join(WK, "agent-card.json"), "w") as f:
    json.dump(agent_card, f, indent=2, ensure_ascii=False)
    f.write("\n")
print("wrote agent-card.json")

# SKILL.md files
skills_md = {
    "fake-screenshots": (
        "Generate fake product screenshots with PretendPro",
        "Use PretendPro's browser-based parody tools to stage realistic product screenshots without using any real data.",
        """# Generate fake product screenshots with PretendPro

> Point a human (or a browser) at PretendPro's parody tools to stage realistic
> product screenshots and demo captures. Everything on the site is fictional.

## When to use

- You need a screenshot that looks like a real inbox, code editor, spreadsheet,
  document, slide deck, browser, PDF reader, photo editor, video editor, or
  audio editor — without touching real user data.
- You are preparing a product demo, pitch deck, tutorial, or marketing mockup.

## Workflow

1. Open the onboarding: https://pretend.pro/ — pick the pretend work to mimic
   (one of the eleven tools) and the pretend OS edition (fruit, apperture,
   bufferium, android, fos).
2. Or deep-link a tool directly with a locale prefix, e.g.
   https://pretend.pro/us-en/fruit/inbox (Inbox Mirage),
   https://pretend.pro/us-en/fruit/codeweb (CodeFaker),
   https://pretend.pro/us-en/fruit/sheets (SheetShenanigans).
3. Type or paste your own placeholder content into the fake tool, arrange the
   window, and capture the screenshot or screen recording.
4. Remember: every coworker name, email, document, and code sample is fictional
   parody — never present it as real data.

## Tool URLs (us-en/fruit shown; swap locale and edition as needed)

- DocuFaker (fake document editor): https://pretend.pro/us-en/fruit/docufaker
- SheetShenanigans (fake spreadsheet): https://pretend.pro/us-en/fruit/sheets
- BrowserBuddy (fake browser): https://pretend.pro/us-en/fruit/browser
- Inbox Mirage (fake inbox): https://pretend.pro/us-en/fruit/inbox
- CodeFaker (fake code editor): https://pretend.pro/us-en/fruit/codeweb
- DeckDreamer (fake slide deck): https://pretend.pro/us-en/fruit/deck
- ReaderRealm (fake PDF reader): https://pretend.pro/us-en/fruit/reader
- PhotoPretender (fake photo editor): https://pretend.pro/us-en/fruit/photos
- ReelPretender (fake video editor): https://pretend.pro/us-en/fruit/reels
- SoundStage (fake audio editor): https://pretend.pro/us-en/fruit/sound

## Notes

- No accounts, no API keys, no cost. The site is fully client-side.
- Locales: us-en, ca-en, uk-en, au-en, at-en, tlh (Klingon).
""",
    ),
    "demo-video-workflow": (
        "Plan a fake demo video with PretendPro",
        "Stage a multi-scene fake workday across PretendPro's parody OS editions for a demo video or walkthrough.",
        """# Plan a fake demo video with PretendPro

> Choreograph a convincing "day in the life" across PretendPro's pretend
> operating systems for demo videos, onboarding walkthroughs, or comedy sketches.

## When to use

- You need b-roll of someone "working": typing code, answering email,
  editing slides, tweaking a mix.
- You want a consistent fake desktop/phone across multiple scenes.

## Workflow

1. Pick one pretend OS edition as your "hero" desktop so scenes match:
   - Fruit (Mac OS X style): https://pretend.pro/us-en/fruit
   - Apperture (Windows style): https://pretend.pro/us-en/apperture
   - BufferiumOS (eternally almost-done shelf desktop): https://pretend.pro/us-en/bufferium
   - Android (phone home screen): https://pretend.pro/us-en/android
   - fOS (phone with dock): https://pretend.pro/us-en/fos
2. Script 3–5 beats, one tool per beat (e.g. inbox triage in Inbox Mirage,
   then "fixing" code in CodeFaker, then a standup slide in DeckDreamer).
3. Rehearse each tool's interactions once — they are mockups, not real apps,
   so know which buttons are decorative before you record.
4. Record in fullscreen. Everything visible is fictional parody content.

## Notes

- There is no backend and no recording feature; use your OS screen recorder.
- All content is fictional. Do not present screenshots as real workplaces.
""",
    ),
    "parody-os-tour": (
        "Tour the pretend OS editions",
        "Orient yourself (or a user) across PretendPro's five parody operating-system editions and six locales.",
        """# Tour the pretend OS editions

> A guided orientation across PretendPro's five pretend operating systems and
> six locales, for reviewers, new contributors, or the merely curious.

## When to use

- Someone asks what PretendPro is and wants the 2-minute tour.
- You need the canonical URL pattern for a tool in a specific locale/edition.

## The five editions

- Fruit — Mac OS X style desktop with a dock: https://pretend.pro/us-en/fruit
- Apperture — Windows style desktop with a start bar: https://pretend.pro/us-en/apperture
- BufferiumOS — shelf desktop that is eternally almost done: https://pretend.pro/us-en/bufferium
- Android — Android-style phone home screen: https://pretend.pro/us-en/android
- fOS — fOS-style phone with dock and home indicator: https://pretend.pro/us-en/fos

## URL pattern

https://pretend.pro/{locale}/{edition}/{tool}

- Locales: us-en, ca-en, uk-en, au-en, at-en, tlh (Klingon)
- Tools: docufaker, sheets, browser, inbox, codeweb, codegame, deck, reader,
  photos, reels, sound

Example: https://pretend.pro/uk-en/apperture/codeweb

## Notes

- Source code: https://github.com/Mike-Demo/pretend-pro-suite
- Agent docs: https://pretend.pro/llms.txt and https://pretend.pro/developers
""",
    ),
}

index_skills = []
for sid, (name, desc, body) in skills_md.items():
    path = os.path.join(SKILLS, f"{sid}.md")
    with open(path, "w") as f:
        f.write(body)
    digest = hashlib.sha256(open(path, "rb").read()).hexdigest()
    index_skills.append({
        "id": sid,
        "name": name,
        "description": desc,
        "path": f"/.well-known/agent-skills/skills/{sid}.md",
        "digest": f"sha256:{digest}",
    })
    print(f"wrote skills/{sid}.md sha256:{digest[:12]}")

index = {
    "$schema": "https://agent-skills.org/schemas/index-v0.2.0.json",
    "name": "PretendPro Office Suite agent skills",
    "description": "Real workflows for PretendPro Office Suite: staging fake product screenshots, planning fake demo videos, and touring the parody OS editions. The product is a static parody site with no API.",
    "skills": index_skills,
}
with open(os.path.join(WK, "agent-skills", "index.json"), "w") as f:
    json.dump(index, f, indent=2, ensure_ascii=False)
    f.write("\n")
print("wrote agent-skills/index.json")

# plugin.json (agent-plugins.org v1.0.0)
plugin = {
    "$schema": "https://agent-plugins.org/schemas/plugin-v1.0.0.json",
    "name": "pretendpro-office-suite",
    "version": "1.0.0",
    "description": "PretendPro Office Suite — wholesome parody office suite of fake-content demo tools. Documentation and skills only; no MCP servers (the product is a static site with no API).",
    "homepage": SITE + "/",
    "repository": REPO,
    "skills": [f".well-known/agent-skills/skills/{sid}.md" for sid in skills_md],
    "agentSkillsIndex": SITE + "/.well-known/agent-skills/index.json",
    "agentCard": SITE + "/.well-known/agent-card.json",
    "ard": SITE + "/.well-known/ard.json",
}
with open(os.path.join(ROOT, "public", "plugin.json"), "w") as f:
    json.dump(plugin, f, indent=2, ensure_ascii=False)
    f.write("\n")
print("wrote public/plugin.json")
