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
        content: "Fluent-flavored fake work: DocuFaker, SheetShenanigans, BrowserBuddy, Inbox Mirage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApperturePage,
});

function ApperturePage() {
  const { app } = Route.useSearch();
  return <Suite osTheme="apperture" initialApp={app} />;
}
