import { z } from "zod";

import type { OpenverseAsset, OpenverseSearchResult } from "./types";

/**
 * Browser-side Openverse lookup. The static site has no server to proxy
 * through, so requests go straight to the public (anonymous) API. Every
 * failure resolves to an empty set — each surface has placeholder art.
 */
const API_BASE = "https://api.openverse.org/v1";
const CACHE_TTL_MS = 10 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

interface CacheEntry {
  value: OpenverseSearchResult;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function readCache(key: string): OpenverseSearchResult | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function writeCache(key: string, value: OpenverseSearchResult): void {
  if (cache.size > 200) cache.clear();
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

interface RawResult {
  id?: string;
  url?: string;
  thumbnail?: string;
  title?: string;
  creator?: string;
  creator_url?: string;
  license?: string;
  license_version?: string;
  license_url?: string;
  foreign_landing_url?: string;
  duration?: number;
}

function toAsset(raw: RawResult, kind: "image" | "audio"): OpenverseAsset | null {
  if (!raw.id || !raw.url) return null;
  return {
    id: raw.id,
    kind,
    url: raw.url,
    thumbnail: raw.thumbnail ?? null,
    title: raw.title?.trim() || "Untitled",
    creator: raw.creator?.trim() || "Unknown creator",
    creatorUrl: raw.creator_url ?? null,
    license: raw.license ? `${raw.license.toUpperCase()} ${raw.license_version ?? ""}`.trim() : "CC",
    licenseUrl: raw.license_url ?? null,
    foreignLandingUrl: raw.foreign_landing_url ?? null,
    durationMs: typeof raw.duration === "number" ? raw.duration : null,
  };
}

async function search(
  kind: "image" | "audio",
  query: string,
  pageSize: number,
): Promise<OpenverseSearchResult> {
  const key = `${kind}:${query}:${pageSize}`;
  const hit = readCache(key);
  if (hit) return hit;

  const endpoint = kind === "image" ? "images" : "audio";
  const url = `${API_BASE}/${endpoint}/?q=${encodeURIComponent(query)}&page_size=${pageSize}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`Openverse ${res.status}`);
    const data = (await res.json()) as { results?: RawResult[] };
    const assets = (data.results ?? [])
      .map((r) => toAsset(r, kind))
      .filter((a): a is OpenverseAsset => a !== null);
    const result: OpenverseSearchResult = { assets, anonymous: true };
    writeCache(key, result);
    return result;
  } catch {
    return { assets: [], anonymous: true };
  }
}

export const searchInput = z.object({
  query: z.string().trim().min(1).max(120),
  pageSize: z.number().int().min(1).max(20).default(8),
});

export function searchOpenverseImages(query: string, pageSize: number) {
  const input = searchInput.parse({ query, pageSize });
  return search("image", input.query, input.pageSize);
}

export function searchOpenverseAudio(query: string, pageSize: number) {
  const input = searchInput.parse({ query, pageSize });
  return search("audio", input.query, input.pageSize);
}
