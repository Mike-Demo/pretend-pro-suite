import { useEffect, useMemo, useRef, useState } from "react";
import { apps, type AppId } from "@/components/pretendpro/chrome";
import { cn } from "@/lib/utils";
import { preloadAppScreen } from "@/components/pretendpro/app-screens";

export function CommandPalette({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (id: AppId) => void;
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => apps.filter((a) => a.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setIndex(0);
    inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const commit = (id: AppId) => {
    onSelect(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-foreground/40 p-4 pt-28">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-border bg-popover shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="App switcher"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => (i + 1) % Math.max(results.length, 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1));
            } else if (e.key === "Enter" && results[index]) {
              commit(results[index].id);
            }
          }}
          placeholder="Search pretend apps…"
          className="w-full border-b border-border bg-transparent px-4 py-3 text-sm text-popover-foreground outline-none placeholder:text-muted-foreground"
        />
        <ul className="max-h-64 overflow-y-auto p-1.5">
          {results.length === 0 && (
            <li className="px-3 py-4 text-center text-xs text-muted-foreground">
              No pretend apps found. Try pretending harder.
            </li>
          )}
          {results.map((app, i) => {
            const Icon = app.icon;
            return (
              <li key={app.id}>
                <button
                  onClick={() => commit(app.id)}
                  onMouseEnter={() => {
                    setIndex(i);
                    preloadAppScreen(app.id);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm",
                    i === index ? "bg-muted" : "hover:bg-muted/60",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                      app.chip,
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-medium text-popover-foreground">{app.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
