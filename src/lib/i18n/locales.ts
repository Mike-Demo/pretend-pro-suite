import type { OsTheme } from "@/components/pretendpro/WindowFrame";

export const localeIds = ["us-en", "ca-en", "uk-en", "au-en", "at-en", "tlh"] as const;

export type LocaleId = (typeof localeIds)[number];

export const defaultLocale: LocaleId = "us-en";

export interface LocaleMeta {
  id: LocaleId;
  /** Emoji flag (or emblem) shown in the picker. */
  flag: string;
  /** Optional SVG/PNG flag image URL used instead of the emoji. */
  flagImg?: string;
  /** Native-ish label shown next to the flag. */
  label: string;
  /** Value for the html lang attribute and hreflang. */
  htmlLang: string;
}

export const locales: readonly LocaleMeta[] = [
  { id: "us-en", flag: "🇺🇸", label: "US English", htmlLang: "en-US" },
  { id: "ca-en", flag: "🇨🇦", label: "Canadian English", htmlLang: "en-CA" },
  { id: "uk-en", flag: "🇬🇧", label: "UK English", htmlLang: "en-GB" },
  { id: "au-en", flag: "🇦🇺", label: "Australian English", htmlLang: "en-AU" },
  { id: "at-en", flag: "🇦🇹", label: "Austrian English", htmlLang: "en-AT" },
  { id: "tlh", flag: "🛡️", label: "tlhIngan Hol (Klingon)", htmlLang: "tlh" },
];

export function isLocaleId(value: unknown): value is LocaleId {
  return typeof value === "string" && (localeIds as readonly string[]).includes(value);
}

export function localeMeta(id: LocaleId): LocaleMeta {
  return locales.find((l) => l.id === id) ?? locales[0]!;
}

export const localeStorageKey = "pretendpro:locale";

/** Best-effort locale detection: saved choice first, then browser languages. */
export function detectLocale(): LocaleId {
  if (typeof window === "undefined") return defaultLocale;
  try {
    const saved = window.localStorage.getItem(localeStorageKey);
    if (isLocaleId(saved)) return saved;
  } catch {
    // storage unavailable (private mode) — fall through to language sniffing
  }
  const tags = window.navigator.languages ?? [window.navigator.language];
  for (const tag of tags) {
    const lower = tag.toLowerCase();
    if (lower === "tlh" || lower.startsWith("tlh-")) return "tlh";
    if (lower.startsWith("en-ca")) return "ca-en";
    if (lower.startsWith("en-gb")) return "uk-en";
    if (lower.startsWith("en-au")) return "au-en";
    if (lower.startsWith("en-at") || lower.startsWith("de-at")) return "at-en";
    if (lower.startsWith("en")) return "us-en";
  }
  return defaultLocale;
}

export function saveLocale(id: LocaleId): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(localeStorageKey, id);
  } catch {
    // ignore: remembering the locale is a nicety, not a requirement
  }
}

export type LocalePagePath =
  | "/$locale/"
  | "/$locale/fruit/"
  | "/$locale/apperture/"
  | "/$locale/bufferium/"
  | "/$locale/android/"
  | "/$locale/fos/"
  | "/$locale/licenses/"
  | "/$locale/privacy/"
  | "/$locale/terms/";

export type LocaleAppPath =
  | "/$locale/fruit/$app/"
  | "/$locale/apperture/$app/"
  | "/$locale/bufferium/$app/"
  | "/$locale/android/$app/"
  | "/$locale/fos/$app/";

export const localeThemeRoutes: Record<OsTheme, LocalePagePath> = {
  fruit: "/$locale/fruit/",
  apperture: "/$locale/apperture/",
  bufferium: "/$locale/bufferium/",
  android: "/$locale/android/",
  fos: "/$locale/fos/",
};

/** Canonical per-work-type route for each edition. */
export const localeThemeAppRoutes: Record<OsTheme, LocaleAppPath> = {
  fruit: "/$locale/fruit/$app/",
  apperture: "/$locale/apperture/$app/",
  bufferium: "/$locale/bufferium/$app/",
  android: "/$locale/android/$app/",
  fos: "/$locale/fos/$app/",
};

/** Absolute URL for a locale + page, used for canonical/hreflang/sitemap. */
export function localeUrl(base: string, locale: LocaleId, page: string): string {
  // Trailing-slash canonicals (see head.ts pageUrl): the static host
  // 308-redirects extensionless paths to their trailing-slash form.
  const suffix = page === "" ? "/" : `/${page}/`;
  return `${base}/${locale}${suffix}`;
}
