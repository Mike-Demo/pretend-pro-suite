import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Battery, Wifi, Volume2 } from "lucide-react";
import type { DesktopOsTheme, OsTheme } from "@/components/pretendpro/WindowFrame";
import { osThemes } from "@/components/pretendpro/WindowFrame";
import { apps, type AppId } from "@/components/pretendpro/chrome";
import { cn } from "@/lib/utils";

export const themeRoutes: Record<
  OsTheme,
  "/fruit" | "/apperture" | "/bufferium" | "/android" | "/fos"
> = {
  fruit: "/fruit",
  apperture: "/apperture",
  bufferium: "/bufferium",
  android: "/android",
  fos: "/fos",
};

export const licenseJoke = "License expired due to excessive pretending.";

export type ShellProps = {
  osTheme: DesktopOsTheme;
  active: AppId;
  onSelect: (id: AppId) => void;
  openApps: AppId[];
  minimizedApps: AppId[];
  focusedApp: AppId | null;
  funMode: boolean;
  onToggleFunMode: () => void;
  onShowShortcuts: () => void;
  onOpenPalette: () => void;
  children: ReactNode;
};

export function useClock(): string {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);
  return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function TrayGlyphs() {
  return (
    <span className="flex items-center gap-1.5 text-foreground/60" aria-hidden="true">
      <Wifi className="h-3.5 w-3.5" />
      <Volume2 className="h-3.5 w-3.5" />
      <Battery className="h-3.5 w-3.5" />
    </span>
  );
}

export function ThemeSwitchLinks({
  osTheme,
  active,
  className,
  itemClassName,
}: {
  osTheme: OsTheme;
  active: AppId;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {osThemes
        .filter((t) => t.id !== osTheme)
        .map((t) => (
          <Link
            key={t.id}
            to={themeRoutes[t.id]}
            search={{ app: active }}
            className={cn("rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted", itemClassName)}
          >
            Switch to {t.name}
          </Link>
        ))}
      <Link
        to="/"
        className={cn("rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted", itemClassName)}
      >
        Change style…
      </Link>
      <Link
        to="/licenses"
        className={cn("rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted", itemClassName)}
      >
        Open source licenses
      </Link>
    </div>
  );
}

export function AppLauncherGrid({
  active,
  onSelect,
}: {
  active: AppId;
  onSelect: (id: AppId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {apps.map((app, i) => {
        const Icon = app.icon;
        return (
          <button
            key={app.id}
            onClick={() => onSelect(app.id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-transform hover:-translate-y-0.5",
              app.id === active ? "border-primary bg-card" : "border-border bg-card/80",
            )}
            aria-pressed={app.id === active}
          >
            <span
              className={cn("flex h-11 w-11 items-center justify-center rounded-xl", app.chip)}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-semibold text-foreground">{app.name}</span>
            <span className="text-[10px] text-muted-foreground">
              {i < 9 ? `Press ${i + 1}` : "via palette"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Popover({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <>
      <button
        className="fixed inset-0 z-40 cursor-default"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute z-50 rounded-xl border border-border bg-popover p-1.5 shadow-xl",
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}
