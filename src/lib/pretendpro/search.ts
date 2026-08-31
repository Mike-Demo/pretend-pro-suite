import type { AppId } from "@/components/pretendpro/chrome";
import { defaultAppId, isAppId } from "./app-ids";

export function parseAppSearch(search: Record<string, unknown>): { app: AppId } {
  const raw = search["app"];
  return { app: isAppId(raw) ? raw : defaultAppId };
}

/**
 * Legacy `?app=` links: the work type now lives in the path, so the param is
 * optional and only used to redirect to the canonical URL.
 */
export function parseLegacyAppSearch(search: Record<string, unknown>): { app?: AppId } {
  const raw = search["app"];
  return isAppId(raw) ? { app: raw } : {};
}
