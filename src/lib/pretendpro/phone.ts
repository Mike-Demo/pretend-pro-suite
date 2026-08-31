import { useCallback, useEffect, useRef, useState } from "react";
import { apps, type AppId } from "@/components/pretendpro/chrome";

/** Which surface the phone is showing: launcher, an app, or the task switcher. */
export type PhoneView = "home" | "app" | "recents";

export type PhoneManager = {
  tasks: AppId[];
  foreground: AppId | null;
  view: PhoneView;
  restored: boolean;
  launch: (id: AppId) => void;
  goHome: () => void;
  showRecents: () => void;
  back: () => void;
  closeTask: (id: AppId) => void;
  cycle: (delta: number) => void;
};

const appIds: AppId[] = apps.map((a) => a.id);

function isAppId(value: unknown): value is AppId {
  return typeof value === "string" && appIds.includes(value as AppId);
}

function parseTasks(raw: string | null): AppId[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const candidate = (parsed as { tasks?: unknown }).tasks;
    if (!Array.isArray(candidate)) return null;
    const tasks = candidate.filter(isAppId);
    return Array.from(new Set(tasks));
  } catch {
    return null;
  }
}

/**
 * Phone task stack: no windows, just an ordered list of running apps where the
 * last entry is the foreground app. Persisted per edition in localStorage.
 */
export function usePhone(storageKey: string, initialApp?: AppId): PhoneManager {
  // Seeding the foreground app in the initial state (rather than a post-hydration
  // effect) puts the app surface in the very first render pass, removing one
  // client round trip in front of the phone's largest contentful paint.
  const [tasks, setTasks] = useState<AppId[]>(initialApp ? [initialApp] : []);
  const [view, setView] = useState<PhoneView>(initialApp ? "app" : "home");
  const [restored, setRestored] = useState(false);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  // Hydrate after mount so SSR markup and the first client render match.
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const parsed = parseTasks(window.localStorage.getItem(storageKey));
    if (parsed && parsed.length > 0) {
      setRestored(true);
      if (initialApp) {
        // The app the URL asked for always wins: keep the restored task stack
        // but bring the requested app to the foreground.
        setTasks([...parsed.filter((id) => id !== initialApp), initialApp]);
        setView("app");
      } else {
        setTasks(parsed);
        setView("home");
      }
    }
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ tasks }));
  }, [ready, storageKey, tasks]);

  const launch = useCallback((id: AppId) => {
    setTasks((prev) => [...prev.filter((x) => x !== id), id]);
    setView("app");
  }, []);

  const goHome = useCallback(() => setView("home"), []);
  const showRecents = useCallback(() => setView("recents"), []);

  const back = useCallback(() => {
    setView((prev) => (prev === "home" ? "home" : "home"));
  }, []);

  const closeTask = useCallback((id: AppId) => {
    setTasks((prev) => {
      const next = prev.filter((x) => x !== id);
      if (next.length === 0) setView("home");
      return next;
    });
  }, []);

  const cycle = useCallback(
    (delta: number) => {
      if (tasks.length < 2) return;
      const current = tasks.length - 1;
      const index = (current + delta + tasks.length) % tasks.length;
      const next = tasks[index];
      if (!next) return;
      setTasks((prev) => [...prev.filter((x) => x !== next), next]);
      setView("app");
    },
    [tasks],
  );

  return {
    tasks,
    foreground: tasks.length > 0 ? (tasks[tasks.length - 1] ?? null) : null,
    view,
    restored,
    launch,
    goHome,
    showRecents,
    back,
    closeTask,
    cycle,
  };
}
