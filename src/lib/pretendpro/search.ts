import type { AppId } from "@/components/pretendpro/chrome";

const validApps: readonly AppId[] = ["docufaker", "sheets", "browser", "inbox"];

export function parseAppSearch(search: Record<string, unknown>): { app: AppId } {
  const raw = typeof search["app"] === "string" ? (search["app"] as AppId) : undefined;
  return { app: raw && validApps.includes(raw) ? raw : "docufaker" };
}
