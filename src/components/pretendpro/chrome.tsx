import { useEffect, useMemo, useState } from "react";
import { FileText, Table2, Globe, Mail, Sparkles as SparklesIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AppId = "docufaker" | "sheets" | "browser" | "inbox";

export const apps: Array<{
  id: AppId;
  name: string;
  icon: typeof FileText;
  chip: string;
}> = [
  { id: "docufaker", name: "DocuFaker", icon: FileText, chip: "bg-sky text-sky-foreground" },
  { id: "sheets", name: "SheetShenanigans", icon: Table2, chip: "bg-mint text-mint-foreground" },
  { id: "browser", name: "BrowserBuddy", icon: Globe, chip: "bg-grape text-grape-foreground" },
  { id: "inbox", name: "Inbox Mirage", icon: Mail, chip: "bg-bubblegum text-bubblegum-foreground" },
];

export function Dock({
  active,
  onSelect,
  animated,
}: {
  active: AppId;
  onSelect: (id: AppId) => void;
  animated: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {apps.map((app) => {
        const Icon = app.icon;
        const isActive = app.id === active;
        return (
          <button
            key={app.id}
            onClick={() => onSelect(app.id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-3 shadow-md transition-transform hover:-translate-y-1 hover:scale-105",
              isActive ? "border-primary bg-card" : "border-border bg-card/70",
              animated && "animate-pretend-bounce",
            )}
            style={animated ? { animationDelay: `${apps.indexOf(app) * 0.2}s` } : undefined}
            aria-pressed={isActive}
          >
            <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl", app.chip)}>
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-xs font-semibold text-foreground">{app.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SparklesLayer({ enabled }: { enabled: boolean }) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: (i * 67) % 100,
        top: (i * 37) % 90,
        delay: (i * 0.7) % 4,
        size: 10 + ((i * 5) % 12),
      })),
    [],
  );
  if (!enabled) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {sparkles.map((s, i) => (
        <SparklesIcon
          key={i}
          className="absolute text-primary/50"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `pretend-sparkle-float 4s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function StickyNote() {
  return (
    <div className="absolute right-3 top-3 z-10 hidden rotate-3 rounded-md bg-butter px-3 py-2 text-xs font-semibold text-butter-foreground shadow-md sm:block">
      You're doing great, probably.
    </div>
  );
}

export function StuckProgress() {
  return (
    <div className="mx-auto mt-6 w-full max-w-sm">
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>Loading productivity…</span>
        <span>99%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border border-border bg-muted">
        <div className="h-full w-[99%] rounded-full bg-primary" />
      </div>
      <p className="mt-1 text-center text-[11px] text-muted-foreground">
        Almost done. It's been 99% since 2019.
      </p>
    </div>
  );
}

export function LicenseAlert() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const first = window.setTimeout(() => setOpen(true), 4000);
    return () => window.clearTimeout(first);
  }, []);

  useEffect(() => {
    if (open) return undefined;
    const again = window.setTimeout(() => setOpen(true), 45000);
    return () => window.clearTimeout(again);
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4">
      <div className="w-full max-w-sm rounded-2xl border-2 border-border bg-popover p-5 shadow-xl">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold text-popover-foreground">System Alert</h2>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Your PretendPro license has expired due to excessive pretending.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Renewing requires doing actual work. We understand if you decline.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Keep Pretending
          </button>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg border border-input px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
