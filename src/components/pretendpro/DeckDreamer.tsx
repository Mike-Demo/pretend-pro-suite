import { useState } from "react";
import { MonitorPlay, Plus } from "lucide-react";
import { Attribution, MediaPlaceholder, useOpenverseImages } from "./OpenverseMedia";
import { cn } from "@/lib/utils";

const slideTitles = [
  "Q4 Vibes Roadmap",
  "Synergy: A Retrospective",
  "Waffle Metrics Deep Dive",
  "Our North Star (Revised Again)",
  "Appendix: More Vibes",
];

export function DeckDreamer({ animated }: { animated: boolean }) {
  const { data } = useOpenverseImages("business meeting office", 6);
  const assets = data?.assets ?? [];
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-1.5 text-xs">
        <MonitorPlay className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span className="font-semibold">DeckDreamer</span>
        <span className="text-muted-foreground">— quarterly-vibes-final-FINAL.pptx</span>
        <button className="fluent-focus ml-auto flex items-center gap-1 rounded bg-butter px-2 py-0.5 text-[11px] font-semibold text-butter-foreground">
          <Plus className="h-3 w-3" aria-hidden="true" /> New slide
        </button>
      </div>
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-40 shrink-0 space-y-2 overflow-y-auto border-r border-border bg-muted/30 p-2 sm:block">
          {slideTitles.map((title, i) => (
            <button
              key={title}
              onClick={() => setCurrent(i)}
              aria-pressed={current === i}
              className={cn(
                "w-full rounded-md border p-1.5 text-left transition-colors",
                current === i ? "border-primary bg-primary/10" : "border-border bg-card",
              )}
            >
              <span className="mb-1 block text-[10px] font-bold text-muted-foreground">{i + 1}</span>
              <span className="block truncate text-[11px] font-medium">{title}</span>
            </button>
          ))}
        </aside>
        <main className="flex min-w-0 flex-1 flex-col p-4">
          <div
            className={cn(
              "relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted",
              animated && "transition-transform hover:scale-[1.01]",
            )}
          >
            {assets.length > 0 ? (
              <img
                src={assets[current % assets.length]?.thumbnail ?? assets[current % assets.length]?.url}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
            ) : (
              <MediaPlaceholder label="Inspiring stock photo loading…" className="absolute inset-0" />
            )}
            <div className="relative px-6 text-center">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{slideTitles[current]}</h3>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                Presented with confidence. Understood by no one.
              </p>
            </div>
          </div>
          {assets.length > 0 && (
            <Attribution asset={assets[current % assets.length]!} className="mt-2 text-center" />
          )}
        </main>
      </div>
    </div>
  );
}
