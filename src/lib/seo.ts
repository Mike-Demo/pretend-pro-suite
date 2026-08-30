export const siteUrl = "https://pretend.pro";
export const siteName = "PretendPro 3000";
export const homeOgImage = `${siteUrl}/og/home.png`;

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
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name, item: url },
    ],
  });
}
