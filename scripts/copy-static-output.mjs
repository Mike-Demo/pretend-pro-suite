// Copies the prerendered static site into dist/client, where static hosts
// (Spacefast) expect it. Idempotent: safe to run repeatedly, and a no-op when
// the build already wrote its output to dist/client.
import { cp, rm, mkdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = process.cwd();
const source = resolve(root, ".output", "public");
const target = resolve(root, "dist", "client");

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

if (source === target) {
  console.log("[static] source and target are the same path — nothing to do");
  process.exit(0);
}

if (!(await exists(source))) {
  if (await exists(join(target, "index.html"))) {
    console.log("[static] no .output/public; dist/client already holds the site — skipping");
    process.exit(0);
  }
  console.error(`[static] expected prerendered output at ${source} but it does not exist`);
  process.exit(1);
}

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });
console.log(`[static] copied ${source} -> ${target}`);
