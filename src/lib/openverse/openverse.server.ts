import type { OpenverseAsset, OpenverseSearchResult } from "./types";

const API_BASE = "https://api.openverse.org/v1";
const CACHE_TTL_MS = 10 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

interface CacheEntry {
  value: OpenverseSearchResult;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
let cachedToken: { token: string; expiresAt: number } | null = null;

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

/** OAuth client-credentials token, only when secrets are configured. */
async function getAccessToken(): Promise<string | null> {
  const clientId = process.env["OPENVERSE_CLIENT_ID"];
  const clientSecret = process.env["OPENVERSE_CLIENT_SECRET"];
  if (!clientId || !clientSecret) return null;
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }
  try {
    const res = await fetch(`${API_BASE}/auth_tokens/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) return null;
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
    };
    return data.access_token;
  } catch {
    return null;
  }
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

  const token = await getAccessToken();
  const endpoint = kind === "image" ? "images" : "audio";
  const url = `${API_BASE}/${endpoint}/?q=${encodeURIComponent(query)}&page_size=${pageSize}`;

  const headers: Record<string, string> = {
    "User-Agent": "PretendPro3000/1.0 (parody productivity suite)",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`Openverse ${res.status}`);
    const data = (await res.json()) as { results?: RawResult[] };
    const assets = (data.results ?? [])
      .map((r) => toAsset(r, kind))
      .filter((a): a is OpenverseAsset => a !== null);
    const result: OpenverseSearchResult = { assets, anonymous: token === null };
    writeCache(key, result);
    return result;
  } catch {
    // Slow / rate-limited / offline: return an empty set; every surface has a
    // built-in placeholder so the apps still look right.
    return { assets: [], anonymous: token === null };
  }
}

export function searchImages(query: string, pageSize: number): Promise<OpenverseSearchResult> {
  return search("image", query, pageSize);
}

export function searchAudio(query: string, pageSize: number): Promise<OpenverseSearchResult> {
  return search("audio", query, pageSize);
}
