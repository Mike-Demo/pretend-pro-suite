import { createFileRoute } from "@tanstack/react-router";
import { Suite } from "@/components/pretendpro/Suite";
import { parseAppSearch } from "@/lib/pretendpro/search";

export const Route = createFileRoute("/fruit")({
  validateSearch: parseAppSearch,
  head: () => ({
    meta: [
      { title: "PretendPro 3000 — Fruit (Mac OS X) Edition" },
      {
        name: "description",
        content:
          "Pretend to work inside a Fruit-flavored Mac OS X window: traffic lights, centered titles, and four gloriously useless apps.",
      },
      { property: "og:title", content: "PretendPro 3000 — Fruit Edition" },
      {
        property: "og:description",
        content:
          "Aqua-tinted fake productivity: DocuFaker, SheetShenanigans, BrowserBuddy, Inbox Mirage.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pretend.pro/fruit" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PretendPro 3000 — Fruit Edition" },
      {
        name: "twitter:description",
        content:
          "Aqua-tinted fake productivity: DocuFaker, SheetShenanigans, BrowserBuddy, Inbox Mirage.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pretend.pro/fruit" }],
  }),
  component: FruitPage,
});

function FruitPage() {
  const { app } = Route.useSearch();
  return <Suite osTheme="fruit" initialApp={app} />;
}
