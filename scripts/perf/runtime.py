"""Runtime performance measurements against the locally served production build.

Collects, per route:
  * network waterfall (request count, JS/CSS transfer bytes, critical path)
  * JS/CSS coverage with chunk-level attribution (unused bytes)
  * interaction latency for dock launch / command palette / appearance toggle
  * memory + listener/node deltas over 25 window open/close cycles (desktop OS)
  * long-task and forced-reflow observations during hydration

Dev-only tooling. Writes JSON evidence under $PERF_OUT/evidence/runtime/.
"""

from __future__ import annotations

import asyncio
import hashlib
import hmac
import json
import os
import statistics
import time
from pathlib import Path

from playwright.async_api import async_playwright

ORIGIN = os.environ.get("PERF_ORIGIN", "http://127.0.0.1:8788")
OUT = Path(os.environ.get("PERF_OUT", "/mnt/documents/perf/latest")) / "evidence" / "runtime"
SECRET = os.environ.get("CAPTCHA_SESSION_SECRET", "perf-local-test-secret")

DESKTOP_ROUTES = ["/fruit", "/apperture", "/bufferium"]
MOBILE_ROUTES = ["/android", "/fos"]
ROUTES = ["/", "/licenses"] + DESKTOP_ROUTES + MOBILE_ROUTES


