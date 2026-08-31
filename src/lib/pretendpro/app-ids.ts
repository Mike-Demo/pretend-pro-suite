import type { AppId } from "@/components/pretendpro/chrome";

/**
 * URL slugs for the work types, kept separate from the app registry so route
 * files can validate a path param without pulling app chrome into their chunk.
 * The record is typed by AppId, so a new app fails to compile until it is added.
 */
const slugs: Record<AppId, true> = {
  docufaker: true,
  sheets: true,
  browser: true,
  inbox: true,
  codeweb: true,
  codegame: true,
  deck: true,
  reader: true,
  photos: true,
  reels: true,
  sound: true,
};

export const appIds = Object.keys(slugs) as AppId[];

export const defaultAppId: AppId = "docufaker";

export function isAppId(value: unknown): value is AppId {
  return typeof value === "string" && (appIds as string[]).includes(value);
}
