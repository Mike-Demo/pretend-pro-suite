import { useCallback, useEffect, useState } from "react";
import type { OsTheme } from "@/components/pretendpro/WindowFrame";

/** Everything the pretend power center can be asked to do. */
export type PowerAction = "shutdown" | "restart" | "lock" | "update";

/** Coarse state surfaced by the status indicator. */
export type PowerPhase = "idle" | "locking" | "saving" | "updating" | "rebooting" | "off";

export type PowerStep = { phase: Exclude<PowerPhase, "idle" | "off">; label: string };

/** Terminal screen a sequence settles on before returning to the desktop. */
export type PowerTerminal = "desktop" | "off" | "locked";

type ThemeCopy = {
  shutdown: string[];
  funShutdown: string[];
  boot: string[];
  lock: string[];
  update: string[];
};

const copy: Record<OsTheme, ThemeCopy> = {
  fruit: {
    shutdown: ["Shutting down PretendPro…", "Saving pretend work…"],
    funShutdown: ["Polishing the fruit logo…", "Deleting all real work… just kidding"],
    boot: ["Starting PretendPro…", "Loading nothing in particular…"],
    lock: ["Locking the pretend screen…"],
    update: [
      "Downloading PretendPro 3000.1…",
      "Preparing…",
      "Installing (this will take forever)…",
    ],
  },
  apperture: {
    shutdown: ["Locking…", "Saving pretend work…", "Turning off…"],
    funShutdown: [
      "Applying 47 pretend updates…",
      "Do not turn off your pretend PC…",
      "Turning off…",
    ],
    boot: ["Starting Apperture…", "Getting your pretend devices ready…"],
    lock: ["Locking…"],
    update: [
      "Working on updates 12%…",
      "Working on updates 47%…",
      "Working on updates 98%…",
      "Don't turn off your pretend PC",
    ],
  },
  bufferium: {
    shutdown: ["Putting ChromeOS-ish to sleep…", "Syncing nothing to the cloud…"],
    funShutdown: ["Syncing your tabs to a potato…", "Goodnight, little browser…"],
    boot: ["Waking the little browser…"],
    lock: ["Locking your pretend profile…"],
    update: ["Your ChromeOS-ish is almost up to date", "Restart to finish pretending"],
  },
  android: {
    shutdown: [
      "Optimizing pretend apps (1 of 3)…",
      "Optimizing pretend apps (2 of 3)…",
      "Optimizing pretend apps (3 of 3)…",
    ],
    funShutdown: ["Feeding the robot…", "Charging to 99% forever…", "Powering down, eventually…"],
    boot: ["Starting pretend Android…", "Finishing the pretend boot…"],
    lock: ["Locking…"],
    update: [
      "Downloading system update…",
      "Installing pretend update 43%…",
      "Optimizing pretend apps…",
    ],
  },
  fos: {
    shutdown: ["Shutting down…", "See you soon…"],
    funShutdown: ["Wiping the dynamic island…", "Spinning up the spinner…"],
    boot: ["Hello.", "Preparing your pretend phone…"],
    lock: ["Locking…"],
    update: ["Preparing update…", "Verifying pretend update…", "Installing… 88%"],
  },
};

const funLock = ["Hiding your pretend work from nobody…"];
const funUpdate = [
  "Downloading 4.7 GB of nothing…",
  "Renaming buttons for no reason…",
  "Installing features you will never use…",
];
const funBoot = ["Waking up reluctantly…", "Pretending to be ready…"];

function toSteps(labels: string[], phase: PowerStep["phase"]): PowerStep[] {
  return labels.map((label) => ({ phase, label }));
}

/** Full ordered step list plus terminal screen for one action on one OS. */
export function sequenceFor(
  osTheme: OsTheme,
  action: PowerAction,
  funMode: boolean,
): { steps: PowerStep[]; terminal: PowerTerminal } {
  const theme = copy[osTheme];
  const shutdown = toSteps(funMode ? theme.funShutdown : theme.shutdown, "saving");
  const boot = toSteps(funMode ? funBoot : theme.boot, "rebooting");

  switch (action) {
    case "shutdown":
      return { steps: shutdown, terminal: "off" };
    case "restart":
      return { steps: [...shutdown, ...boot], terminal: "desktop" };
    case "lock":
      return { steps: toSteps(funMode ? funLock : theme.lock, "locking"), terminal: "locked" };
    case "update":
      return {
        steps: [...toSteps(funMode ? funUpdate : theme.update, "updating"), ...boot],
        terminal: "desktop",
      };
  }
}

