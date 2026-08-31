import { useCallback, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BrandLockup } from "@/components/pretendpro/BrandLockup";

/**
 * Full-screen step transition: staggered brand-colored panels sweep up to cover
 * the screen, an action runs behind the cover, then the panels sweep off.
 *
 * Transition concept inspired by John Heiner (https://codepen.io/johnheiner).
 */
export type TransitionPhase = "idle" | "covering" | "holding" | "revealing";

const panelTints = [
  "var(--transition-panel-1)",
  "var(--transition-panel-2)",
  "var(--transition-panel-3)",
  "var(--transition-panel-4)",
] as const;

const coverMs = 930;
const revealMs = 780;
const staggerMs = 105;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface RunOptions {
  /** Minimum time the loader stays visible after the action resolves. */
  readonly hold?: number;
  /** Status line shown under the loader. */
  readonly status?: string;
  /** Skip the reveal (used when the action navigates away). */
  readonly keepCovered?: boolean;
}

export interface StepTransition {
  readonly phase: TransitionPhase;
  readonly active: boolean;
  readonly overlay: ReactNode;
  readonly run: (action: () => void | Promise<void>, options?: RunOptions) => Promise<void>;
}

export function useStepTransition(): StepTransition {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [status, setStatus] = useState<string | null>(null);
  const busyRef = useRef(false);

  const run = useCallback(async (action: () => void | Promise<void>, options: RunOptions = {}) => {
    if (busyRef.current) return;
    busyRef.current = true;
    const reduced = prefersReducedMotion();
    setStatus(options.status ?? null);
    setPhase("covering");
    await wait(reduced ? 180 : coverMs + staggerMs * (panelTints.length - 1));
    setPhase("holding");
    try {
      await action();
    } finally {
      await wait(options.hold ?? (reduced ? 180 : 630));
      if (options.keepCovered) {
        busyRef.current = false;
        return;
      }
      if (reduced) {
        setPhase("idle");
      } else {
        setPhase("revealing");
        await wait(revealMs + staggerMs * (panelTints.length - 1));
        setPhase("idle");
      }
      busyRef.current = false;
    }
  }, []);

  const overlay =
    phase === "idle" ? null : (
      <>
        <div className="fixed inset-0 z-[120] flex items-center justify-center" aria-hidden="true">
          <div className="absolute inset-0 flex">
            {panelTints.map((tint, i) => (
              <span
                key={i}
                className={cn(
                  "h-full flex-1",
                  phase === "revealing" ? "animate-panel-reveal" : "animate-panel-cover",
                )}
                style={{
                  backgroundColor: tint,
                  animationDelay: `${(phase === "revealing" ? panelTints.length - 1 - i : i) * staggerMs}ms`,
                }}
              />
            ))}
          </div>

          {phase !== "revealing" && (
            <div className="animate-loader-in relative flex flex-col items-center gap-4 rounded-2xl bg-black/55 px-8 py-6 text-white shadow-[var(--fluent-shadow-16)] ring-1 ring-white/15 backdrop-blur-md">
              <span className="flex items-center gap-2">
                <BrandLockup markOnly className="scale-125" />
                <span className="text-base font-semibold tracking-tight">PretendPro Office Suite</span>
              </span>

              <svg viewBox="0 0 36 36" className="animate-arc-rotate h-9 w-9" aria-hidden="true">
                <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-arc-dash"
                />
              </svg>
              {status && <p className="text-sm font-medium">{status}</p>}
            </div>
          )}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {status ?? ""}
        </p>
      </>
    );

  return { phase, active: phase !== "idle", overlay, run };
}
