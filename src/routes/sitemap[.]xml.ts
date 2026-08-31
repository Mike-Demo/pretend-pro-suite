import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/start-client-core";
import { localeIds } from "@/lib/i18n/locales";

const BASE_URL = "https://pretend.pro";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const editions = ["fruit", "apperture", "bufferium", "android", "fos"];

const pages: SitemapEntry[] = [
  { path: "", changefreq: "weekly", priority: "1.0" },
  // Edition landing pages plus one URL per edition + work type combination.
  ...editions.flatMap((edition) => [
    { path: edition, changefreq: "monthly" as const, priority: "0.8" },
    ...appIds.map((app) => ({
      path: `${edition}/${app}`,
      changefreq: "monthly" as const,
      priority: "0.6",
    })),
  ]),
  { path: "licenses", changefreq: "yearly", priority: "0.3" },
  { path: "privacy", changefreq: "yearly", priority: "0.3" },
  { path: "terms", changefreq: "yearly", priority: "0.3" },
];

// The unprefixed home page is the x-default entry; every other URL is
// locale-prefixed, one entry per locale.
const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  ...localeIds.flatMap((locale) =>
    pages.map((page) => ({
      ...page,
      path: `/${locale}${page.path ? `/${page.path}` : ""}`,
    })),
  ),
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
