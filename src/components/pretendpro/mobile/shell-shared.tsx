import { useState, type ReactNode } from "react";
import { MoreVertical, Power } from "lucide-react";
import { PowerOverlay } from "@/components/pretendpro/PowerOverlay";
import type { MobileOsTheme } from "@/components/pretendpro/WindowFrame";
import type { AppId } from "@/components/pretendpro/chrome";
import { AppearanceToggle } from "@/components/pretendpro/AppearanceToggle";
import { Popover, ThemeSwitchLinks } from "@/components/pretendpro/desktop/shell-shared";
import type { PhoneView } from "@/lib/pretendpro/phone";
import { cn } from "@/lib/utils";

export type MobileShellProps = {
  osTheme: MobileOsTheme;
  active: AppId;
  appName: string;
  view: PhoneView;
  clock: string;
  funMode: boolean;
  onToggleFunMode: () => void;
  onShowShortcuts: () => void;
  onOpenPalette: () => void;
  onHome: () => void;
  onBack: () => void;
  onRecents: () => void;
  children: ReactNode;
};

/** System menu shared by both phone editions: styles, appearance, fun mode, help. */
export function SystemMenu({
  osTheme,
  active,
  funMode,
  onToggleFunMode,
  onShowShortcuts,
  onOpenPalette,
}: Pick<
  MobileShellProps,
  "osTheme" | "active" | "funMode" | "onToggleFunMode" | "onShowShortcuts" | "onOpenPalette"
>) {
  const [open, setOpen] = useState(false);
  const item = "rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted";

  return (
    <span className="relative z-50 flex items-center gap-1">
      <AppearanceToggle variant="icon" />
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="System menu"
        aria-expanded={open}
        className="rounded-full p-1 text-foreground/70 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>
      <Popover open={open} onClose={() => setOpen(false)} className="right-0 top-7 w-52">
        <div className="flex flex-col">
          <button
            className={item}
            onClick={() => {
              setOpen(false);
              onOpenPalette();
            }}
          >
            Search apps (⌘K)
          </button>
          <button
            className={item}
            onClick={() => {
              setOpen(false);
              onToggleFunMode();
            }}
          >
            Fun Mode: {funMode ? "On" : "Off"}
          </button>
          <button
            className={item}
            onClick={() => {
              setOpen(false);
              onShowShortcuts();
            }}
          >
            Keyboard shortcuts
          </button>
          <span className="mx-2 my-1 border-t border-border" />
          <ThemeSwitchLinks osTheme={osTheme} active={active} itemClassName={item} />
        </div>
      </Popover>
    </span>
  );
}

export function NavButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-10 w-14 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {children}
    </button>
  );
}