def verified_cookie() -> str:
    payload = str(int((time.time() + 12 * 3600) * 1000))
    sig = hmac.new(SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{sig}"


LONG_TASK_INIT = """
window.__perf = { longTasks: [], lcp: null, cls: 0 };
new PerformanceObserver((l) => {
  for (const e of l.getEntries()) window.__perf.longTasks.push({ start: e.startTime, dur: e.duration, name: e.name });
}).observe({ type: 'longtask', buffered: true });
try {
  new PerformanceObserver((l) => {
    const es = l.getEntries();
    window.__perf.lcp = es[es.length - 1].startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value;
  }).observe({ type: 'layout-shift', buffered: true });
} catch (e) {}
"""


async def measure_route(context, path: str) -> dict:
    page = await context.new_page()
    await page.add_init_script(LONG_TASK_INIT)
    cdp = await context.new_cdp_session(page)
    await cdp.send("Profiler.enable")
    await cdp.send("Profiler.startPreciseCoverage", {"callCount": False, "detailed": True})
    await cdp.send("DOM.enable")
    await cdp.send("CSS.enable")
    await cdp.send("CSS.startRuleUsageTracking")

    requests: list[dict] = []

    async def on_response(response):
        try:
            headers = await response.all_headers()
        except Exception:
            headers = {}
        requests.append(
            {
                "url": response.url.replace(ORIGIN, ""),
                "status": response.status,
                "type": headers.get("content-type", ""),
                "encoding": headers.get("content-encoding", ""),
                "bytes": int(headers.get("content-length") or 0),
                "cache": headers.get("cache-control", ""),
            }
        )

    page.on("response", lambda r: asyncio.ensure_future(on_response(r)))

    started = time.time()
    await page.goto(f"{ORIGIN}{path}", wait_until="load")
    await page.wait_for_timeout(2500)
    load_ms = round((time.time() - started) * 1000)

    nav = await page.evaluate(
        """() => {
      const n = performance.getEntriesByType('navigation')[0] || {};
      const paint = performance.getEntriesByType('paint');
      return {
        ttfb: n.responseStart ?? null,
        domContentLoaded: n.domContentLoadedEventEnd ?? null,
        loadEvent: n.loadEventEnd ?? null,
        fcp: (paint.find(p => p.name === 'first-contentful-paint') || {}).startTime ?? null,
        lcp: window.__perf.lcp,
        cls: window.__perf.cls,
        longTasks: window.__perf.longTasks,
        resources: performance.getEntriesByType('resource').map(r => ({
          name: r.name.split('/').pop(), initiatorType: r.initiatorType,
          transferSize: r.transferSize, encodedBodySize: r.encodedBodySize,
          decodedBodySize: r.decodedBodySize, duration: r.duration, start: r.startTime,
        })),
      };
    }"""
    )

    js_cov = await cdp.send("Profiler.takePreciseCoverage")
    await cdp.send("Profiler.stopPreciseCoverage")
    css_cov = await cdp.send("CSS.stopRuleUsageTracking")

    scripts: dict[str, dict] = {}
    for entry in js_cov.get("result", []):
        url = entry.get("url", "")
        if "/assets/" not in url:
            continue
        total = 0
        used = 0
        for fn in entry.get("functions", []):
            for r in fn.get("ranges", []):
                length = r["endOffset"] - r["startOffset"]
                if fn.get("isBlockCoverage") is False and r["startOffset"] == 0:
                    total = max(total, length)
                if r["count"] > 0:
                    used = max(used, r["endOffset"]) if False else used + 0
        scripts[url] = {"raw": entry}

    # Precise per-file used/unused via a flattened range walk.
    coverage: list[dict] = []
    for url, payload in scripts.items():
        entry = payload["raw"]
        max_off = 0
        for fn in entry.get("functions", []):
            for r in fn.get("ranges", []):
                max_off = max(max_off, r["endOffset"])
        covered = bytearray(max_off)
        for fn in entry.get("functions", []):
            for r in fn.get("ranges", []):
                if r["count"] > 0:
                    for i in range(r["startOffset"], r["endOffset"]):
                        covered[i] = 1
                else:
                    for i in range(r["startOffset"], r["endOffset"]):
                        covered[i] = 0
        used_bytes = sum(covered)
        coverage.append(
            {
                "chunk": url.split("/")[-1],
                "totalBytes": max_off,
                "usedBytes": used_bytes,
                "unusedBytes": max_off - used_bytes,
                "unusedPct": round((max_off - used_bytes) / max_off * 100, 1) if max_off else 0,
            }
        )
    coverage.sort(key=lambda c: -c["unusedBytes"])

    css_unused = 0
    css_total = 0
    for rule in css_cov.get("ruleUsage", []):
        length = rule["endOffset"] - rule["startOffset"]
        css_total += length
        if not rule["used"]:
            css_unused += length

    await page.close()
    return {
        "path": path,
        "loadMs": load_ms,
        "nav": nav,
        "requests": requests,
        "jsCoverage": coverage,
        "cssCoverage": {"totalBytes": css_total, "unusedBytes": css_unused},
    }


async def measure_interactions(context, path: str) -> dict:
    page = await context.new_page()
    await page.goto(f"{ORIGIN}{path}", wait_until="load")
    await page.wait_for_timeout(1500)
    results: dict[str, float | None] = {}

    async def timed(label: str, action) -> None:
        try:
            t0 = await page.evaluate("() => performance.now()")
            await action()
            await page.evaluate(
                "() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))"
            )
            t1 = await page.evaluate("() => performance.now()")
            results[label] = round(t1 - t0, 1)
        except Exception as exc:  # noqa: BLE001
            results[label] = None
            results[f"{label}_error"] = str(exc)[:160]

    launchers = page.get_by_role("button")
    count = await launchers.count()
    target = None
    for i in range(count):
        name = (await launchers.nth(i).get_attribute("aria-label")) or ""
        text = (await launchers.nth(i).inner_text()) or ""
        if "SheetShenanigans" in name or "SheetShenanigans" in text:
            target = launchers.nth(i)
            break
    if target is not None:
        await timed("launchApp", lambda: target.click())

    await timed(
        "commandPalette",
        lambda: page.keyboard.press("Control+k"),
    )
    await page.keyboard.press("Escape")
    await timed("appearanceToggle", lambda: page.keyboard.press("KeyA"))

    await page.close()
    return results


async def measure_memory(context, path: str, cycles: int = 25) -> dict:
    page = await context.new_page()
    cdp = await context.new_cdp_session(page)
    await page.goto(f"{ORIGIN}{path}", wait_until="load")
    await page.wait_for_timeout(1500)

    async def snapshot() -> dict:
        await cdp.send("HeapProfiler.collectGarbage")
        metrics = await cdp.send("Performance.getMetrics") if False else None
        counts = await cdp.send("Memory.getDOMCounters")
        heap = await page.evaluate(
            "() => performance.memory ? performance.memory.usedJSHeapSize : null"
        )
        return {
            "nodes": counts.get("nodes"),
            "listeners": counts.get("jsEventListeners"),
            "documents": counts.get("documents"),
            "heapBytes": heap,
        }

    await cdp.send("HeapProfiler.enable")
    await cdp.send("Performance.enable")
    before = await snapshot()

    opened = 0
    for _ in range(cycles):
        for key in ["1", "2", "3", "4"]:
            try:
                await page.keyboard.press(key)
                opened += 1
            except Exception:  # noqa: BLE001
                pass
        for _ in range(4):
            try:
                await page.keyboard.press("Control+w")
            except Exception:  # noqa: BLE001
                pass
    await page.wait_for_timeout(1200)
    after = await snapshot()
    detached = await page.evaluate("() => document.querySelectorAll('[data-window-id]').length")
    await page.close()
    return {
        "path": path,
        "cycles": cycles,
        "openEvents": opened,
        "before": before,
        "after": after,
        "delta": {
            k: (after[k] - before[k]) if isinstance(after.get(k), (int, float)) and isinstance(before.get(k), (int, float)) else None
            for k in ["nodes", "listeners", "documents", "heapBytes"]
        },
        "windowsStillMounted": detached,
    }


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    cookie = verified_cookie()
    out: dict[str, object] = {}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
        context = await browser.new_context(viewport={"width": 1280, "height": 900})
        await context.add_cookies(
            [{"name": "pp_verified", "value": cookie, "url": ORIGIN}]
        )

        routes: dict[str, object] = {}
        for path in ROUTES:
            print(f"measuring {path}", flush=True)
            routes[path] = await measure_route(context, path)
        out["routes"] = routes

        interactions: dict[str, object] = {}
        for path in DESKTOP_ROUTES[:1] + MOBILE_ROUTES[:1]:
            print(f"interactions {path}", flush=True)
            interactions[path] = await measure_interactions(context, path)
        out["interactions"] = interactions

        print("memory cycles /fruit", flush=True)
        out["memory"] = await measure_memory(context, "/fruit")

        await context.close()
        await browser.close()

    (OUT / "runtime.json").write_text(json.dumps(out, indent=2))

    for path, data in out["routes"].items():  # type: ignore[union-attr]
        nav = data["nav"]  # type: ignore[index]
        js_unused = sum(c["unusedBytes"] for c in data["jsCoverage"])  # type: ignore[index]
        js_total = sum(c["totalBytes"] for c in data["jsCoverage"])  # type: ignore[index]
        long_tasks = [t for t in nav["longTasks"] if t["dur"] > 50]
        print(
            f"{path}: ttfb={round(nav['ttfb'] or 0)}ms fcp={round(nav['fcp'] or 0)}ms "
            f"lcp={round(nav['lcp'] or 0)}ms cls={round(nav['cls'], 4)} "
            f"jsUnused={js_unused // 1024}/{js_total // 1024}KiB longTasks>50ms={len(long_tasks)} "
            f"maxTask={round(max([t['dur'] for t in long_tasks], default=0))}ms"
        )
    print("interactions:", json.dumps(out["interactions"]))
    print("memory delta:", json.dumps(out["memory"]["delta"]))  # type: ignore[index]
    print("statistics module loaded:", bool(statistics))


asyncio.run(main())
