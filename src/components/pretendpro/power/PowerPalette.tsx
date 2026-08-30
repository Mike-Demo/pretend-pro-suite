import { Power, RefreshCw, Lock, DownloadCloud, Settings2, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { actionLabels, actionShortcuts, type PowerAction } from "@/lib/pretendpro/power";

const entries: Array<{ action: PowerAction; icon: LucideIcon }> = [
  { action: "shutdown", icon: Power },
  { action: "restart", icon: RefreshCw },
  { action: "lock", icon: Lock },
  { action: "update", icon: DownloadCloud },
];

/** Universal palette for pretend power actions (⌘/Ctrl + ⇧ + P). */
export function PowerPalette({
  open,
  onClose,
  onRun,
  onOpenSettings,
}: {
  open: boolean;
  onClose: () => void;
  onRun: (action: PowerAction) => void;
  onOpenSettings: () => void;
}) {
  if (!open) return null;

  const row =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-foreground/40 p-4 pt-28">
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border-2 border-border bg-popover shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Power actions"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <p className="text-xs font-bold text-popover-foreground">Power actions</p>
          <button
            onClick={onClose}
            aria-label="Close power actions"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex flex-col p-1.5">
          {entries.map(({ action, icon: Icon }) => (
            <button key={action} className={row} onClick={() => onRun(action)}>
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 font-medium">{actionLabels[action]}</span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                {actionShortcuts[action]}
              </kbd>
            </button>
          ))}
          <button className={row} onClick={onOpenSettings}>
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 font-medium">Power settings…</span>
          </button>
          <button className={row} onClick={onClose}>
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 font-medium">Cancel</span>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              Esc
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
