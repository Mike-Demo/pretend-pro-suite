import { useCallback, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { WindowFrame, type OsTheme } from "@/components/pretendpro/WindowFrame";
import { StuckProgress } from "@/components/pretendpro/chrome";
import type { Bounds, WindowState } from "@/lib/pretendpro/windows";
import { cn } from "@/lib/utils";

const MIN_WIDTH = 300;
const MIN_HEIGHT = 220;

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

      const onPointerMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (kind === "move") {
          const x = Math.min(
            Math.max(originX + dx, 120 - state.width),
            Math.max(bounds.width - 120, 0),
          );
          const y = Math.min(Math.max(originY + dy, 0), Math.max(bounds.height - 48, 0));
          onMove(Math.round(x), Math.round(y));
        } else {
          onResize(
            Math.round(Math.max(MIN_WIDTH, Math.min(originX + dx, bounds.width - state.x))),
            Math.round(Math.max(MIN_HEIGHT, Math.min(originY + dy, bounds.height - state.y))),
          );
        }
      };

      const stop = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", stop);
        window.removeEventListener("pointercancel", stop);
        document.body.classList.remove("select-none");
      };

      document.body.classList.add("select-none");
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
    },
    [bounds.height, bounds.width, onFocus, onMove, onResize, state],
  );

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
        className="h-full"
      >
        {children}
        {funMode && <StuckProgress />}
      </WindowFrame>

      {!maximized && (
        <button
          aria-label={`Resize ${appName}`}
          onPointerDown={(e) => startDrag("resize", e)}
          className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize touch-none rounded-br-[var(--os-radius)] border-b-2 border-r-2 border-border/70"
        />
      )}
    </div>
  );
}