export const actionLabels: Record<PowerAction, string> = {
  shutdown: "Pretend to shut down",
  restart: "Restart PretendPro",
  lock: "Lock pretend screen",
  update: "Update pretend software",
};

export const actionShortcuts: Record<PowerAction, string> = {
  shutdown: "⌘/Ctrl + ⇧ + Q",
  restart: "⌘/Ctrl + ⇧ + R",
  lock: "⌘/Ctrl + ⇧ + L",
  update: "⌘/Ctrl + ⇧ + U",
};

export const phaseLabels: Record<PowerPhase, string> = {
  idle: "Idle",
  locking: "Locking",
  saving: "Saving",
  updating: "Updating",
  rebooting: "Rebooting",
  off: "Off",
};

export const returnToasts: Record<PowerAction, { normal: string; fun: string }> = {
  shutdown: {
    normal: "Powered back on. Nothing has changed.",
    fun: "Back from the void. Your pretend work survived.",
  },
  restart: {
    normal: "Rebooted. Still nothing done.",
    fun: "Rebooted 12% faster at doing nothing.",
  },
  lock: {
    normal: "Unlocked. Your pretend work is safe.",
    fun: "Unlocked with a very serious password: hunter2.",
  },
  update: {
    normal: "Updated to a version that changes nothing.",
    fun: "PretendPro 3000.1 installed. The icons moved 1px.",
  },
};

/* ---------------------------------- settings --------------------------------- */

export type PowerSpeed = "slow" | "normal" | "fast" | "instant";

export type PowerSettings = {
  speed: PowerSpeed;
  sounds: boolean;
};

export const speedOrder: PowerSpeed[] = ["slow", "normal", "fast", "instant"];

export const speedMultipliers: Record<PowerSpeed, number> = {
  slow: 1.6,
  normal: 1,
  fast: 0.5,
  instant: 0.15,
};

export const BASE_STEP_MS = 1600;
export const BASE_OFF_BEAT_MS = 900;

const SETTINGS_KEY = "pretendpro:power-settings";

const defaultSettings: PowerSettings = { speed: "normal", sounds: false };

function parseSettings(raw: string | null): PowerSettings {
  if (!raw) return defaultSettings;
  try {
    const parsed = JSON.parse(raw) as Partial<PowerSettings>;
    return {
      speed: speedOrder.includes(parsed.speed as PowerSpeed)
        ? (parsed.speed as PowerSpeed)
        : defaultSettings.speed,
      sounds: typeof parsed.sounds === "boolean" ? parsed.sounds : defaultSettings.sounds,
    };
  } catch {
    return defaultSettings;
  }
}

/** Persisted power-sequence preferences (speed, pretend sounds). */
export function usePowerSettings(): {
  settings: PowerSettings;
  update: (patch: Partial<PowerSettings>) => void;
} {
  const [settings, setSettings] = useState<PowerSettings>(defaultSettings);

  useEffect(() => {
    try {
      setSettings(parseSettings(window.localStorage.getItem(SETTINGS_KEY)));
    } catch {
      // storage blocked: keep defaults
    }
  }, []);

  const update = useCallback((patch: Partial<PowerSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { settings, update };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Tiny synthesized blip; no audio assets, and silent unless the user opts in. */
export function playPretendChime(kind: "down" | "up"): void {
  type AudioWindow = Window & {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  const ctor =
    typeof window === "undefined"
      ? undefined
      : ((window as AudioWindow).AudioContext ?? (window as AudioWindow).webkitAudioContext);
  if (!ctor) return;
  try {
    const ctx = new ctor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const [from, to] = kind === "up" ? [220, 660] : [660, 180];
    osc.frequency.setValueAtTime(from, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(to, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.42);
    osc.onended = () => void ctx.close();
  } catch {
    // audio blocked: pretending silently is fine
  }
}
