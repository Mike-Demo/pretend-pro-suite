import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Battery, Wifi, Volume2 } from "lucide-react";
import type { DesktopOsTheme, OsTheme } from "@/components/pretendpro/WindowFrame";
import { osThemes } from "@/components/pretendpro/WindowFrame";
import { apps, type AppId } from "@/components/pretendpro/chrome";
import { cn } from "@/lib/utils";
import { preloadAppScreen } from "@/components/pretendpro/app-screens";
import { useI18n, useStrings } from "@/lib/i18n/context";
import { localeThemeRoutes } from "@/lib/i18n/locales";
import { LocalePicker } from "@/components/pretendpro/LocalePicker";


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
  const { locale, t } = useI18n();
  const itemClass = cn("rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted", itemClassName);
  return (
    <div className={cn("flex flex-col", className)}>
      {osThemes
        .filter((theme) => theme.id !== osTheme)
        .map((theme) => (
          <Link
            key={theme.id}
            to={localeThemeAppRoutes[theme.id]}
            params={{ locale, app: active }}
            className={itemClass}
          >
            {t.shell.switchTo(theme.name)}
          </Link>
        ))}
      <Link to="/$locale" params={{ locale }} className={itemClass}>
        {t.shell.changeStyle}
      </Link>
      <Link to="/$locale/licenses" params={{ locale }} className={itemClass}>
        {t.shell.licenses}
      </Link>
      <span className="mt-1 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        {t.shell.language}
      </span>
      <LocalePicker variant="menu" className="mt-0.5" />
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
  const t = useStrings();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {apps.map((app, i) => {
        const Icon = app.icon;
        return (
          <button
            key={app.id}
            onClick={() => onSelect(app.id)}
            onPointerEnter={() => preloadAppScreen(app.id)}
            onFocus={() => preloadAppScreen(app.id)}
            className={cn(
              "group flex w-full min-w-0 flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-transform hover:-translate-y-0.5",
              app.id === active ? "border-primary bg-card" : "border-border bg-card/80",
            )}
            aria-pressed={app.id === active}
          >
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:animate-icon-pop group-hover:scale-105",
                app.chip,
                app.id === active && "scale-105 ring-2 ring-primary/50",
              )}
            >
              <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
            </span>
            <span className="line-clamp-2 w-full break-words text-center text-[11px] font-semibold leading-tight text-foreground">
              {app.name}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
              {i < 9 ? t.shell.launcherHint(i + 1) : t.shell.launcherPalette}
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
