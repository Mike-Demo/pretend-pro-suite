export const captchaCookieName = "pp_verified";

/** Session lifetime for a passed human check, in seconds. */
export const captchaSessionMaxAge = 60 * 60 * 12;

/** Client-side hint so in-app navigation avoids an extra round trip. */
export const captchaClientFlag = "pretendpro:verified";

/** Paths that never require the human check. */
const openPaths = ["/verify", "/licenses", "/robots.txt", "/sitemap.xml", "/manifest.webmanifest"];

export function isOpenPath(pathname: string): boolean {
  if (openPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;
  // static assets (icons, images, etc.) are served directly
  return /\.[a-z0-9]+$/i.test(pathname);
}

/**
 * Accept only internal, same-origin paths so the gate can never be used as an
 * open redirect.
 */
export function safeRedirect(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//")) return "/";
  if (value.includes("\\") || /[\r\n]/.test(value)) return "/";
  return value;
}
