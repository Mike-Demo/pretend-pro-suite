// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { constants as zlibConstants, brotliCompress, gzip } from "node:zlib";
import { promisify } from "node:util";
import { readdir, readFile, writeFile, access } from "node:fs/promises";
import { join } from "node:path";
import type { Plugin } from "vite";

const brotli = promisify(brotliCompress);
const gz = promisify(gzip);

// Precompress hashed build assets with Brotli + gzip after the client build
// writes them. Static hosts/edges that support precompressed files serve the
// best encoding the client accepts (br > gzip > identity); others fall back
// to the untouched originals. Build-only, dev is unaffected.
function precompressAssets(): Plugin {
  return {
    name: "pretendpro-precompress-assets",
    apply: "build",
    enforce: "post",
    async closeBundle() {
      const assetsDir = join(process.cwd(), "dist", "client", "assets");
      try {
        await access(assetsDir);
      } catch {
        return; // non-client environment build — nothing to do
      }
      const targets = (await readdir(assetsDir)).filter(
        (name) => /\.(js|css|svg)$/.test(name) && !name.endsWith(".map"),
      );
      await Promise.all(
        targets.map(async (name) => {
          const filePath = join(assetsDir, name);
          const source = await readFile(filePath);
          if (source.byteLength < 1024) return;
          const [br, gzipped] = await Promise.all([
            brotli(source, {
              params: {
                [zlibConstants.BROTLI_PARAM_QUALITY]:
                  zlibConstants.BROTLI_MAX_QUALITY,
              },
            }),
            gz(source, { level: zlibConstants.Z_BEST_COMPRESSION }),
          ]);
          // Keep precompressed variants only when they actually win.
          const writes: Promise<void>[] = [];
          if (br.byteLength < source.byteLength) {
            writes.push(writeFile(`${filePath}.br`, br));
          }
          if (gzipped.byteLength < source.byteLength) {
            writes.push(writeFile(`${filePath}.gz`, gzipped));
          }
          await Promise.all(writes);
        }),
      );
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  plugins: [precompressAssets()],
});
