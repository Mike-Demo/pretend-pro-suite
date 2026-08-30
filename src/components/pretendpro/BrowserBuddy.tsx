import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "research",
    title: "Important Research",
    url: "https://very-important-research.biz/synergy",
    heading: "The Definitive Guide to Looking Busy",
    body: "Chapter 1: Holding a notebook while walking quickly. Chapter 2: Sighing at spreadsheets. Chapter 3: Saying 'let's circle back' with conviction.",
  },
  {
    id: "work",
    title: "Definitely Work",
    url: "https://definitely-not-shopping.example/deals",
    heading: "Q3 Spreadsheet Accessories Sale",
    body: "This tab contains only work. Definitely no flash sales on ergonomic snack bowls. Please do not read the URL.",
  },
  {
    id: "cats",
    title: "Cat Videos (Incognito)",
    url: "incognito://cats/fuzzball-compilation-42",
    heading: "You have watched 0 cat videos*",
    body: "*this session. Incognito mode means even your spreadsheet can't judge you. Fuzzball #7 is particularly productive.",
  },
] as const;

export function BrowserBuddy({ animated }: { animated: boolean }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("research");
  const tab = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg">
      <div className="flex items-end gap-1 border-b border-border bg-grape px-2 pt-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "max-w-40 truncate rounded-t-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              t.id === activeTab
                ? "bg-card text-card-foreground"
                : "bg-grape-foreground/20 text-grape-foreground hover:bg-grape-foreground/30",
            )}
            aria-pressed={t.id === activeTab}
          >
            {t.title}
          </button>
        ))}
        <span className="mb-1 ml-auto hidden text-[10px] text-grape-foreground/70 sm:block">
          47 other tabs
        </span>
      </div>

      <div className="flex items-center gap-2 border-b border-border bg-muted px-3 py-2">
        <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <RotateCw
          className={cn("h-4 w-4 text-muted-foreground", animated && "animate-spin")}
          style={animated ? { animationDuration: "3s" } : undefined}
        />
        <div className="flex flex-1 items-center gap-1.5 truncate rounded-full border border-input bg-card px-3 py-1 text-xs text-muted-foreground">
          <Lock className="h-3 w-3 shrink-0 text-chart-2" />
          <span className="truncate">{tab.url}</span>
        </div>
        <Star className="h-4 w-4 text-chart-3" />
      </div>

      <div className="px-5 py-6 sm:px-8">
        <h3 className="text-lg font-bold text-card-foreground">{tab.heading}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tab.body}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Totally Legit Sources", "Cite Your Vibes", "Ask a Manager"].map((label, i) => (
            <span
              key={label}
              className={cn(
                "rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground",
                animated && "animate-pretend-wiggle",
              )}
              style={animated ? { animationDelay: `${i * 0.4}s` } : undefined}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
