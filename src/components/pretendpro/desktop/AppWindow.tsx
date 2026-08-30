import {
  useCallback,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { WindowFrame, type OsTheme } from "@/components/pretendpro/WindowFrame";
import { StuckProgress } from "@/components/pretendpro/chrome";
import {
  dockRect,
  dockZoneFor,
  dockZoneLabels,
  GRID,
  snapToGrid,
  type Bounds,
  type DockZone,
  type WindowState,
} from "@/lib/pretendpro/windows";
import { cn } from "@/lib/utils";

const MIN_WIDTH = 304;
const MIN_HEIGHT = 224;

type Props = {
  osTheme: OsTheme;
  state: WindowState;
  appName: string;
  focused: boolean;
  funMode: boolean;
  zIndex: number;
  bounds: Bounds;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  onDock: (zone: Exclude<DockZone, null>) => void;
  onAnnounce: (message: string) => void;
  children: ReactNode;
};

export function AppWindow({
  osTheme,
  state,
  appName,
  focused,
  funMode,
  zIndex,
  bounds,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
  onResize,
  onDock,
  onAnnounce,
  children,
}: Props) {
  const [previewZone, setPreviewZone] = useState<DockZone>(null);

  const startDrag = useCallback(
    (kind: "move" | "resize", e: ReactPointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      onFocus();
      if (state.maximized) return;
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      const originX = kind === "move" ? state.x : state.width;
      const originY = kind === "move" ? state.y : state.height;
      const areaRect = e.currentTarget.closest("[data-desktop-area]")?.getBoundingClientRect();
      let zone: DockZone = null;

      const onPointerMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (kind === "move") {
          const x = Math.min(
            Math.max(originX + dx, 120 - state.width),
            Math.max(bounds.width - 120, 0),
          );
          const y = Math.min(Math.max(originY + dy, 0), Math.max(bounds.height - 48, 0));
          onMove(snapToGrid(x), snapToGrid(y));
          if (areaRect) {
            zone = dockZoneFor(ev.clientX - areaRect.left, ev.clientY - areaRect.top, bounds);
            setPreviewZone(zone);
          }
        } else {
          onResize(
            Math.max(MIN_WIDTH, Math.min(snapToGrid(originX + dx), bounds.width - state.x)),
            Math.max(MIN_HEIGHT, Math.min(snapToGrid(originY + dy), bounds.height - state.y)),
          );
        }
      };

      const stop = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", stop);
        window.removeEventListener("pointercancel", stop);
        document.body.classList.remove("select-none");
        setPreviewZone(null);
        if (kind === "move" && zone) {
          onDock(zone);
          onAnnounce(`${appName} docked ${dockZoneLabels[zone]}`);
        }
      };

      document.body.classList.add("select-none");
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
    },
    [appName, bounds.height, bounds.width, onAnnounce, onDock, onFocus, onMove, onResize, state],
  );

  const arrowDelta = (key: string): { dx: number; dy: number } | null => {
    switch (key) {
      case "ArrowLeft":
        return { dx: -GRID, dy: 0 };
      case "ArrowRight":
        return { dx: GRID, dy: 0 };
      case "ArrowUp":
        return { dx: 0, dy: -GRID };
      case "ArrowDown":
        return { dx: 0, dy: GRID };
      default:
        return null;
    }
  };

  const onTitleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const delta = arrowDelta(e.key);
    if (!delta) return;
    e.preventDefault();
    if (e.shiftKey) {
      const zone: Exclude<DockZone, null> =
        e.key === "ArrowLeft"
          ? "left"
          : e.key === "ArrowRight"
            ? "right"
            : e.key === "ArrowUp"
              ? "top"
              : "bottom";
      onDock(zone);
      onAnnounce(`${appName} docked ${dockZoneLabels[zone]}`);
      return;
    }
    if (state.maximized) return;
    const x = Math.max(0, Math.min(state.x + delta.dx, Math.max(bounds.width - GRID, 0)));
    const y = Math.max(0, Math.min(state.y + delta.dy, Math.max(bounds.height - GRID, 0)));
    onMove(x, y);
    onAnnounce(`${appName} at ${snapToGrid(x)}, ${snapToGrid(y)}`);
  };

  const onResizeKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    const delta = arrowDelta(e.key);
    if (!delta || state.maximized) return;
    e.preventDefault();
    const width = Math.max(
      MIN_WIDTH,
      Math.min(state.width + delta.dx, Math.max(bounds.width - state.x, MIN_WIDTH)),
    );
    const height = Math.max(
      MIN_HEIGHT,
      Math.min(state.height + delta.dy, Math.max(bounds.height - state.y, MIN_HEIGHT)),
    );
    onResize(width, height);
    onAnnounce(`${appName} sized ${snapToGrid(width)} by ${snapToGrid(height)} pixels`);
  };

  const maximized = state.maximized;
  const preview = previewZone ? dockRect(previewZone, bounds) : null;

  return (
    <>
      {preview && (
        <div
          aria-hidden="true"
          style={{
            zIndex: zIndex - 1,
            left: preview.x,
            top: preview.y,
            width: preview.width,
            height: preview.height,
          }}
          className="pointer-events-none absolute rounded-[var(--os-radius)] border-2 border-dashed border-primary/70 bg-primary/10"
        />
      )}
      <div
        role="dialog"
        aria-label={`${appName} window`}
        onPointerDown={onFocus}
        onFocus={onFocus}
        style={
          maximized
            ? { zIndex }
            : { zIndex, left: state.x, top: state.y, width: state.width, height: state.height }
        }
        className={cn(
          "absolute flex flex-col motion-safe:animate-scale-in",
          maximized && "inset-2",
          !focused && "opacity-95",
        )}
      >
        <WindowFrame
          osTheme={osTheme}
          appName={appName}
          focused={focused}
          onClose={onClose}
          onMinimize={onMinimize}
          onToggleMaximize={onToggleMaximize}
          onTitlePointerDown={(e) => startDrag("move", e)}
          onTitleKeyDown={onTitleKeyDown}
          titleBarLabel={`Move ${appName} window. Arrow keys move, Shift plus arrow keys dock to an edge.`}
          className="h-full"
        >
          {children}
          {funMode && <StuckProgress />}
        </WindowFrame>

        {!maximized && (
          <button
            type="button"
            aria-label={`Resize ${appName} window. Arrow keys change size in ${GRID} pixel steps.`}
            onPointerDown={(e) => startDrag("resize", e)}
            onKeyDown={onResizeKeyDown}
            className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize touch-none rounded-br-[var(--os-radius)] border-b-2 border-r-2 border-border/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        )}
      </div>
    </>
  );
}
