import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import { Minus, Square, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type OsTheme = "fruit" | "apperture" | "bufferium";

export const osThemes: Array<{ id: OsTheme; name: string }> = [
  { id: "fruit", name: "Fruit" },
  { id: "apperture", name: "Apperture" },
  { id: "bufferium", name: "BufferiumOS" },
];

type BarProps = {
  appName: string;
  focused: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: ReactKeyboardEvent<HTMLDivElement>) => void;
  titleBarLabel?: string;
};

/** Shared props that make a title bar a keyboard-operable move handle. */
function grabProps({ onPointerDown, onKeyDown, titleBarLabel, onToggleMaximize }: BarProps) {
  return {
    onPointerDown,
    onKeyDown,
    onDoubleClick: onToggleMaximize,
    tabIndex: 0,
    role: "button" as const,
    "aria-label": titleBarLabel,
  };
}

function FruitBar({
  appName,
  focused,
  onClose,
  onMinimize,
  onToggleMaximize,
  onPointerDown,
}: BarProps) {
  const light = "h-3.5 w-3.5 rounded-full border border-foreground/10 transition-opacity";
  return (
    <div
      {...grabProps(props)}
      className={cn(
        "relative flex cursor-grab touch-none select-none items-center gap-2 rounded-t-[var(--os-radius)] border-b border-border/60 bg-[var(--os-titlebar)] px-3 py-2 backdrop-blur active:cursor-grabbing",
        !focused && "opacity-80",
      )}
    >
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onClose}
        aria-label={`Close ${appName}`}
        className={cn(light, focused ? "bg-bubblegum" : "bg-muted")}
      />
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onMinimize}
        aria-label={`Minimize ${appName}`}
        className={cn(light, focused ? "bg-butter" : "bg-muted")}
      />
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onToggleMaximize}
        aria-label={`Zoom ${appName}`}
        className={cn(light, focused ? "bg-mint" : "bg-muted")}
      />
      <span className="pointer-events-none absolute inset-x-0 text-center text-xs font-semibold text-foreground/70">
        {appName}
      </span>
    </div>
  );
}

function AppertureBar({
  appName,
  focused,
  onClose,
  onMinimize,
  onToggleMaximize,
  onPointerDown,
}: BarProps) {
  // Fluent 2 caption buttons: 46x32 hit targets, thin glyphs, red close hover.
  const btn =
    "fluent-focus flex h-8 w-[46px] items-center justify-center text-foreground/80 transition-colors hover:bg-foreground/10 active:bg-foreground/[0.06]";
  return (
    <div
      {...grabProps(props)}
      className={cn(
        "flex cursor-grab touch-none select-none items-center rounded-t-[var(--os-radius)] border-b border-border/70 bg-[var(--os-titlebar)] backdrop-blur-xl active:cursor-grabbing",
        !focused && "opacity-80",
      )}
    >
      <span className="px-3 text-xs font-semibold text-foreground/90">{appName}</span>
      <div className="ml-auto flex">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onMinimize}
          aria-label={`Minimize ${appName}`}
          className={btn}
        >
          <Minus className="h-3 w-3" strokeWidth={1.25} />
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onToggleMaximize}
          aria-label={`Maximize ${appName}`}
          className={btn}
        >
          <Square className="h-2.5 w-2.5" strokeWidth={1.25} />
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          aria-label={`Close ${appName}`}
          className={cn(
            btn,
            "rounded-tr-[var(--os-radius)] hover:bg-[oklch(0.55_0.22_25)] hover:text-white",
          )}
        >
          <X className="h-3 w-3" strokeWidth={1.25} />
        </button>
      </div>
    </div>
  );
}

function BufferiumBar({
  appName,
  focused,
  onClose,
  onToggleMaximize,
  onPointerDown,
}: BarProps) {
  return (
    <div
      {...grabProps(props)}
      className={cn(
        "flex cursor-grab touch-none select-none items-end gap-1 rounded-t-[var(--os-radius)] bg-[var(--os-titlebar)] px-2 pt-1.5 active:cursor-grabbing",
        !focused && "opacity-80",
      )}
    >
      <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-border/60 bg-card px-3 py-1.5">
        <span className="text-xs font-semibold text-foreground/80">{appName}</span>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          aria-label={`Close ${appName}`}
          className="flex h-4 w-4 items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}

export function WindowFrame({
  osTheme,
  appName,
  focused = true,
  onClose,
  onMinimize,
  onToggleMaximize,
  onTitlePointerDown,
  className,
  children,
}: {
  osTheme: OsTheme;
  appName: string;
  focused?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
  onTitlePointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  className?: string;
  children: ReactNode;
}) {
  const bar: BarProps = {
    appName,
    focused,
    onClose: onClose ?? (() => {}),
    onMinimize: onMinimize ?? (() => {}),
    onToggleMaximize: onToggleMaximize ?? (() => {}),
    onPointerDown: onTitlePointerDown ?? (() => {}),
  };

  return (
    <div
      data-os-theme={osTheme}
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-[var(--os-radius)] bg-card transition-shadow duration-200",
        osTheme === "apperture"
          ? "fluent-elevated border border-border"
          : "border-2 border-border",
        focused ? "shadow-2xl" : "shadow-md",
        className,
      )}
    >
      {osTheme === "fruit" && <FruitBar {...bar} />}
      {osTheme === "apperture" && <AppertureBar {...bar} />}
      {osTheme === "bufferium" && <BufferiumBar {...bar} />}
      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">{children}</div>
    </div>
  );
}
