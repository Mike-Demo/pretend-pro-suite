/**
 * Runs Lighthouse RUNS_PER_ROUTE times per route per form factor against the
 * locally served production build and writes median metrics + raw reports.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { ORIGIN, ROUTES, RUNS_PER_ROUTE, median } from "./routes.mjs";
import { mintVerifiedCookie, COOKIE_NAME } from "./cookie.mjs";

void spawn; // keep node:child_process import meaningful only if needed later

const OUT_DIR = process.env["PERF_OUT"] ?? "/mnt/documents/perf/latest";
const CHROME_PATH =
  process.env["CHROME_PATH"] ??
  "/opt/ms-playwright/chromium-1194/chrome-linux/chrome";

const FORM_FACTORS = {
  mobile: {
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 562.5,
      downloadThroughputKbps: 1474.56,
      uploadThroughputKbps: 675,
    },
  },
  desktop: {
    formFactor: "desktop",
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
  },
};

const METRICS = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
  "speed-index",
  "interactive",
  "server-response-time",
];

async function runOne(url, formFactor, cookie) {
  const chrome = await chromeLauncher.launch({
    chromePath: CHROME_PATH,
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const result = await lighthouse(
      url,
      { port: chrome.port, output: "json", logLevel: "error" },
      {
        extends: "lighthouse:default",
        settings: {
          onlyCategories: ["performance"],
          extraHeaders: { Cookie: `${COOKIE_NAME}=${cookie}` },
          ...FORM_FACTORS[formFactor],
        },
      },
    );
    return result;
  } finally {
    await chrome.kill();
  }
}

async function main() {
  const cookie = mintVerifiedCookie();
  await mkdir(join(OUT_DIR, "evidence", "lighthouse"), { recursive: true });
  const out = {};

  for (const route of ROUTES) {
    out[route.name] = {};
    for (const formFactor of Object.keys(FORM_FACTORS)) {
      const runs = [];
      let lastLhr = null;
      for (let i = 0; i < RUNS_PER_ROUTE; i += 1) {
        const res = await runOne(`${ORIGIN}${route.path}`, formFactor, cookie);
        if (!res) continue;
        lastLhr = res.lhr;
        const audits = res.lhr.audits;
        const entry = { score: Math.round((res.lhr.categories.performance.score ?? 0) * 100) };
        for (const m of METRICS) entry[m] = audits[m]?.numericValue ?? null;
        entry.unusedJsBytes = audits["unused-javascript"]?.details?.overallSavingsBytes ?? 0;
        entry.renderBlockingMs = audits["render-blocking-resources"]?.metricSavings?.FCP ?? 0;
        entry.totalByteWeight = audits["total-byte-weight"]?.numericValue ?? null;
        runs.push(entry);
        console.log(
          `${route.path} ${formFactor} run${i + 1}: score=${entry.score} LCP=${Math.round(entry["largest-contentful-paint"])}ms`,
        );
      }
      const summary = { runs: runs.length };
      for (const key of ["score", ...METRICS, "unusedJsBytes", "renderBlockingMs", "totalByteWeight"]) {
        summary[key] = median(runs.map((r) => r[key]).filter((v) => typeof v === "number"));
      }
      out[route.name][formFactor] = summary;
      if (lastLhr) {
        await writeFile(
          join(OUT_DIR, "evidence", "lighthouse", `${route.name}-${formFactor}.json`),
          JSON.stringify(lastLhr),
        );
      }
    }
  }

  await writeFile(
    join(OUT_DIR, "evidence", "lighthouse", "medians.json"),
    JSON.stringify(out, null, 2),
  );
  console.log("lighthouse done");
}

await main();
