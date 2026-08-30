import { useState } from "react";
import { LayoutGrid, Keyboard, Search } from "lucide-react";
import { PowerMenuItems } from "@/components/pretendpro/power/PowerMenuItems";
import { PowerStatus } from "@/components/pretendpro/power/PowerStatus";
import { apps } from "@/components/pretendpro/chrome";
import { cn } from "@/lib/utils";
import { AppearanceToggle } from "@/components/pretendpro/AppearanceToggle";
import {
  AppLauncherGrid,
  Popover,
  ThemeSwitchLinks,
  TrayGlyphs,
  licenseJoke,
  useClock,
  type ShellProps,
} from "./shell-shared";

/**
 * Windows-flavoured shell styled with Fluent 2 conventions: centered taskbar,
 * active-app underline indicator, acrylic surfaces and shadow16 flyouts.
 */
export function AppertureShell({
  osTheme,
  active,
  onSelect,
  openApps,
  focusedApp,
  funMode,
  onToggleFunMode,
  onShowShortcuts,
  onOpenPalette,
  children,
}: ShellProps) {
  const clock = useClock();
  const [startOpen, setStartOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);

  const taskbarButton =
    "fluent-focus relative flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:bg-foreground/[0.06] active:bg-foreground/[0.04]";

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>

      <div className="relative z-50 flex h-12 items-center gap-1 border-t border-border/60 bg-[var(--os-chrome)] px-2 backdrop-blur-2xl">
        {/* Left: search (Fluent taskbar search box) */}
        <button
          onClick={onOpenPalette}
          className="fluent-focus hidden items-center gap-2 rounded border border-border bg-card/80 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-card sm:flex"
        >
          <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
          Search apps (Ctrl+K)
        </button>

        {/* Center: Start + pinned apps */}
        <div className="absolute left-1/2 flex max-w-[60%] -translate-x-1/2 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setStartOpen((v) => !v)}
            className={cn(taskbarButton, startOpen && "bg-foreground/[0.08]")}
            aria-expanded={startOpen}
            aria-label="Start"
          >
            <LayoutGrid className="h-4 w-4 text-primary" strokeWidth={1.75} />
            <span className="hidden sm:inline">Start</span>
          </button>

          {apps.map((app) => {
            const Icon = app.icon;
            const isRunning = openApps.includes(app.id);
            const isActive = app.id === focusedApp;
            return (
              <button
                key={app.id}
                onClick={() => onSelect(app.id)}
                title={app.name}
                aria-label={app.name}
                aria-pressed={isActive}
                className={cn(
                  taskbarButton,
                  isActive ? "bg-foreground/[0.08]" : isRunning && "bg-foreground/[0.04]",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                <span className="hidden lg:inline">{app.name}</span>
                <span
                  className={cn(
                    "absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-primary transition-all duration-200",
                    isActive ? "w-4 opacity-100" : isRunning ? "w-1.5 opacity-70" : "w-0 opacity-0",
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Right: tray */}
        <div className="ml-auto flex items-center gap-1">
          <PowerStatus />
          <button
            onClick={onShowShortcuts}
            className="fluent-focus rounded p-1.5 text-foreground/70 hover:bg-foreground/[0.06]"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => setTrayOpen((v) => !v)}
            className="fluent-focus flex items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-foreground/[0.06]"
            aria-expanded={trayOpen}
          >
            <TrayGlyphs />
            <span className="font-medium text-foreground/90">{clock}</span>
          </button>
        </div>

        <Popover
          open={startOpen}
          onClose={() => setStartOpen(false)}
          className="fluent-flyout bottom-14 left-1/2 w-[20rem] -translate-x-1/2 p-4 sm:left-2 sm:translate-x-0"
        >
          <p className="mb-2 text-[11px] font-semibold text-muted-foreground">Pinned</p>
          <AppLauncherGrid active={active} onSelect={onSelect} />
          <div className="mt-3 border-t border-border pt-2">
            <button
              onClick={onToggleFunMode}
              className="fluent-focus w-full rounded px-2 py-1.5 text-left text-xs hover:bg-muted"
            >
              {funMode ? "Disable" : "Enable"} Fun Mode (A)
            </button>
            <AppearanceToggle />
            <ThemeSwitchLinks osTheme={osTheme} active={active} />
          </div>
        </Popover>

        <Popover
          open={trayOpen}
          onClose={() => setTrayOpen(false)}
          className="fluent-flyout bottom-14 right-2 w-64 p-4"
        >
          <p className="text-xs font-semibold text-popover-foreground">PretendPro status</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{licenseJoke}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Network: pretending to be online.
          </p>
          <div className="mt-2 border-t border-border pt-2">
            <PowerMenuItems onDone={() => setTrayOpen(false)} itemClassName="fluent-focus" />
          </div>
        </Popover>
      </div>
    </div>
  );
}
