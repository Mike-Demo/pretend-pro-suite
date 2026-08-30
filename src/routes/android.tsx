import { createFileRoute } from "@tanstack/react-router";
import { Suite } from "@/components/pretendpro/Suite";
import { parseAppSearch } from "@/lib/pretendpro/search";

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
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'PretendPro 3000 — Android Edition' },
      { name: "twitter:description", content: 'Pretend productivity in your pocket: eleven fake apps on a Material-style phone.' },
    ],
    links: [{ rel: "canonical", href: "https://pretend.pro/android" }],
  }),
  component: AndroidPage,
});

function AndroidPage() {
  const { app } = Route.useSearch();
  return <Suite osTheme="android" initialApp={app} />;
}
