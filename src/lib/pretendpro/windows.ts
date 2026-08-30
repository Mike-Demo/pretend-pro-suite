import { useCallback, useState } from "react";
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

const DEFAULT_SIZE = { width: 860, height: 540 };
const CASCADE = 34;

function defaultWindow(id: AppId, openCount: number, bounds: Bounds): WindowState {
  const width = Math.min(DEFAULT_SIZE.width, Math.max(320, bounds.width - 48));
  const height = Math.min(DEFAULT_SIZE.height, Math.max(260, bounds.height - 64));
  const baseX = Math.max(12, (bounds.width - width) / 2);
  const baseY = Math.max(12, (bounds.height - height) / 2 - 20);
  const offset = openCount * CASCADE;
  return {
    id,
    x: Math.max(8, Math.min(baseX + offset - CASCADE, bounds.width - width - 8)),
    y: Math.max(8, Math.min(baseY + offset - CASCADE, bounds.height - 80)),
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
  cycle: (delta: number) => void;
};

/**
 * Tiny window manager: list of window states plus a z-order stack.
 * The last entry of `order` that is not minimized is the focused window.
 */
export function useWindowManager(): WindowManager {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [order, setOrder] = useState<AppId[]>([]);

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

  const cycle = useCallback(
    (delta: number) => {
      const running = apps.map((a) => a.id).filter((id) => windows.some((w) => w.id === id));
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
    openApps: apps.map((a) => a.id).filter((id) => windows.some((w) => w.id === id)),
    zIndexOf: (id) => 10 + Math.max(order.indexOf(id), 0),
    launch,
    focus: raise,
    close,
    minimize,
    toggleMaximize,
    move: (id, x, y) => patch(id, { x, y }),
    resize: (id, width, height) => patch(id, { width, height }),
    cycle,
  };
}
