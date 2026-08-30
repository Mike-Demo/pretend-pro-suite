import { createFileRoute } from "@tanstack/react-router";
import { Suite } from "@/components/pretendpro/Suite";
import { parseAppSearch } from "@/lib/pretendpro/search";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/fos")({
  validateSearch: parseAppSearch,
  head: () => ({
    meta: [
      { title: "PretendPro 3000 — fOS Edition" },
      {
        name: "description",
        content:
          "A Cupertino-style pretend phone: notch status bar, rounded app icons, a bottom dock, and a home indicator you can tap forever.",
      },
      { property: "og:title", content: "PretendPro 3000 — fOS Edition" },
      {
        property: "og:description",
        content: "Eleven fake apps on a glossy pretend phone. Swipe up to accomplish nothing.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pretend.pro/fos" },
      { property: "og:image", content: "https://pretend.pro/og/fos.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PretendPro 3000 — fOS Edition" },
      {
        name: "twitter:description",
        content: "Eleven fake apps on a glossy pretend phone. Swipe up to accomplish nothing.",
      },
      { name: "twitter:image", content: "https://pretend.pro/og/fos.png" },
    ],
    links: [{ rel: "canonical", href: "https://pretend.pro/fos" }],
    scripts: [
      {
        type: "application/ld+json",
        children: webPageJsonLd({
          name: "PretendPro 3000 — fOS Edition",
          url: "https://pretend.pro/fos",
          description:
            "A Cupertino-style pretend phone with rounded icons, a dock, and eleven fake apps.",
        }),
      },
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd("fOS Edition", "https://pretend.pro/fos"),
      },
    ],
  }),
  component: FosPage,
});

function FosPage() {
  const { app } = Route.useSearch();
  return <Suite osTheme="fos" initialApp={app} />;
}
