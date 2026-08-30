import { useEffect, useRef } from "react";
import type { OsTheme } from "./WindowFrame";
import { SparklesLayer } from "./chrome";
import { cn } from "@/lib/utils";

function SpokeLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-10 w-10", className)} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="animate-spoke-fade absolute left-1/2 top-0 h-[30%] w-[7%] -translate-x-1/2 rounded-full bg-current"
          style={{
            transform: `rotate(${i * 30}deg) translateX(-50%)`,
            transformOrigin: "50% 166%",
            animationDelay: `${(i / 12) * 1.2 - 1.2}s`,
          }}
        />
      ))}
    </div>
  );
}

function WindowsRingLoader() {
  return (
    <div className="animate-windows-ring relative h-10 w-10" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
          style={{
            transform: `rotate(${i * 60}deg) translateY(-17px)`,
            opacity: 1 - i * 0.13,
          }}
        />
      ))}
    </div>
  );
}

function BounceDotsLoader() {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="animate-bounce-dot h-2.5 w-2.5 rounded-full bg-current"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </div>
  );
}

function MaterialArcLoader() {
  return (
    <svg viewBox="0 0 48 48" className="animate-arc-rotate h-12 w-12" aria-hidden="true">
      <circle
        cx="24"
        cy="24"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="animate-arc-dash"
      />
    </svg>
  );
}

function Loader({ osTheme }: { osTheme: OsTheme }) {
  switch (osTheme) {
    case "fruit":
      return <SpokeLoader />;
    case "apperture":
      return <WindowsRingLoader />;
    case "bufferium":
      return <BounceDotsLoader />;
    case "android":
      return <MaterialArcLoader />;
    case "fos":
      return <SpokeLoader className="text-foreground/60" />;
  }
}

const chromeByTheme: Record<OsTheme, string> = {
  fruit: "bg-foreground/20 text-card backdrop-blur-2xl",
  apperture: "bg-[#1b1b1f]/95 text-[#f5f5f7] backdrop-blur-xl",
  bufferium: "bg-[var(--os-chrome)] text-foreground",
  android: "bg-[var(--os-chrome)] text-foreground",
  fos: "bg-black text-white",
};

export type OverlayMode = "running" | "off" | "locked";

/**
 * Presentational OS-styled power screen. All timing lives in the power
 * provider; this only paints the current message or terminal screen.
 */
export function PowerOverlay({
  osTheme,
  mode,
  message,
  sparkles,
  onCancel,
  onWake,
}: {
  osTheme: OsTheme;
  mode: OverlayMode;
  message: string;
  sparkles: boolean;
  onCancel: () => void;
  onWake: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const running = mode === "running";

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Pretend power screen"
      tabIndex={-1}
      onClick={running ? onCancel : onWake}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 outline-none animate-fade-in",
        mode === "off" ? "bg-black text-white" : chromeByTheme[osTheme],
      )}
    >
      {running && sparkles && <SparklesLayer enabled />}

      {running && (
        <>
          <Loader osTheme={osTheme} />
          <p
            aria-live="polite"
            className={cn("text-sm", osTheme === "apperture" && "text-base font-light tracking-wide")}
          >
            {message}
          </p>
          <p className="absolute bottom-8 text-[11px] opacity-50">
            Click or press Esc to cancel pretending
          </p>
        </>
      )}

      {mode === "off" && (
        <>
          <span className="sr-only" aria-live="polite">
            PretendPro is pretending to be off
          </span>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
            Press any key to pretend to power on
          </p>
        </>
      )}

      {mode === "locked" && (
        <>
          <p aria-live="polite" className="text-sm font-semibold">
            Pretend screen locked
          </p>
          <p className="text-[11px] opacity-60">Click or press any key to unlock</p>
        </>
      )}
    </div>
  );
}
