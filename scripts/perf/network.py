"""Cold- vs warm-cache network measurement per route.

Each route gets a brand-new browser context (empty HTTP cache) so transfer
sizes are real first-visit numbers, then a reload in the same context to prove
the immutable-caching headers in public/_headers work.
"""

from __future__ import annotations

import asyncio
import hashlib
import hmac
import json
import os
import time
from pathlib import Path

from playwright.async_api import async_playwright

ORIGIN = os.environ.get("PERF_ORIGIN", "http://127.0.0.1:8788")
OUT = Path(os.environ.get("PERF_OUT", "/mnt/documents/perf/latest")) / "evidence" / "network"
SECRET = os.environ.get("CAPTCHA_SESSION_SECRET", "perf-local-test-secret")
ROUTES = ["/", "/licenses", "/fruit", "/apperture", "/bufferium", "/android", "/fos"]


def verified_cookie() -> str:
    payload = str(int((time.time() + 12 * 3600) * 1000))
    return f"{payload}.{hmac.new(SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()}"


async def collect(page) -> dict:
    return await page.evaluate(
        """() => {
      const rs = performance.getEntriesByType('resource');
      const bucket = (n) => n.endsWith('.js') ? 'js' : n.endsWith('.css') ? 'css'
        : /\\.(webp|svg|png|ico)$/.test(n) ? 'image' : 'other';
      const out = { requests: rs.length, transferBytes: 0, byType: {}, fromCache: 0, items: [] };
      for (const r of rs) {
        const name = r.name.split('/').pop();
        const b = bucket(name);
        out.transferBytes += r.transferSize;
        out.byType[b] = (out.byType[b] || 0) + r.transferSize;
        if (r.transferSize === 0 && r.decodedBodySize > 0) out.fromCache += 1;
        out.items.push({ name, type: b, transferSize: r.transferSize, decodedBodySize: r.decodedBodySize });
      }
      const n = performance.getEntriesByType('navigation')[0] || {};
      out.documentTransferBytes = n.transferSize ?? null;
      out.ttfb = n.responseStart ?? null;
      return out;
    }"""
    )


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    cookie = verified_cookie()
    results: dict[str, dict] = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
        for path in ROUTES:
            context = await browser.new_context(viewport={"width": 1280, "height": 900})
            await context.add_cookies([{"name": "pp_verified", "value": cookie, "url": ORIGIN}])
            page = await context.new_page()
            await page.goto(f"{ORIGIN}{path}", wait_until="load")
            await page.wait_for_timeout(2000)
            cold = await collect(page)
            await page.reload(wait_until="load")
            await page.wait_for_timeout(1500)
            warm = await collect(page)
            results[path] = {"cold": cold, "warm": warm}
            print(
                f"{path}: cold {cold['requests']} reqs {round(cold['transferBytes']/1024,1)} KiB "
                f"(js {round(cold['byType'].get('js',0)/1024,1)} css {round(cold['byType'].get('css',0)/1024,1)} "
                f"img {round(cold['byType'].get('image',0)/1024,1)}) | warm "
                f"{round(warm['transferBytes']/1024,1)} KiB, cached {warm['fromCache']}/{warm['requests']}",
                flush=True,
            )
            await context.close()
        await browser.close()
    (OUT / "network.json").write_text(json.dumps(results, indent=2))


asyncio.run(main())
