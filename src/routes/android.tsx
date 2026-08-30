import { createFileRoute } from "@tanstack/react-router";
import { Suite } from "@/components/pretendpro/Suite";
import { parseAppSearch } from "@/lib/pretendpro/search";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/android")({
  validateSearch: parseAppSearch,
  head: () => ({
    meta: [
      { title: "PretendPro 3000 — Android Edition" },
      {
        name: "description",
        content:
          "A Material-style pretend phone: home screen full of fake apps, a back / home / recents bar, and a recent apps carousel of work you never did.",
      },
      { property: "og:title", content: "PretendPro 3000 — Android Edition" },
      {
        property: "og:description",
        content: "Pretend productivity in your pocket: eleven fake apps on a Material-style phone.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pretend.pro/android" },
      { property: "og:image", content: "https://pretend.pro/og/android.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PretendPro 3000 — Android Edition" },
      {
        name: "twitter:description",
        content: "Pretend productivity in your pocket: eleven fake apps on a Material-style phone.",
      },
      { name: "twitter:image", content: "https://pretend.pro/og/android.png" },
    ],
    links: [{ rel: "canonical", href: "https://pretend.pro/android" }],
    scripts: [
      {
        type: "application/ld+json",
        children: webPageJsonLd({
          name: "PretendPro 3000 — Android Edition",
          url: "https://pretend.pro/android",
          description:
            "A Material-style pretend phone with a home screen, navigation bar, and eleven fake apps.",
        }),
      },
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd("Android Edition", "https://pretend.pro/android"),
      },
    ],
  }),
  component: AndroidPage,
});

function AndroidPage() {
  const { app } = Route.useSearch();
  return <Suite osTheme="android" initialApp={app} />;
}
