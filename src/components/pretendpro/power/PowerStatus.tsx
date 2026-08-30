import { cn } from "@/lib/utils";
import { phaseLabels, type PowerPhase } from "@/lib/pretendpro/power";
import { usePower } from "./PowerProvider";

const dotByPhase: Record<PowerPhase, string> = {
  idle: "bg-emerald-500",
  locking: "bg-amber-500",
  saving: "bg-sky-500",
  updating: "bg-violet-500",
  rebooting: "bg-sky-400",
  off: "bg-foreground/40",
};

/** Compact pretend power state chip for shell trays and status bars. */
export function PowerStatus({ className }: { className?: string }) {
  const { phase } = usePower();
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-full border border-border/60 px-1.5 py-0.5 text-[10px] font-semibold text-foreground/70",
        className,
      )}
      title={`Pretend power state: ${phaseLabels[phase]}`}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", dotByPhase[phase], phase !== "idle" && "animate-pulse")}
      />
      <span className="hidden sm:inline" aria-live="polite">
        {phaseLabels[phase]}
      </span>
      <span className="sr-only" aria-live="polite">
        Pretend power state: {phaseLabels[phase]}
      </span>
    </span>
  );
}
