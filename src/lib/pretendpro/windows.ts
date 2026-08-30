import { useCallback, useEffect, useRef, useState } from "react";
import { apps, type AppId } from "@/components/pretendpro/chrome";

export type WindowState = {
  id: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
};

export type Bounds = { width: number; height: number };

/** Zones a dragged window can dock into when released near a desktop edge. */
export type DockZone = "left" | "right" | "top" | "bottom" | null;

export const GRID = 16;
export const EDGE_THRESHOLD = 28;

const DEFAULT_SIZE = { width: 860, height: 540 };
const CASCADE = 2 * GRID;

const appIds = apps.map((a) => a.id);

export function snapToGrid(value: number): number {
  return Math.round(value / GRID) * GRID;
}

/** Which dock zone a pointer position falls into, or null when away from edges. */
export function dockZoneFor(pointerX: number, pointerY: number, bounds: Bounds): DockZone {
  if (pointerY <= EDGE_THRESHOLD) return "top";
  if (pointerY >= bounds.height - EDGE_THRESHOLD) return "bottom";
  if (pointerX <= EDGE_THRESHOLD) return "left";
  if (pointerX >= bounds.width - EDGE_THRESHOLD) return "right";
  return null;
}

export function dockRect(zone: Exclude<DockZone, null>, bounds: Bounds) {
  const half = { width: Math.round(bounds.width / 2), height: Math.round(bounds.height / 2) };
  switch (zone) {
    case "left":
      return { x: 0, y: 0, width: half.width, height: bounds.height };
    case "right":
      return { x: half.width, y: 0, width: bounds.width - half.width, height: bounds.height };
    case "top":
      return { x: 0, y: 0, width: bounds.width, height: bounds.height };
    case "bottom":
      return { x: 0, y: half.height, width: bounds.width, height: bounds.height - half.height };
  }
}

export const dockZoneLabels: Record<Exclude<DockZone, null>, string> = {
  left: "left half",
  right: "right half",
  top: "maximized",
  bottom: "bottom half",
};

function defaultWindow(id: AppId, openCount: number, bounds: Bounds): WindowState {
  const width = Math.min(DEFAULT_SIZE.width, Math.max(320, bounds.width - 48));
  const height = Math.min(DEFAULT_SIZE.height, Math.max(260, bounds.height - 64));
  const baseX = Math.max(12, (bounds.width - width) / 2);
  const baseY = Math.max(12, (bounds.height - height) / 2 - 20);
  const offset = openCount * CASCADE;
  return {
    id,
    x: snapToGrid(Math.max(8, Math.min(baseX + offset - CASCADE, bounds.width - width - 8))),
    y: snapToGrid(Math.max(8, Math.min(baseY + offset - CASCADE, bounds.height - 80))),
    width,
    height,
    minimized: false,
    maximized: false,
  };
}

export type WindowManager = {
  windows: WindowState[];
  order: AppId[];
  focused: AppId | null;
  openApps: AppId[];
  zIndexOf: (id: AppId) => number;
  launch: (id: AppId, bounds: Bounds) => void;
  focus: (id: AppId) => void;
  close: (id: AppId) => void;
  minimize: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  move: (id: AppId, x: number, y: number) => void;
  resize: (id: AppId, width: number, height: number) => void;
  dock: (id: AppId, zone: Exclude<DockZone, null>, bounds: Bounds) => void;
  cycle: (delta: number) => void;
  restored: boolean;
};

type PersistedLayout = { windows: WindowState[]; order: AppId[] };

function isAppId(value: unknown): value is AppId {
  return typeof value === "string" && appIds.includes(value as AppId);
}

