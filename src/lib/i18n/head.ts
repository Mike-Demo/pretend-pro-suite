import type { OsTheme } from "@/components/pretendpro/WindowFrame";
import type { AppId } from "@/components/pretendpro/chrome";
import {
  breadcrumbJsonLd,
  breadcrumbTrailJsonLd,
  socialOgImage,
  socialOgImageAlt,
  socialOgImageHeight,
  socialOgImageWidth,
  siteUrl,
  webApplicationJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { locales, localeMeta, type LocaleId } from "./locales";
import { stringsFor } from "./strings";

export type EditionSlug = "fruit" | "apperture" | "bufferium" | "android" | "fos";

/** Page slug within a locale folder: "" is the onboarding page. */
export type PageSlug =
  | ""
  | EditionSlug
  | `${EditionSlug}/${AppId}`
  | "licenses"
  | "privacy"
  | "terms"
  | "about"
  | "contact"
  | "developers";

function pageUrl(locale: LocaleId, page: PageSlug): string {
  // Trailing-slash canonicals: the static host 308-redirects extensionless
  // paths (e.g. /us-en/licenses -> /us-en/licenses/), so the canonical URL
  // must be the final, post-redirect form.
  return `${siteUrl}/${locale}${page ? `/${page}` : ""}/`;
}

/** hreflang alternates for every locale, plus the unprefixed x-default page. */
export function alternateLinks(page: PageSlug) {
  const defaultHref = page ? `${siteUrl}/${page}/` : `${siteUrl}/`;
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
    { property: "og:image:width", content: String(socialOgImageWidth) },
    { property: "og:image:height", content: String(socialOgImageHeight) },
    { property: "og:image:alt", content: socialOgImageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: socialOgImageAlt },
  ];
}

export function localeHomeHead(locale: LocaleId) {
  const t = stringsFor(locale);
  const url = pageUrl(locale, "");
  const label = localeMeta(locale).label;
  const title = `${t.meta.homeTitle} · ${label}`;
  // Locale label keeps the description unique across the six locale routes.
  const description = `${t.meta.homeDescription} (${label})`;
  return {
    meta: socialMeta(title, description, url, socialOgImage),
    links: [{ rel: "canonical", href: url }, ...alternateLinks("")],
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
        children: webApplicationJsonLd(),
      },
    ],
  };
}

export function localeLicensesHead(locale: LocaleId) {
  const t = stringsFor(locale);
  const url = pageUrl(locale, "licenses");
  // Locale label keeps title/description unique across the six locale routes.
  const label = localeMeta(locale).label;
  const title = `${t.meta.licensesTitle} · ${label}`;
  const description = `${t.meta.licensesDescription} (${label})`;
  return {
    meta: socialMeta(title, description, url, socialOgImage),
    links: [{ rel: "canonical", href: url }, ...alternateLinks("licenses")],
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
    ],
  };
}

const editionSlug: Record<OsTheme, EditionSlug> = {
  fruit: "fruit",
  apperture: "apperture",
  bufferium: "bufferium",
  android: "android",
  fos: "fos",
};

/**
 * Edition metadata. With an app, the page is the edition + work type combination
 * and gets its own title, description, canonical URL and breadcrumb crumb.
 */
export function localeEditionHead(locale: LocaleId, theme: OsTheme, app?: AppId) {
  const t = stringsFor(locale);
  const edition = editionSlug[theme];
  const slug: PageSlug = app ? `${edition}/${app}` : edition;
  const url = pageUrl(locale, slug);
  const editionTitle = t.meta.editionTitle[theme];
  const editionUrl = pageUrl(locale, edition);
  const work = app ? t.onboarding.work[app] : null;
  const label = localeMeta(locale).label;
  const title = work
    ? `${work.title} · ${editionTitle} · ${label}`
    : `${editionTitle} · ${label}`;
  // Locale label keeps the description unique across the six locale routes.
  const description = work
    ? `${work.description} ${t.meta.editionDescription[theme]} (${label})`
    : `${t.meta.editionDescription[theme]} (${label})`;
  return {
    meta: socialMeta(title, description, url, socialOgImage),
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
        children: webApplicationJsonLd(),
      },
      {
        type: "application/ld+json",
        children: work
          ? breadcrumbTrailJsonLd([
              { name: editionTitle, url: editionUrl },
              { name: work.title, url },
            ])
          : breadcrumbJsonLd(editionTitle, url),
      },
    ],
  };
}

