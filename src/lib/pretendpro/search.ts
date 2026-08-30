import { apps, type AppId } from "@/components/pretendpro/chrome";

export function parseAppSearch(search: Record<string, unknown>): { app: AppId } {
  const raw = typeof search["app"] === "string" ? (search["app"] as AppId) : undefined;
  return { app: raw && apps.some((a) => a.id === raw) ? raw : "docufaker" };
}