function parseLayout(raw: string | null): PersistedLayout | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const candidate = parsed as { windows?: unknown; order?: unknown };
    if (!Array.isArray(candidate.windows) || !Array.isArray(candidate.order)) return null;
    const windows = candidate.windows.filter((w): w is WindowState => {
      const win = w as Partial<WindowState>;
      return (
        isAppId(win.id) &&
        typeof win.x === "number" &&
        typeof win.y === "number" &&
        typeof win.width === "number" &&
        typeof win.height === "number" &&
        typeof win.minimized === "boolean" &&
        typeof win.maximized === "boolean"
      );
    });
    const order = candidate.order.filter(isAppId);
    return { windows, order };
  } catch {
    return null;
  }
}

/**
 * Tiny window manager: list of window states plus a z-order stack.
 * The last entry of `order` that is not minimized is the focused window.
 * Layout (position, size, z-order) is persisted per OS theme in localStorage.
 */
export function useWindowManager(storageKey?: string): WindowManager {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [order, setOrder] = useState<AppId[]>([]);
  const [restored, setRestored] = useState(false);
  const hydrated = useRef(false);
  const [ready, setReady] = useState(!storageKey);

  // Hydrate after mount so SSR markup and the first client render match.
  useEffect(() => {
    if (hydrated.current || !storageKey) return;
    hydrated.current = true;
    const layout = parseLayout(window.localStorage.getItem(storageKey));
    if (layout && layout.windows.length > 0) {
      setWindows(layout.windows);
      setOrder(layout.order);
      setRestored(true);
    }
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || !ready) return;
    const payload: PersistedLayout = { windows, order };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [order, ready, storageKey, windows]);

  const visibleOrder = order.filter((id) => {
    const w = windows.find((win) => win.id === id);
    return w && !w.minimized;
  });
  const focused = visibleOrder.length > 0 ? (visibleOrder[visibleOrder.length - 1] ?? null) : null;

  const raise = useCallback((id: AppId) => {
    setOrder((prev) => [...prev.filter((x) => x !== id), id]);
  }, []);

  const patch = useCallback((id: AppId, next: Partial<WindowState>) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...next } : w)));
  }, []);

  const launch = useCallback(
    (id: AppId, bounds: Bounds) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === id);
        if (existing) {
          return prev.map((w) => (w.id === id ? { ...w, minimized: false } : w));
        }
        return [...prev, defaultWindow(id, prev.length, bounds)];
      });
      raise(id);
    },
    [raise],
  );

  const close = useCallback((id: AppId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setOrder((prev) => prev.filter((x) => x !== id));
  }, []);

  const minimize = useCallback(
    (id: AppId) => {
      patch(id, { minimized: true });
    },
    [patch],
  );

  const toggleMaximize = useCallback(
    (id: AppId) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized, minimized: false } : w)),
      );
      raise(id);
    },
    [raise],
  );

  const dock = useCallback(
    (id: AppId, zone: Exclude<DockZone, null>, bounds: Bounds) => {
      const rect = dockRect(zone, bounds);
      patch(id, { ...rect, maximized: zone === "top", minimized: false });
      raise(id);
    },
    [patch, raise],
  );

  const cycle = useCallback(
    (delta: number) => {
      const running = appIds.filter((id) => windows.some((w) => w.id === id));
      if (running.length < 2) return;
      const current = focused ? running.indexOf(focused) : -1;
      const next = running[(current + delta + running.length) % running.length];
      if (!next) return;
      patch(next, { minimized: false });
      raise(next);
    },
    [focused, patch, raise, windows],
  );

  return {
    windows,
    order,
    focused,
    openApps: appIds.filter((id) => windows.some((w) => w.id === id)),
    zIndexOf: (id) => 10 + Math.max(order.indexOf(id), 0),
    launch,
    focus: raise,
    close,
    minimize,
    toggleMaximize,
    move: (id, x, y) => patch(id, { x: snapToGrid(x), y: snapToGrid(y) }),
    resize: (id, width, height) => patch(id, { width: snapToGrid(width), height: snapToGrid(height) }),
    dock,
    cycle,
    restored,
  };
}
