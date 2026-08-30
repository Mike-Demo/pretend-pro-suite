/**
 * Source attribution for chunk bytes using the sourcemap build.
 * Requires a `vite build --sourcemap` output in dist/client/assets.
 * Reports, per chunk, the byte contribution of each source module/package.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = process.env["PERF_OUT"] ?? "/mnt/documents/perf/latest";
const ASSETS = join(process.cwd(), "dist", "client", "assets");

function packageOf(source) {
  const m = source.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
  if (m) return m[1];
  const local = source.replace(/^.*?(src\/)/, "src/");
  return local.startsWith("src/") ? local : source;
}

async function attribute(mapName) {
  const map = JSON.parse(await readFile(join(ASSETS, mapName), "utf8"));
  const sources = map.sources ?? [];
  const bytesBySource = new Array(sources.length).fill(0);

  // Walk the mappings and charge each generated segment's length to its source.
  const lines = (map.mappings ?? "").split(";");
  const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let sourceIndex = 0;
  for (const line of lines) {
    if (!line) continue;
    let genCol = 0;
    let prevGenCol = 0;
    let prevSource = -1;
    for (const seg of line.split(",")) {
      let pos = 0;
      const values = [];
      while (pos < seg.length) {
        let result = 0;
        let shift = 0;
        let cont = true;
        while (cont) {
          const digit = B64.indexOf(seg[pos++]);
          cont = Boolean(digit & 32);
          result += (digit & 31) * 2 ** shift;
          shift += 5;
        }
        const negate = result & 1;
        result >>= 1;
        values.push(negate ? -result : result);
      }
      genCol += values[0] ?? 0;
      if (values.length >= 4) sourceIndex += values[1] ?? 0;
      if (prevSource >= 0) bytesBySource[prevSource] += Math.max(0, genCol - prevGenCol);
      prevGenCol = genCol;
      prevSource = values.length >= 4 ? sourceIndex : prevSource;
    }
  }

  const byPackage = new Map();
  sources.forEach((source, i) => {
    const key = packageOf(source);
    byPackage.set(key, (byPackage.get(key) ?? 0) + bytesBySource[i]);
  });

  return [...byPackage.entries()]
    .map(([name, bytes]) => ({ name, bytes }))
    .filter((e) => e.bytes > 512)
    .sort((a, b) => b.bytes - a.bytes);
}

async function main() {
  const maps = (await readdir(ASSETS)).filter((n) => n.endsWith(".js.map"));
  const report = {};
  for (const mapName of maps) {
    report[mapName.replace(/\.map$/, "")] = await attribute(mapName);
  }
  await mkdir(join(OUT_DIR, "evidence", "bundle"), { recursive: true });
  await writeFile(
    join(OUT_DIR, "evidence", "bundle", "attribution.json"),
    JSON.stringify(report, null, 2),
  );

  const entry = Object.keys(report).find((n) => n.startsWith("index-"));
  console.log(`entry chunk: ${entry}`);
  for (const item of (report[entry] ?? []).slice(0, 18)) {
    console.log(`  ${Math.round(item.bytes / 1024)} KiB  ${item.name}`);
  }
  const big = Object.entries(report)
    .map(([chunk, items]) => ({ chunk, bytes: items.reduce((a, i) => a + i.bytes, 0) }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 10);
  console.log("largest chunks by attributed bytes:");
  for (const c of big) console.log(`  ${Math.round(c.bytes / 1024)} KiB  ${c.chunk}`);
}

await main();
