import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { speedOrder, type PowerSettings, type PowerSpeed } from "@/lib/pretendpro/power";

const speedLabels: Record<PowerSpeed, string> = {
  slow: "Slow",
  normal: "Normal",
  fast: "Fast",
  instant: "Instant",
};

/** Adjust how long pretend power sequences take, plus sparkles and sounds. */
export function PowerSettingsDialog({
  open,
  onClose,
  settings,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  settings: PowerSettings;
  onUpdate: (patch: Partial<PowerSettings>) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/40 p-4">
      <div
        className="w-full max-w-sm rounded-2xl border-2 border-border bg-popover p-5 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Power settings"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-base font-bold text-popover-foreground">Power settings</h2>
          <button
            onClick={onClose}
            aria-label="Close power settings"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <fieldset className="mt-4">
          <legend className="text-xs font-semibold text-popover-foreground">
            Shutdown animation speed
          </legend>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {speedOrder.map((speed) => (
              <button
                key={speed}
                onClick={() => onUpdate({ speed })}
                aria-pressed={settings.speed === speed}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition-colors",
                  settings.speed === speed
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {speedLabels[speed]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-popover-foreground">Sparkles during power screens</span>
            <Switch
              checked={settings.sparkles}
              onCheckedChange={(sparkles) => onUpdate({ sparkles })}
              aria-label="Sparkles during power screens"
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-popover-foreground">Pretend sounds</span>
            <Switch
              checked={settings.sounds}
              onCheckedChange={(sounds) => onUpdate({ sounds })}
              aria-label="Pretend sounds"
            />
          </label>
        </div>

        <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
          Reduced motion is always respected: spinners stay still and sparkles switch off, so the
          speed setting only changes how fast the text moves.
        </p>
      </div>
    </div>
  );
}
