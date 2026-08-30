import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Expand, X, Play, Square, LayoutGrid, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  apps,
  Dock,
  LicenseAlert,
  SparklesLayer,
  StickyNote,
  StuckProgress,
  type AppId,
} from "@/components/pretendpro/chrome";
import { DocuFaker } from "@/components/pretendpro/DocuFaker";
import { SheetShenanigans } from "@/components/pretendpro/SheetShenanigans";
import { BrowserBuddy } from "@/components/pretendpro/BrowserBuddy";
import { InboxMirage } from "@/components/pretendpro/InboxMirage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PretendPro 3000 — Productivity Suite for Getting Nothing Done" },
      {
        name: "description",
        content:
          "PretendPro 3000 is the world's most advanced parody productivity suite: fake docs, absurd spreadsheets, pretend browsing, and auto-generated urgent emails.",
      },
      { property: "og:title", content: "PretendPro 3000 — Get Absolutely Nothing Done" },
      {
        property: "og:description",
        content:
          "A lovable parody office suite: DocuFaker, SheetShenanigans, BrowserBuddy, and Inbox Mirage. Wholesome fake productivity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const screens: Record<AppId, (props: { animated: boolean }) => React.ReactNode> = {
  docufaker: DocuFaker,
  sheets: SheetShenanigans,
  browser: BrowserBuddy,
  inbox: InboxMirage,
};

function Index() {
  const [active, setActive] = useState<AppId>("docufaker");
  const [fullScreen, setFullScreen] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [pageView, setPageView] = useState(false);

  const ActiveScreen = screens[active];
  const activeApp = apps.find((a) => a.id === active);

  useEffect(() => {
    if (!fullScreen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullScreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullScreen]);

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-8">
      <SparklesLayer enabled={animated} />

      <header className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Est. whenever you sat down
        </p>
        <h1
          className={cn(
            "mt-2 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl",
            animated && "animate-pretend-wiggle",
          )}
        >
          PretendPro{" "}
          <span className="rounded-2xl bg-primary px-3 py-1 align-middle text-primary-foreground">
            3000
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          The world's most advanced productivity suite for getting absolutely nothing done.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setFullScreen(true)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            <Expand className="h-3.5 w-3.5" />
            Full-Screen Window
          </button>
          <button
            onClick={() => setAnimated((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors",
              animated
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-muted",
            )}
            aria-pressed={animated}
          >
            {animated ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            Animation Mode {animated ? "On" : "Off"}
          </button>
          <button
            onClick={() => setPageView((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors",
              pageView
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-muted",
            )}
            aria-pressed={pageView}
          >
            {pageView ? <LayoutGrid className="h-3.5 w-3.5" /> : <Layers className="h-3.5 w-3.5" />}
            {pageView ? "Page Tabs On" : "Page View Mode"}
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto mt-8 max-w-4xl">
        {pageView ? (
          <nav className="mb-4 flex flex-wrap justify-center gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => setActive(app.id)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
                  app.id === active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
                aria-pressed={app.id === active}
              >
                {app.name}
              </button>
            ))}
          </nav>
        ) : (
          <Dock active={active} onSelect={setActive} animated={animated} />
        )}

        <section className="relative mt-5" aria-label={activeApp?.name ?? "PretendPro app"}>
          <StickyNote />
          <ActiveScreen animated={animated} />
        </section>

        <StuckProgress />
      </main>

      <footer className="relative z-10 mx-auto mt-10 max-w-4xl text-center text-[11px] text-muted-foreground">
        PretendPro 3000 — no actual work was performed in the making of this suite.
      </footer>

      {fullScreen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-background"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeApp?.name ?? "App"} full screen`}
        >
          <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2">
            <span className="text-sm font-bold text-card-foreground">
              {activeApp?.name ?? "PretendPro"} — Full Screen
            </span>
            <span className="text-xs text-muted-foreground">(Press Esc to exit)</span>
            <div className="ml-auto flex items-center gap-1">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setActive(app.id)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors",
                    app.id === active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                  aria-pressed={app.id === active}
                >
                  {app.name}
                </button>
              ))}
              <button
                onClick={() => setFullScreen(false)}
                className="ml-2 rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                aria-label="Exit full screen"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto max-w-5xl">
              <ActiveScreen animated={animated} />
            </div>
          </div>
        </div>
      )}

      <LicenseAlert />
    </div>
  );
}
