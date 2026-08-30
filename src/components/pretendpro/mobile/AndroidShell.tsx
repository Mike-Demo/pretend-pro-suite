import { ChevronLeft, Circle, Square } from "lucide-react";
import { StatusBar } from "./StatusBar";
import { NavButton, SystemMenu, type MobileShellProps } from "./shell-shared";

/** Material-style phone chrome: status bar on top, back / home / recents below. */
export function AndroidShell({
  osTheme,
  active,
  appName,
  view,
  clock,
  funMode,
  onToggleFunMode,
  onShowShortcuts,
  onOpenPalette,
  onHome,
  onBack,
  onRecents,
  children,
}: MobileShellProps) {
  return (
    <div className="flex h-full flex-col">
      <StatusBar osTheme={osTheme} clock={clock}>
        <SystemMenu
          osTheme={osTheme}
          active={active}
          funMode={funMode}
          onToggleFunMode={onToggleFunMode}
          onShowShortcuts={onShowShortcuts}
          onOpenPalette={onOpenPalette}
        />
      </StatusBar>

      {view === "app" && (
        <div className="flex h-12 shrink-0 items-center gap-2 bg-[var(--os-surface)] px-2 shadow-[var(--os-elevation)]">
          <NavButton label="Back" onClick={onBack} className="w-10">
            <ChevronLeft className="h-5 w-5" />
          </NavButton>
          <span className="truncate text-sm font-semibold text-foreground">{appName}</span>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>

      <div className="flex h-14 shrink-0 items-center justify-around bg-[var(--os-statusbar)] px-6 backdrop-blur">
        <NavButton label="Back" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </NavButton>
        <NavButton label="Home" onClick={onHome}>
          <Circle className="h-4 w-4" />
        </NavButton>
        <NavButton label="Recent apps" onClick={onRecents}>
          <Square className="h-3.5 w-3.5" />
        </NavButton>
      </div>
    </div>
  );
}
