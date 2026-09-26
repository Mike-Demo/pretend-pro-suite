export const siteUrl = "https://pretend.pro";
export const siteName = "PretendPro Office Suite";
export const socialOgImage = `${siteUrl}/og/social.png`;
export const socialOgImageWidth = 1200;
export const socialOgImageHeight = 630;
export const socialOgImageAlt =
  "PretendPro Office Suite — colorful document icons beside the PretendPro logo";
/** @deprecated use socialOgImage */
export const homeOgImage = socialOgImage;

export type WebPageSchemaInput = {
  name: string;
  url: string;
  description: string;
  inLanguage?: string;
};

export function webPageJsonLd({
  name,
  url,
  description,
  inLanguage = "en",
}: WebPageSchemaInput): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage,
  });
}


export function breadcrumbJsonLd(name: string, url: string): string {
  return breadcrumbTrailJsonLd([{ name, url }]);
}

/** Breadcrumb list with Home first, then each supplied crumb in order. */
export function breadcrumbTrailJsonLd(trail: { name: string; url: string }[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      ...trail.map((crumb, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: crumb.name,
        item: crumb.url,
      })),
    ],
  });
}

/**
 * WebApplication structured data for the suite home / edition pages.
 * Marks the whole site as the interactive app it is, so agent audits that
 * look for application-level JSON-LD pass alongside the per-page WebPage node.
 */
export function webApplicationJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${siteUrl}/#webapp`,
    url: siteUrl,
    name: siteName,
    description:
      "A suite of fake-content demo tools — fake code editors, inboxes, documents, onboarding flows, and social mockups — for realistic product screenshots and demos.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    inLanguage: "en",
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` },
  });
}
