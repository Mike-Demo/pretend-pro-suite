/**
 * Bundle composition analysis for the client build: Brotli/raw sizes per chunk
 * and duplicate-dependency detection.
 */
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = process.env["PERF_OUT"] ?? "/mnt/documents/perf/latest";
const ASSETS = join(process.cwd(), "dist", "client", "assets");

async function sizeOf(path) {
  try {
    return (await stat(path)).size;
  } catch {
    return null;
  }
}

async function main() {
  const names = (await readdir(ASSETS)).filter(
    (n) => !n.endsWith(".br") && !n.endsWith(".gz") && !n.endsWith(".map"),
  );

  const chunks = [];
  for (const name of names) {
    const path = join(ASSETS, name);
    const raw = await sizeOf(path);
    chunks.push({
      name,
      kind: name.endsWith(".css") ? "css" : name.endsWith(".js") ? "js" : "other",
      rawBytes: raw,
      brotliBytes: await sizeOf(`${path}.br`),
      gzipBytes: await sizeOf(`${path}.gz`),
    });
  }
  chunks.sort((a, b) => (b.brotliBytes ?? b.rawBytes ?? 0) - (a.brotliBytes ?? a.rawBytes ?? 0));

  // Duplicate dependency detection: same package copied into multiple chunks.
  const packageHits = new Map();
  for (const name of names.filter((n) => n.endsWith(".js"))) {
    const source = await readFile(join(ASSETS, name), "utf8");
    for (const match of source.matchAll(/node_modules\/((?:@[^/"'\s]+\/)?[^/"'\s]+)/g)) {
      const pkg = match[1];
      if (!packageHits.has(pkg)) packageHits.set(pkg, new Set());
      packageHits.get(pkg).add(name);
    }
  }
  const duplicates = [...packageHits.entries()]
    .filter(([, set]) => set.size > 1)
    .map(([pkg, set]) => ({ package: pkg, chunks: [...set] }));

  const totals = {
    jsRawBytes: chunks.filter((c) => c.kind === "js").reduce((a, c) => a + (c.rawBytes ?? 0), 0),
    jsBrotliBytes: chunks.filter((c) => c.kind === "js").reduce((a, c) => a + (c.brotliBytes ?? 0), 0),
    cssRawBytes: chunks.filter((c) => c.kind === "css").reduce((a, c) => a + (c.rawBytes ?? 0), 0),
    cssBrotliBytes: chunks.filter((c) => c.kind === "css").reduce((a, c) => a + (c.brotliBytes ?? 0), 0),
    chunkCount: chunks.length,
  };

  await mkdir(join(OUT_DIR, "evidence", "bundle"), { recursive: true });
  await writeFile(
    join(OUT_DIR, "evidence", "bundle", "chunks.json"),
    JSON.stringify({ totals, chunks, duplicates }, null, 2),
  );
  console.log(JSON.stringify(totals, null, 2));
  console.log("top chunks (brotli):");
  for (const c of chunks.slice(0, 12)) {
    console.log(`  ${c.name} ${Math.round((c.brotliBytes ?? 0) / 1024)} KiB br / ${Math.round((c.rawBytes ?? 0) / 1024)} KiB raw`);
  }
  console.log(`duplicate packages across chunks: ${duplicates.length}`);
}

await main();
