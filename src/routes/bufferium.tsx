import { createFileRoute } from "@tanstack/react-router";
import { Suite } from "@/components/pretendpro/Suite";
import { parseAppSearch } from "@/lib/pretendpro/search";

export const Route = createFileRoute("/bufferium")({
  validateSearch: parseAppSearch,
  head: () => ({
    meta: [
      { title: "PretendPro 3000 — BufferiumOS Edition" },
      {
        name: "description",
        content:
          "BufferiumOS: a tab-strip window where everything is one click away from looking productive, forever buffering.",
      },
      { property: "og:title", content: "PretendPro 3000 — BufferiumOS Edition" },
      {
        property: "og:description",
        content: "Tab-shaped fake work: DocuFaker, SheetShenanigans, BrowserBuddy, Inbox Mirage.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pretend.pro/bufferium" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'PretendPro 3000 — BufferiumOS Edition' },
      { name: "twitter:description", content: 'Tab-shaped fake work: DocuFaker, SheetShenanigans, BrowserBuddy, Inbox Mirage.' },
    ],
    links: [{ rel: "canonical", href: "https://pretend.pro/bufferium" }],
  }),
  component: BufferiumPage,
});

function BufferiumPage() {
  const { app } = Route.useSearch();
  return <Suite osTheme="bufferium" initialApp={app} />;
}
