import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { OsTheme } from "@/components/pretendpro/WindowFrame";
import { PowerOverlay, type OverlayMode } from "@/components/pretendpro/PowerOverlay";
import {
  BASE_OFF_BEAT_MS,
  BASE_STEP_MS,
  playPretendChime,
  returnToasts,
  sequenceFor,
  speedMultipliers,
  usePowerSettings,
  type PowerAction,
  type PowerPhase,
  type PowerSettings,
} from "@/lib/pretendpro/power";
import { PowerPalette } from "./PowerPalette";
import { PowerSettingsDialog } from "./PowerSettingsDialog";

type Run = { action: PowerAction; index: number; mode: OverlayMode };

type PowerContextValue = {
  phase: PowerPhase;
  active: boolean;
  start: (action: PowerAction) => void;
  cancel: () => void;
  openPalette: () => void;
  openSettings: () => void;
  settings: PowerSettings;
  updateSettings: (patch: Partial<PowerSettings>) => void;
};

const PowerContext = createContext<PowerContextValue | null>(null);

export function usePower(): PowerContextValue {
  const ctx = useContext(PowerContext);
  if (!ctx) throw new Error("usePower must be used inside PowerProvider");
  return ctx;
}

/**
 * Owns the pretend power state machine for one OS page: sequences, terminal
 * screens, settings, the shortcut palette and the overlay itself.
 */
export function PowerProvider({
  osTheme,
  funMode,
  children,
}: {
  osTheme: OsTheme;
  funMode: boolean;
  children: ReactNode;
}) {
  const { settings, update: updateSettings } = usePowerSettings();
  const [run, setRun] = useState<Run | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const multiplier = speedMultipliers[settings.speed];
  const sequence = useMemo(
    () => (run ? sequenceFor(osTheme, run.action, funMode) : null),
    [funMode, osTheme, run],
  );

  const chime = useCallback(
    (kind: "down" | "up") => {
      if (settings.sounds) playPretendChime(kind);
    },
    [settings.sounds],
  );

  const finish = useCallback(
    (action: PowerAction) => {
      setRun(null);
      chime("up");
      const copy = returnToasts[action];
      toast(funMode ? copy.fun : copy.normal);
    },
    [chime, funMode],
  );

  const start = useCallback(
    (action: PowerAction) => {
      setPaletteOpen(false);
      setRun({ action, index: 0, mode: "running" });
      chime("down");
    },
    [chime],
  );

  const cancel = useCallback(() => setRun(null), []);

  // Advance through the message list, then settle on the terminal screen.
  useEffect(() => {
    if (!run || !sequence || run.mode !== "running") return;
    const stepMs = Math.max(180, BASE_STEP_MS * multiplier);

    if (run.index < sequence.steps.length - 1) {
      const id = window.setTimeout(
        () => setRun((prev) => (prev ? { ...prev, index: prev.index + 1 } : prev)),
        stepMs,
      );
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => {
      if (sequence.terminal === "desktop") {
        window.setTimeout(() => finish(run.action), Math.max(120, BASE_OFF_BEAT_MS * multiplier));
        setRun((prev) => (prev ? { ...prev, mode: "off" } : prev));
      } else {
        setRun((prev) =>
          prev ? { ...prev, mode: sequence.terminal === "off" ? "off" : "locked" } : prev,
        );
      }
    }, stepMs);
    return () => window.clearTimeout(id);
  }, [finish, multiplier, run, sequence]);

  /** Terminal screens wait for the user: shutdown boots, lock unlocks. */
  const wake = useCallback(() => {
    if (!run) return;
    if (run.mode === "locked") {
      finish("lock");
      return;
    }
    if (run.action === "shutdown") {
      const shutdownLength = sequenceFor(osTheme, "shutdown", funMode).steps.length;
      chime("up");
      setRun({ action: "restart", index: shutdownLength, mode: "running" });
      return;
    }
    finish(run.action);
  }, [chime, finish, funMode, osTheme, run]);

  // Waking from the black screen also responds to the keyboard.
  useEffect(() => {
    if (!run) return;
    const onKey = (e: KeyboardEvent) => {
      if (run.mode === "running") {
        if (e.key === "Escape") cancel();
        return;
      }
      e.preventDefault();
      wake();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cancel, run, wake]);

  // Universal power shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || !e.shiftKey) return;
      const key = e.key.toLowerCase();
      const map: Record<string, PowerAction> = {
        q: "shutdown",
        r: "restart",
        l: "lock",
        u: "update",
      };
      if (key === "p") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      const action = map[key];
      if (action) {
        e.preventDefault();
        start(action);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start]);

  const phase: PowerPhase = !run
    ? "idle"
    : run.mode === "off"
      ? "off"
      : run.mode === "locked"
        ? "locking"
        : (sequence?.steps[run.index]?.phase ?? "saving");

  const value = useMemo<PowerContextValue>(
    () => ({
      phase,
      active: run !== null,
      start,
      cancel,
      openPalette: () => setPaletteOpen(true),
      openSettings: () => setSettingsOpen(true),
      settings,
      updateSettings,
    }),
    [cancel, phase, run, settings, start, updateSettings],
  );

  return (
    <PowerContext.Provider value={value}>
      {children}
      {run && (
        <PowerOverlay
          osTheme={osTheme}
          mode={run.mode}
          message={
            sequence?.steps[Math.min(run.index, (sequence.steps.length || 1) - 1)]?.label ?? ""
          }
          phase={phase}
          onCancel={cancel}
          onWake={wake}
        />
      )}
      <PowerPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onRun={start}
        onOpenSettings={() => {
          setPaletteOpen(false);
          setSettingsOpen(true);
        }}
      />
      <PowerSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
      />
    </PowerContext.Provider>
  );
}
