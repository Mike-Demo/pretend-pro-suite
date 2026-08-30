import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { WindowFrame, type OsTheme } from "@/components/pretendpro/WindowFrame";
import { StuckProgress } from "@/components/pretendpro/chrome";
import type { Bounds, WindowState } from "@/lib/pretendpro/windows";
import { cn } from "@/lib/utils";

const MIN_WIDTH = 300;
const MIN_HEIGHT = 220;

type DragKind = "move" | "resize";

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
  children,
}: {
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
  children: ReactNode;
}) {
  const drag = useRef<{
    kind: DragKind;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const beginDrag = (kind: DragKind) => (e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    onFocus();
    if (state.maximized) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      kind,
      startX: e.clientX,
      startY: e.clientY,
      originX: kind === "move" ? state.x : state.width,
      originY: kind === "move" ? state.y : state.height,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (d.kind === "move") {
      const x = Math.min(
        Math.max(d.originX + dx, 120 - state.width),
        Math.max(bounds.width - 120, 0),
      );
      const y = Math.min(Math.max(d.originY + dy, 0), Math.max(bounds.height - 48, 0));
      onMove(Math.round(x), Math.round(y));
    } else {
      onResize(
        Math.round(Math.max(MIN_WIDTH, Math.min(d.originX + dx, bounds.width - state.x))),
        Math.round(Math.max(MIN_HEIGHT, Math.min(d.originY + dy, bounds.height - state.y))),
      );
    }
  };

  const endDrag = (e: ReactPointerEvent<HTMLElement>) => {
    if (drag.current) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      drag.current = null;
    }
  };

  const maximized = state.maximized;

  return (
    <div
      role="dialog"
      aria-label={appName}
      onPointerDown={onFocus}
      style={
        maximized
          ? { zIndex }
          : { zIndex, left: state.x, top: state.y, width: state.width, height: state.height }
      }
      className={cn(
        "absolute flex flex-col",
        maximized && "inset-2",
        "motion-safe:animate-scale-in",
        funMode && "motion-safe:transition-transform",
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
        onTitlePointerDown={beginDrag("move")}
        className="h-full"
      >
        <div
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="contents"
        />
        {children}
        {funMode && <StuckProgress />}
      </WindowFrame>

      {!maximized && (
        <button
          aria-label={`Resize ${appName}`}
          onPointerDown={beginDrag("resize")}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="absolute -bottom-1 -right-1 h-5 w-5 cursor-nwse-resize touch-none rounded-br-[var(--os-radius)] border-b-2 border-r-2 border-border/70 bg-transparent"
        />
      )}
    </div>
  );
}
