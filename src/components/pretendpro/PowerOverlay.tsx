import { useEffect, useRef, useState } from "react";
import type { OsTheme } from "./WindowFrame";
import { cn } from "@/lib/utils";

const MESSAGE_MS = 1600;
const OFF_BEAT_MS = 900;

const steps: Record<OsTheme, { normal: string[]; fun: string[] }> = {
  fruit: {
    normal: ["Shutting down PretendPro…", "Restarting for no reason…"],
    fun: ["Polishing the fruit logo…", "Restarting with extra courage…"],
  },
  apperture: {
    normal: ["Locking…", "Saving pretend work…", "Turning off…"],
    fun: ["Applying 47 pretend updates…", "Do not turn off your pretend PC…", "Turning off…"],
  },
  bufferium: {
    normal: ["Putting ChromeOS-ish to sleep…", "Syncing nothing to the cloud…"],
    fun: ["Syncing your tabs to a potato…", "Goodnight, little browser…"],
  },
  android: {
    normal: ["Optimizing pretend apps (1 of 3)…", "Optimizing pretend apps (2 of 3)…", "Optimizing pretend apps (3 of 3)…"],
    fun: ["Feeding the robot…", "Charging to 99% forever…", "Powering down, eventually…"],
  },
  fos: {
    normal: ["Shutting down…", "See you soon…"],
    fun: ["Wiping the dynamic island…", "Spinning up the spinner…"],
  },
};

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

/**
 * Fake OS shutdown/loading overlay. Plays a slow, OS-styled animation, then
 * calls onClose. Nothing actually powers off — this is PretendPro.
 */
export function PowerOverlay({
  osTheme,
  funMode,
  onClose,
}: {
  osTheme: OsTheme;
  funMode: boolean;
  onClose: () => void;
}) {
  const messages = steps[osTheme][funMode ? "fun" : "normal"];
  const [index, setIndex] = useState(0);
  const [off, setOff] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    if (off) return;
    if (index < messages.length - 1) {
      const id = window.setTimeout(() => setIndex((i) => i + 1), MESSAGE_MS);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setOff(true), MESSAGE_MS);
    return () => window.clearTimeout(id);
  }, [index, messages.length, off]);

  useEffect(() => {
    if (!off) return;
    const id = window.setTimeout(onClose, OFF_BEAT_MS);
    return () => window.clearTimeout(id);
  }, [off, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Pretend shutdown"
      tabIndex={-1}
      onClick={onClose}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 outline-none animate-fade-in",
        off ? "bg-black" : chromeByTheme[osTheme],
      )}
    >
      {!off && (
        <>
          <Loader osTheme={osTheme} />
          <p
            aria-live="polite"
            className={cn(
              "text-sm",
              osTheme === "apperture" && "text-base font-light tracking-wide",
            )}
          >
            {messages[index]}
          </p>
          <p className="absolute bottom-8 text-[11px] opacity-50">
            Click or press Esc to cancel pretending
          </p>
        </>
      )}
      {off && <span className="sr-only">PretendPro is pretending to be off…</span>}
    </div>
  );
}
