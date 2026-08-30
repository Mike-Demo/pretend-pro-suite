import { createFileRoute } from "@tanstack/react-router";
import { Suite } from "@/components/pretendpro/Suite";
import { parseAppSearch } from "@/lib/pretendpro/search";

export const Route = createFileRoute("/apperture")({
  validateSearch: parseAppSearch,
  head: () => ({
    meta: [
      { title: "PretendPro 3000 — Apperture (Windows) Edition" },
      {
        name: "description",
        content:
          "Fake productivity in an Apperture window: minimize, maximize, and close buttons that refuse to do anything useful.",
      },
      { property: "og:title", content: "PretendPro 3000 — Apperture Edition" },
      {
        property: "og:description",
        content:
          "Fluent-flavored fake work: DocuFaker, SheetShenanigans, BrowserBuddy, Inbox Mirage.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pretend.pro/apperture" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PretendPro 3000 — Apperture Edition" },
      {
        name: "twitter:description",
        content:
          "Fluent-flavored fake work: DocuFaker, SheetShenanigans, BrowserBuddy, Inbox Mirage.",
      },
    ],
    links: [{ rel: "canonical", href: "https://pretend.pro/apperture" }],
  }),
  component: ApperturePage,
});

function ApperturePage() {
  const { app } = Route.useSearch();
  return <Suite osTheme="apperture" initialApp={app} />;
}
