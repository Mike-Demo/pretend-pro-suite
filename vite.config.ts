// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  plugins: [
    // Precompress production assets; the edge serves the best encoding the
    // client accepts (br > gzip > identity). apply: "build" keeps dev untouched.
    compression({
      algorithms: ["brotliCompress", "gzip"],
      // Only precompress hashed build assets; public/ files are merged by
      // Nitro after this hook and would not exist yet.
      include: /assets\/.+\.(js|css|svg)$/,
      threshold: 1024,
      deleteOriginalAssets: false,
    }),
  ],
});
