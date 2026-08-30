import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/start-client-core";
import { localeIds } from "@/lib/i18n/locales";

const BASE_URL = "https://pretend.pro";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const pages: SitemapEntry[] = [
  { path: "", changefreq: "weekly", priority: "1.0" },
  { path: "fruit", changefreq: "monthly", priority: "0.8" },
  { path: "apperture", changefreq: "monthly", priority: "0.8" },
  { path: "bufferium", changefreq: "monthly", priority: "0.8" },
  { path: "android", changefreq: "monthly", priority: "0.8" },
  { path: "fos", changefreq: "monthly", priority: "0.8" },
  { path: "licenses", changefreq: "yearly", priority: "0.3" },
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
