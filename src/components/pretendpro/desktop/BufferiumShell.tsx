import { useState } from "react";
import { Circle, Keyboard } from "lucide-react";
import { apps } from "@/components/pretendpro/chrome";
import { cn } from "@/lib/utils";
import {
  AppLauncherGrid,
  Popover,
  ThemeSwitchLinks,
  TrayGlyphs,
  licenseJoke,
  useClock,
  type ShellProps,
} from "./shell-shared";

export function BufferiumShell({
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
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>

      <div className="relative z-30 flex items-center gap-2 border-t border-border/50 bg-[var(--os-chrome)] px-3 py-2 backdrop-blur">
        <button
          onClick={() => setLauncherOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card hover:bg-muted"
          aria-label="Open launcher"
          aria-expanded={launcherOpen}
        >
          <Circle className="h-4 w-4 text-primary" />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                className="flex flex-col items-center"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                    app.chip,
                    isActive ? "ring-2 ring-primary" : isRunning && "ring-1 ring-primary/40",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span
                  className={cn(
                    "mt-1 h-1 w-4 rounded-full transition-colors duration-200",
                    isActive ? "bg-primary" : isRunning ? "bg-primary/40" : "bg-transparent",
                  )}
                />
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onShowShortcuts}
            className="rounded-md p-1 text-foreground/60 hover:bg-muted"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTrayOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1 text-xs hover:bg-muted"
            aria-expanded={trayOpen}
          >
            <TrayGlyphs />
            <span className="font-semibold text-foreground/80">{clock}</span>
          </button>
        </div>

        <Popover
          open={launcherOpen}
          onClose={() => setLauncherOpen(false)}
          className="bottom-16 left-3 w-[19rem] p-3"
        >
          <button
            onClick={() => {
              setLauncherOpen(false);
              onOpenPalette();
            }}
            className="mb-3 w-full rounded-full border border-border bg-card px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted"
          >
            Search your pretend apps… (Ctrl+K)
          </button>
          <AppLauncherGrid active={active} onSelect={onSelect} />
        </Popover>

        <Popover
          open={trayOpen}
          onClose={() => setTrayOpen(false)}
          className="bottom-16 right-3 w-64 p-3"
        >
          <p className="text-xs font-bold text-popover-foreground">Quick settings</p>
          <button
            onClick={onToggleFunMode}
            className="mt-2 w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          >
            Fun Mode: {funMode ? "On" : "Off"} (A)
          </button>
          <ThemeSwitchLinks osTheme={osTheme} active={active} />
          <p className="mt-2 border-t border-border pt-2 text-[11px] text-muted-foreground">
            {licenseJoke}
          </p>
        </Popover>
      </div>
    </div>
  );
}
