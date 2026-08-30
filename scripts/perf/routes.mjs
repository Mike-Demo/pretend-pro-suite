/**
 * Shared configuration for the performance audit harness.
 * Dev-only tooling: never imported by application code.
 */

export const ORIGIN = process.env["PERF_ORIGIN"] ?? "http://127.0.0.1:8788";

export const ROUTES = [
  { path: "/", name: "home", protected: false },
  { path: "/licenses", name: "licenses", protected: false },
  { path: "/fruit", name: "fruit", protected: true },
  { path: "/apperture", name: "apperture", protected: true },
  { path: "/bufferium", name: "bufferium", protected: true },
  { path: "/android", name: "android", protected: true },
  { path: "/fos", name: "fos", protected: true },
];

/** Performance budgets the report grades every route against. */
export const BUDGETS = {
  entryChunkBrotliKiB: 75,
  renderBlockingCssBrotliKiB: 5,
  lcpMobileMs: 2000,
  inpMs: 200,
  cls: 0.01,
  routeJsTransferredKiB: 150,
};

export const RUNS_PER_ROUTE = 3;

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}