export function localePrivacyHead(locale: LocaleId) {
  const t = stringsFor(locale);
  const url = pageUrl(locale, "privacy");
  // Locale label keeps title/description unique across the six locale routes.
  const label = localeMeta(locale).label;
  const title = `${t.meta.privacyTitle} · ${label}`;
  const description = `${t.meta.privacyDescription} (${label})`;
  return {
    meta: socialMeta(title, description, url, socialOgImage),
    links: [{ rel: "canonical", href: url }, ...alternateLinks("privacy")],
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
        children: breadcrumbJsonLd(title, url),
      },
    ],
  };
}

/** Terms of service metadata. Legal copy is not translated. */
export function localeTermsHead(locale: LocaleId) {
  const url = pageUrl(locale, "terms");
  // Locale label keeps titles/descriptions unique across the six locale routes
  // (legal copy itself is not translated).
  const label = localeMeta(locale).label;
  const title = `Terms of Service — PretendPro Office Suite · ${label}`;
  const description = `Read the PretendPro Office Suite terms of service (${label}), powered by Termageddon and kept current automatically.`;
  return {
    meta: socialMeta(title, description, url, socialOgImage),
    links: [{ rel: "canonical", href: url }, ...alternateLinks("terms")],
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
        children: breadcrumbJsonLd(title, url),
      },
    ],
  };
}

/** About page metadata. Copy is not translated. */
export function localeAboutHead(locale: LocaleId) {
  const url = pageUrl(locale, "about");
  const label = localeMeta(locale).label;
  const title = `About — PretendPro Office Suite · ${label}`;
  const description = `What PretendPro Office Suite is, who made it, and why it exists (${label}). A wholesome parody office suite of fake-content demo tools.`;
  return {
    meta: socialMeta(title, description, url, socialOgImage),
    links: [
      { rel: "canonical", href: url },
      ...alternateLinks("about"),
      { rel: "alternate", type: "text/markdown", href: "https://pretend.pro/about.md" },
    ],
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
        children: breadcrumbJsonLd(title, url),
      },
    ],
  };
}

/** Contact page metadata. Copy is not translated. */
export function localeContactHead(locale: LocaleId) {
  const url = pageUrl(locale, "contact");
  const label = localeMeta(locale).label;
  const title = `Contact — PretendPro Office Suite · ${label}`;
  const description = `How to reach the maker of PretendPro Office Suite (${label}): GitHub issues and public profiles.`;
  return {
    meta: socialMeta(title, description, url, socialOgImage),
    links: [
      { rel: "canonical", href: url },
      ...alternateLinks("contact"),
      { rel: "alternate", type: "text/markdown", href: "https://pretend.pro/contact.md" },
    ],
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
        children: breadcrumbJsonLd(title, url),
      },
    ],
  };
}

/** Developers page metadata. Copy is not translated. */
export function localeDevelopersHead(locale: LocaleId) {
  const url = pageUrl(locale, "developers");
  const label = localeMeta(locale).label;
  const title = `Developers — PretendPro Office Suite · ${label}`;
  const description = `Developer and agent resources for PretendPro (${label}): docs, agent skills, and the honest truth that there is no API.`;
  return {
    meta: socialMeta(title, description, url, socialOgImage),
    links: [
      { rel: "canonical", href: url },
      ...alternateLinks("developers"),
      { rel: "alternate", type: "text/markdown", href: "https://pretend.pro/developers.md" },
    ],
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
        children: breadcrumbJsonLd(title, url),
      },
    ],
  };
}
