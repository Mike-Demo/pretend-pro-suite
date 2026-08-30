import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion, type PowerPhase } from "@/lib/pretendpro/power";

/** Phases where the pretend battery animates as if charging. */
const chargingPhases: PowerPhase[] = ["locking", "saving", "updating", "rebooting"];

const IDLE_LEVEL = 87;
const TICK_MS = 420;

export type BatteryReading = { level: number; charging: boolean };

/**
 * Pretend battery reading for the current power phase. It creeps upward while
 * locking/saving/updating and freezes when the machine is idle or off.
 */
export function usePretendBattery(phase: PowerPhase): BatteryReading {
  const charging = chargingPhases.includes(phase);
  const [level, setLevel] = useState(IDLE_LEVEL);

  useEffect(() => {
    if (!charging) {
      setLevel(phase === "off" ? 0 : IDLE_LEVEL);
      return;
    }
    if (prefersReducedMotion()) {
      setLevel(99);
      return;
    }
    setLevel(62);
    const id = window.setInterval(() => {
      // Never quite reaches 100%: the pretend battery is pretending too.
      setLevel((prev) => (prev >= 99 ? 62 : Math.min(99, prev + 3)));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [charging, phase]);

  return { level, charging };
}

/** Small animated battery indicator tied to the pretend power phase. */
export function BatteryGauge({
  phase,
  className,
  showLabel = true,
}: {
  phase: PowerPhase;
  className?: string;
  showLabel?: boolean;
}) {
  const { level, charging } = usePretendBattery(phase);
  const label = phase === "off" ? "Pretend battery empty" : `Pretend battery ${level}%`;

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} title={label}>
      <span
        aria-hidden="true"
        className="relative inline-flex h-3 w-6 items-center rounded-[3px] border border-current/60 p-[1.5px]"
      >
        <span
          className={cn(
            "block h-full rounded-[1.5px] bg-current transition-[width] duration-500 ease-out",
            charging && "opacity-90",
          )}
          style={{ width: `${Math.max(4, level)}%` }}
        />
        <span
          aria-hidden="true"
          className="absolute -right-[3px] top-1/2 h-1.5 w-[2px] -translate-y-1/2 rounded-r-sm bg-current/60"
        />
        {charging && (
          <svg
            viewBox="0 0 24 24"
            className="animate-pulse absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 drop-shadow"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2 4 14h7l-1 8 9-12h-7z" className="fill-current" stroke="none" />
          </svg>
        )}
      </span>
      {showLabel && (
        <span className="text-[10px] font-semibold tabular-nums">
          {phase === "off" ? "—" : `${level}%`}
        </span>
      )}
      <span className="sr-only" aria-live="polite">
        {charging ? `${label}, pretending to charge` : label}
      </span>
    </span>
  );
}
