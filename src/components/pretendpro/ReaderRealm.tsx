import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Highlighter } from "lucide-react";
import { Attribution, useOpenverseImages } from "./OpenverseMedia";
import { cn } from "@/lib/utils";

const pages = [
  "Chapter 1 — On the strategic alignment of waffle metrics: a longitudinal study of meetings that could have been emails.",
  "Chapter 2 — Synergizing cross-functional vibes across the enterprise waffle stack. Results were inconclusive, but the fonts were excellent.",
  "Chapter 3 — Conclusion: further research is needed. Preferably by someone else, next quarter.",
];

export function ReaderRealm({ animated }: { animated: boolean }) {
  const { data } = useOpenverseImages("book library reading", 4);
  const assets = data?.assets ?? [];
  const [page, setPage] = useState(0);
  const [highlightOn, setHighlightOn] = useState(false);

  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-1.5 text-xs">
        <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span className="font-semibold">ReaderRealm</span>
        <span className="text-muted-foreground">— waffle-metrics-quarterly.pdf</span>
        <button
          onClick={() => setHighlightOn((v) => !v)}
          aria-pressed={highlightOn}
          className={cn(
            "fluent-focus ml-auto flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold",
            highlightOn ? "bg-butter text-butter-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          <Highlighter className="h-3 w-3" aria-hidden="true" /> Highlight
        </button>
      </div>
      <div className="flex min-h-0 flex-1">
        {assets.length > 0 && (
          <aside className="hidden w-40 shrink-0 flex-col border-r border-border bg-muted/30 p-2 sm:flex">
            <img
              src={assets[0]?.thumbnail ?? assets[0]?.url}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="w-full rounded-md border border-border object-cover"
            />
            <Attribution asset={assets[0]!} className="mt-1.5" />
          </aside>
        )}
        <main className="flex min-w-0 flex-1 flex-col p-6">
          <div
            className={cn(
              "min-h-0 flex-1 rounded-lg border border-border bg-background p-6 shadow-sm",
              animated && "transition-transform duration-300",
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Page {page + 1} of {pages.length}
            </p>
            <p className="mt-4 max-w-prose text-sm leading-7">
              {highlightOn ? (
                <mark className="rounded bg-butter/70 px-0.5">{pages[page]}</mark>
              ) : (
                pages[page]
              )}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous page"
              className="fluent-focus rounded-md border border-border p-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground">
              {page + 1} / {pages.length}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
              disabled={page === pages.length - 1}
              aria-label="Next page"
              className="fluent-focus rounded-md border border-border p-1.5 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
