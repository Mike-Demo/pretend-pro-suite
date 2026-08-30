import { useCallback, useEffect, useState } from "react";
import { WindowFrame, type OsTheme } from "@/components/pretendpro/WindowFrame";
import {
  apps,
  SparklesLayer,
  StickyNote,
  StuckProgress,
  type AppId,
} from "@/components/pretendpro/chrome";
import { DocuFaker } from "@/components/pretendpro/DocuFaker";
import { SheetShenanigans } from "@/components/pretendpro/SheetShenanigans";
import { BrowserBuddy } from "@/components/pretendpro/BrowserBuddy";
import { InboxMirage } from "@/components/pretendpro/InboxMirage";
import { cn } from "@/lib/utils";
import { FruitShell } from "./FruitShell";
import { AppertureShell } from "./AppertureShell";
import { BufferiumShell } from "./BufferiumShell";
import { CommandPalette } from "./CommandPalette";
import { ShortcutsOverlay } from "./ShortcutsOverlay";
import type { ShellProps } from "./shell-shared";

const screens: Record<AppId, (props: { animated: boolean }) => React.ReactNode> = {
  docufaker: DocuFaker,
  sheets: SheetShenanigans,
  browser: BrowserBuddy,
  inbox: InboxMirage,
};

const shells: Record<OsTheme, (props: ShellProps) => React.ReactNode> = {
  fruit: FruitShell,
  apperture: AppertureShell,
  bufferium: BufferiumShell,
};

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable === true;
}

export function Desktop({
  osTheme,
  initialApp = "docufaker",
}: {
  osTheme: OsTheme;
  initialApp?: AppId;
}) {
  const [active, setActive] = useState<AppId>(initialApp);
  const [animated, setAnimated] = useState(true);
  const [maximized, setMaximized] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const ActiveScreen = screens[active];
  const activeApp = apps.find((a) => a.id === active);
  const Shell = shells[osTheme];

  const cycle = useCallback((delta: number) => {
    setActive((current) => {
      const i = apps.findIndex((a) => a.id === current);
      return apps[(i + delta + apps.length) % apps.length].id;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (shortcutsOpen) setShortcutsOpen(false);
        else setMaximized(false);
        return;
      }

      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }

      if (mod && e.key === "Tab") {
        e.preventDefault();
        cycle(e.shiftKey ? -1 : 1);
        return;
      }

      if (isTyping(e.target) || mod || e.altKey) return;

      if (e.key >= "1" && e.key <= "4") {
        setActive(apps[Number(e.key) - 1].id);
      } else if (e.key.toLowerCase() === "f") {
        setMaximized((v) => !v);
      } else if (e.key.toLowerCase() === "a") {
        setAnimated((v) => !v);
      } else if (e.key === "?") {
        setShortcutsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycle, paletteOpen, shortcutsOpen]);

  return (
    <div
      data-os-theme={osTheme}
      className="os-desktop-bg relative h-screen overflow-hidden"
      aria-label={`PretendPro ${osTheme} desktop`}
    >
      <SparklesLayer enabled={animated} />

      <Shell
        osTheme={osTheme}
        active={active}
        onSelect={setActive}
        animated={animated}
        onToggleAnimated={() => setAnimated((v) => !v)}
        onShowShortcuts={() => setShortcutsOpen(true)}
        onOpenPalette={() => setPaletteOpen(true)}
        maximized={maximized}
        onToggleMaximized={() => setMaximized((v) => !v)}
      >
        <section
          className={cn("relative mx-auto", maximized ? "max-w-none" : "max-w-4xl")}
          aria-label={activeApp?.name ?? "PretendPro app"}
        >
          <StickyNote />
          <WindowFrame osTheme={osTheme} appName={activeApp?.name ?? "PretendPro"}>
            <ActiveScreen animated={animated} />
            <StuckProgress />
          </WindowFrame>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Press <kbd className="font-mono">?</kbd> for shortcuts ·{" "}
            <kbd className="font-mono">F</kbd> to {maximized ? "restore" : "maximize"}
          </p>
        </section>
      </Shell>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelect={setActive}
      />
      <ShortcutsOverlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
