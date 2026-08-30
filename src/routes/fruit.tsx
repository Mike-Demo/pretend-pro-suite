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
        content: "Aqua-tinted fake productivity: DocuFaker, SheetShenanigans, BrowserBuddy, Inbox Mirage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FruitPage,
});

function FruitPage() {
  const { app } = Route.useSearch();
  return <Suite osTheme="fruit" initialApp={app} />;
}
