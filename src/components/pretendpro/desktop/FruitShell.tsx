import { useState } from "react";
import { Apple, Keyboard } from "lucide-react";
import { apps } from "@/components/pretendpro/chrome";
import { cn } from "@/lib/utils";
import {
  Popover,
  ThemeSwitchLinks,
  TrayGlyphs,
  licenseJoke,
  useClock,
  type ShellProps,
} from "./shell-shared";

const menus = ["File", "Edit", "Pretend", "Help"];

export function FruitShell({
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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const activeApp = apps.find((a) => a.id === active);

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex items-center gap-3 border-b border-border/40 bg-[var(--os-chrome)] px-3 py-1.5 text-xs backdrop-blur">
        <button
          onClick={() => setOpenMenu(openMenu === "apple" ? null : "apple")}
          className="rounded-md p-1 hover:bg-muted"
          aria-label="PretendPro menu"
        >
          <Apple className="h-3.5 w-3.5" />
        </button>
        <span className="font-bold text-foreground">{activeApp?.name ?? "PretendPro"}</span>
        <div className="hidden items-center gap-3 text-foreground/70 sm:flex">
          {menus.map((m) => (
            <button
              key={m}
              onClick={() => setOpenMenu(openMenu === m ? null : m)}
              className={cn("rounded px-1.5 py-0.5 hover:bg-muted", openMenu === m && "bg-muted")}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onShowShortcuts}
            className="rounded-md p-1 text-foreground/60 hover:bg-muted"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="h-3.5 w-3.5" />
          </button>
          <TrayGlyphs />
          <span className="font-semibold text-foreground/80">{clock}</span>
        </div>

        <Popover open={openMenu === "apple"} onClose={() => setOpenMenu(null)} className="left-2 top-8 w-56">
          <p className="px-2 py-1 text-[11px] text-muted-foreground">{licenseJoke}</p>
          <ThemeSwitchLinks osTheme={osTheme} active={active} />
        </Popover>
        <Popover
          open={openMenu !== null && openMenu !== "apple"}
          onClose={() => setOpenMenu(null)}
          className="left-24 top-8 w-56"
        >
          <button
            onClick={onToggleFunMode}
            className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          >
            {funMode ? "Disable" : "Enable"} Fun Mode (A)
          </button>
          <button
            onClick={onOpenPalette}
            className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          >
            Switch App… (⌘K)
          </button>
          <button
            onClick={onShowShortcuts}
            className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          >
            Keyboard Shortcuts (?)
          </button>
        </Popover>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-30 flex justify-center px-3">
        <div className="pointer-events-auto flex items-end gap-2 rounded-2xl border border-border/50 bg-[var(--os-chrome)] px-3 py-2 shadow-xl backdrop-blur">
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
                className="group flex flex-col items-center"
              >
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl shadow-md transition-transform duration-150 group-hover:-translate-y-2 group-hover:scale-125",
                    app.chip,
                    isActive ? "ring-2 ring-primary" : isRunning && "ring-1 ring-primary/40",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={cn(
                    "mt-1 h-1 w-1 rounded-full transition-colors duration-200",
                    isActive
                      ? "bg-foreground/80"
                      : isRunning
                        ? "bg-foreground/40"
                        : "bg-transparent",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
