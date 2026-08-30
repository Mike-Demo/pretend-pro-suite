import type { OsTheme } from "@/components/pretendpro/WindowFrame";
import { breadcrumbJsonLd, homeOgImage, siteUrl, webPageJsonLd } from "@/lib/seo";
import { locales, localeMeta, type LocaleId } from "./locales";
import { stringsFor } from "./strings";

/** Page slug within a locale folder: "" is the onboarding page. */
export type PageSlug = "" | "fruit" | "apperture" | "bufferium" | "android" | "fos" | "licenses" | "privacy";

function pageUrl(locale: LocaleId, page: PageSlug): string {
  return `${siteUrl}/${locale}${page ? `/${page}` : ""}`;
}

/** hreflang alternates for every locale, plus the unprefixed x-default page. */
export function alternateLinks(page: PageSlug) {
  const defaultHref = `${siteUrl}/${page}`;
  return [
    ...locales.map((l) => ({
      rel: "alternate" as const,
      hrefLang: l.htmlLang,
      href: pageUrl(l.id, page),
    })),
    { rel: "alternate" as const, hrefLang: "x-default", href: defaultHref },
  ];
}

function socialMeta(title: string, description: string, url: string, image: string) {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}

export function localeHomeHead(locale: LocaleId) {
  const t = stringsFor(locale);
  const url = pageUrl(locale, "");
  const title = `${t.meta.homeTitle} · ${localeMeta(locale).label}`;
  return {
    meta: socialMeta(title, t.meta.homeDescription, url, homeOgImage),
    links: [{ rel: "canonical", href: url }, ...alternateLinks("")],
    scripts: [
      {
        type: "application/ld+json",
        children: webPageJsonLd({
          name: title,
          url,
          description: t.meta.homeDescription,
          inLanguage: localeMeta(locale).htmlLang,
        }),
      },
    ],
  };
}

export function localeLicensesHead(locale: LocaleId) {
  const t = stringsFor(locale);
  const url = pageUrl(locale, "licenses");
  return {
    meta: socialMeta(t.meta.licensesTitle, t.meta.licensesDescription, url, homeOgImage),
    links: [{ rel: "canonical", href: url }, ...alternateLinks("licenses")],
    scripts: [
      {
        type: "application/ld+json",
        children: webPageJsonLd({
          name: t.meta.licensesTitle,
          url,
          description: t.meta.licensesDescription,
          inLanguage: localeMeta(locale).htmlLang,
        }),
      },
    ],
  };
}

const editionSlug: Record<OsTheme, PageSlug> = {
  fruit: "fruit",
  apperture: "apperture",
  bufferium: "bufferium",
  android: "android",
  fos: "fos",
};

export function localeEditionHead(locale: LocaleId, theme: OsTheme) {
  const t = stringsFor(locale);
  const slug = editionSlug[theme];
  const url = pageUrl(locale, slug);
  const title = `${t.meta.editionTitle[theme]} · ${localeMeta(locale).label}`;
  const description = t.meta.editionDescription[theme];
  const image = `${siteUrl}/og/${slug}.png`;
  return {
    meta: socialMeta(title, description, url, image),
    links: [{ rel: "canonical", href: url }, ...alternateLinks(slug)],
    scripts: [
      {
        type: "application/ld+json",
        children: webPageJsonLd({
          name: title,
          url,
          description,
          inLanguage: localeMeta(locale).htmlLang,
        }),
      },
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd(t.meta.editionTitle[theme], url),
      },
    ],
  };
}
