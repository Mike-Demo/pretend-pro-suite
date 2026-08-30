import { DownloadCloud, Lock, Power, RefreshCw, Settings2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { actionLabels, actionShortcuts, type PowerAction } from "@/lib/pretendpro/power";
import { usePower } from "./PowerProvider";

const icons: Record<PowerAction, LucideIcon> = {
  shutdown: Power,
  restart: RefreshCw,
  lock: Lock,
  update: DownloadCloud,
};

const order: PowerAction[] = ["shutdown", "restart", "lock", "update"];

/** Power entries with shortcut hints, shared by every shell menu. */
export function PowerMenuItems({
  onDone,
  itemClassName,
}: {
  onDone: () => void;
  itemClassName?: string;
}) {
  const { start, openSettings, openPalette } = usePower();
  const item = cn(
    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted",
    itemClassName,
  );

  return (
    <div className="flex flex-col">
      {order.map((action) => {
        const Icon = icons[action];
        return (
          <button
            key={action}
            className={item}
            onClick={() => {
              onDone();
              start(action);
            }}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="flex-1">{actionLabels[action]}</span>
            <kbd className="font-mono text-[9px] text-muted-foreground">
              {actionShortcuts[action]}
            </kbd>
          </button>
        );
      })}
      <button
        className={item}
        onClick={() => {
          onDone();
          openPalette();
        }}
      >
        <Power className="h-3.5 w-3.5" />
        <span className="flex-1">Power actions…</span>
        <kbd className="font-mono text-[9px] text-muted-foreground">⌘/Ctrl + ⇧ + P</kbd>
      </button>
      <button
        className={item}
        onClick={() => {
          onDone();
          openSettings();
        }}
      >
        <Settings2 className="h-3.5 w-3.5" />
        <span className="flex-1">Power settings…</span>
      </button>
    </div>
  );
}
