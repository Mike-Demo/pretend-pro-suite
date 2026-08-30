import { createFileRoute } from "@tanstack/react-router";
import { Suite } from "@/components/pretendpro/Suite";
import { parseAppSearch } from "@/lib/pretendpro/search";

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
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PretendPro 3000 — fOS Edition" },
      {
        name: "twitter:description",
        content: "Eleven fake apps on a glossy pretend phone. Swipe up to accomplish nothing.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pretend.pro/fos" }],
  }),
  component: FosPage,
});

function FosPage() {
  const { app } = Route.useSearch();
  return <Suite osTheme="fos" initialApp={app} />;
}
