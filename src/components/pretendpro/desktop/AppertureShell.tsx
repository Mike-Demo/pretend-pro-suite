import { useState } from "react";
import { LayoutGrid, Keyboard, Search } from "lucide-react";
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

export function AppertureShell({
  osTheme,
  active,
  onSelect,
  animated,
  onToggleAnimated,
  onShowShortcuts,
  onOpenPalette,
  children,
}: ShellProps) {
  const clock = useClock();
  const [startOpen, setStartOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-3 pb-24 pt-4 sm:px-6">{children}</div>

      <div className="relative z-30 flex items-center gap-1 border-t border-border/50 bg-[var(--os-chrome)] px-2 py-1.5 backdrop-blur">
        <button
          onClick={() => setStartOpen((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold hover:bg-muted",
            startOpen && "bg-muted",
          )}
          aria-expanded={startOpen}
        >
          <LayoutGrid className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Start</span>
        </button>
        <button
          onClick={onOpenPalette}
          className="hidden items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted sm:flex"
        >
          <Search className="h-3.5 w-3.5" />
          Search apps (Ctrl+K)
        </button>

        <div className="flex items-center gap-1">
          {apps.map((app) => {
            const Icon = app.icon;
            const isActive = app.id === active;
            return (
              <button
                key={app.id}
                onClick={() => onSelect(app.id)}
                title={app.name}
                aria-label={app.name}
                aria-pressed={isActive}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-muted",
                  isActive && "bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{app.name}</span>
                <span
                  className={cn(
                    "absolute inset-x-1.5 bottom-0 h-0.5 rounded-full",
                    isActive ? "bg-primary" : "bg-transparent",
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
            className="flex items-center gap-2 rounded-md px-2 py-1 text-xs hover:bg-muted"
            aria-expanded={trayOpen}
          >
            <TrayGlyphs />
            <span className="font-semibold text-foreground/80">{clock}</span>
          </button>
        </div>

        <Popover
          open={startOpen}
          onClose={() => setStartOpen(false)}
          className="bottom-14 left-2 w-[19rem] p-3"
        >
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Pinned
          </p>
          <AppLauncherGrid active={active} onSelect={onSelect} />
          <div className="mt-3 border-t border-border pt-2">
            <button
              onClick={onToggleAnimated}
              className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
            >
              {animated ? "Disable" : "Enable"} Animation Mode (A)
            </button>
            <ThemeSwitchLinks osTheme={osTheme} active={active} />
          </div>
        </Popover>

        <Popover
          open={trayOpen}
          onClose={() => setTrayOpen(false)}
          className="bottom-14 right-2 w-60 p-3"
        >
          <p className="text-xs font-bold text-popover-foreground">PretendPro status</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{licenseJoke}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Network: pretending to be online.
          </p>
        </Popover>
      </div>
    </div>
  );
}
