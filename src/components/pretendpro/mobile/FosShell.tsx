import { ChevronLeft, Layers } from "lucide-react";
import { StatusBar } from "./StatusBar";
import { NavButton, SystemMenu, type MobileShellProps } from "./shell-shared";

/** Cupertino-style phone chrome: notch status bar, in-app back chevron, home indicator. */
export function FosShell({
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
        <div className="grid h-11 shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center border-b border-border/50 bg-[var(--os-surface)] px-2 backdrop-blur">
          <button
            onClick={onBack}
            className="flex items-center gap-0.5 justify-self-start rounded px-1 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <span className="truncate text-sm font-semibold text-foreground">{appName}</span>
          <NavButton label="App switcher" onClick={onRecents} className="w-10 justify-self-end">
            <Layers className="h-4 w-4" />
          </NavButton>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>

      <div className="flex h-10 shrink-0 items-center justify-center bg-transparent">
        <button
          onClick={onHome}
          onDoubleClick={onRecents}
          aria-label="Home indicator: tap for home, double tap for the app switcher"
          className="h-1.5 w-32 rounded-full bg-foreground/50 transition-colors hover:bg-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}
