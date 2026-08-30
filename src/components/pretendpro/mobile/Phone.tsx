import { useCallback, useEffect, useRef, useState } from "react";
import type { MobileOsTheme } from "@/components/pretendpro/WindowFrame";
import { apps, SparklesLayer, StickyNote, type AppId } from "@/components/pretendpro/chrome";
import { screens } from "@/components/pretendpro/app-screens";
import { CommandPalette } from "@/components/pretendpro/desktop/CommandPalette";
import { ShortcutsOverlay } from "@/components/pretendpro/desktop/ShortcutsOverlay";
import { useClock } from "@/components/pretendpro/desktop/shell-shared";
import { PowerProvider } from "@/components/pretendpro/power/PowerProvider";
import { useFunMode } from "@/lib/pretendpro/fun-mode";
import { usePhone } from "@/lib/pretendpro/phone";
import { AndroidShell } from "./AndroidShell";
import { FosShell } from "./FosShell";
import { HomeScreen } from "./HomeScreen";
import { Recents } from "./Recents";
import type { MobileShellProps } from "./shell-shared";

const shells: Record<MobileOsTheme, (props: MobileShellProps) => React.ReactNode> = {
  android: AndroidShell,
  fos: FosShell,
};

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable === true;
}

export function Phone({
  osTheme,
  initialApp = "docufaker",
}: {
  osTheme: MobileOsTheme;
  initialApp?: AppId;
}) {
  const { funMode, toggleFunMode } = useFunMode();
  const clock = useClock();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const phone = usePhone(`pretendpro:phone:${osTheme}`);
  const { tasks, foreground, view, launch, goHome, showRecents, back, closeTask, cycle } = phone;

  // Open the app chosen during onboarding once, unless a session was restored.
  const bootstrapped = useRef(false);
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    if (phone.tasks.length > 0) return;
    launch(initialApp);
  }, [initialApp, launch, phone.tasks.length]);

  const handleLaunch = useCallback((id: AppId) => launch(id), [launch]);

  useEffect(() => {
    if (view === "home") {
      setAnnouncement("Home screen");
      return;
    }
    if (view === "recents") {
      setAnnouncement("Recent apps");
      return;
    }
    const app = apps.find((a) => a.id === foreground);
    setAnnouncement(`${app?.name ?? "App"} in foreground`);
  }, [foreground, view]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (shortcutsOpen) setShortcutsOpen(false);
        else goHome();
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

      if (mod && e.key.toLowerCase() === "w") {
        if (foreground) {
          e.preventDefault();
          closeTask(foreground);
        }
        return;
      }

      if (isTyping(e.target) || mod || e.altKey) return;

      if (e.key >= "1" && e.key <= "9") {
        const target = apps[Number(e.key) - 1];
        if (target) launch(target.id);
      } else if (e.key.toLowerCase() === "a") {
        toggleFunMode();
      } else if (e.key === "?") {
        setShortcutsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeTask, cycle, foreground, goHome, launch, paletteOpen, shortcutsOpen, toggleFunMode]);

  const Shell = shells[osTheme];
  const app = apps.find((a) => a.id === foreground);
  const Screen = foreground ? screens[foreground] : null;

  return (
    <PowerProvider osTheme={osTheme} funMode={funMode}>
      <div
        data-os-theme={osTheme}
        className="os-desktop-bg relative h-screen overflow-hidden"
        aria-label={`PretendPro ${osTheme} phone`}
      >
        <SparklesLayer enabled={funMode} />

        <Shell
          osTheme={osTheme}
          active={foreground ?? initialApp}
          appName={app?.name ?? "PretendPro"}
          view={view}
          clock={clock}
          funMode={funMode}
          onToggleFunMode={toggleFunMode}
          onShowShortcuts={() => setShortcutsOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onHome={goHome}
          onBack={back}
          onRecents={showRecents}
        >
          <div className="relative h-full w-full">
            {funMode && <StickyNote />}

            {view === "home" && (
              <HomeScreen
                osTheme={osTheme}
                onLaunch={handleLaunch}
                onOpenPalette={() => setPaletteOpen(true)}
              />
            )}

            {view === "recents" && (
              <Recents
                osTheme={osTheme}
                tasks={tasks}
                onResume={handleLaunch}
                onClose={closeTask}
              />
            )}

            {view === "app" &&
              (Screen ? (
                <div
                  key={foreground}
                  className="h-full overflow-y-auto bg-card p-3 pretend-app-enter sm:p-5"
                >
                  <div className="mx-auto max-w-3xl">
                    <Screen animated={funMode} />
                  </div>
                </div>
              ) : (
                <p className="pt-10 text-center text-xs text-foreground/70">
                  Nothing open. Tap home and pick an app.
                </p>
              ))}
          </div>
        </Shell>

        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          onSelect={handleLaunch}
        />
        <p aria-live="polite" role="status" className="sr-only">
          {announcement}
        </p>
        <ShortcutsOverlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      </div>
    </PowerProvider>
  );
}
