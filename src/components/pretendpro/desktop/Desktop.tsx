import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DesktopOsTheme } from "@/components/pretendpro/WindowFrame";
import { apps, SparklesLayer, StickyNote, type AppId } from "@/components/pretendpro/chrome";
import { AppScreen, preloadAppScreen } from "@/components/pretendpro/app-screens";
import { PowerProvider } from "@/components/pretendpro/power/PowerProvider";
import { useFunMode } from "@/lib/pretendpro/fun-mode";
import { useWindowManager, type Bounds } from "@/lib/pretendpro/windows";
import { AppWindow } from "./AppWindow";
import type { ShellProps } from "./shell-shared";

// Only the current edition's chrome is downloaded; the other shells and the
// overlay-only UI stay in their own chunks.
const shells: Record<DesktopOsTheme, React.ComponentType<ShellProps>> = {
  fruit: lazy(() => import("./FruitShell").then((m) => ({ default: m.FruitShell }))),
  apperture: lazy(() => import("./AppertureShell").then((m) => ({ default: m.AppertureShell }))),
  bufferium: lazy(() => import("./BufferiumShell").then((m) => ({ default: m.BufferiumShell }))),
};

const CommandPalette = lazy(() =>
  import("./CommandPalette").then((m) => ({ default: m.CommandPalette })),
);
const ShortcutsOverlay = lazy(() =>
  import("./ShortcutsOverlay").then((m) => ({ default: m.ShortcutsOverlay })),
);

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
  osTheme: DesktopOsTheme;
  initialApp?: AppId;
}) {
  const { funMode, toggleFunMode } = useFunMode();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const areaRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [bounds, setBounds] = useState<Bounds>({ width: 1200, height: 700 });
  const [measured, setMeasured] = useState(false);

  const [announcement, setAnnouncement] = useState("");
  const wm = useWindowManager(`pretendpro:layout:${osTheme}`);
  const { windows, focused, openApps, launch, focus, close, minimize, toggleMaximize, cycle } = wm;

  const measure = useCallback((): Bounds => {
    const el = areaRef.current;
    if (!el) return bounds;
    const next = { width: el.clientWidth, height: el.clientHeight };
    return next.width > 0 ? next : bounds;
  }, [bounds]);

  /**
   * The desktop area lives inside a lazily loaded shell, so it is not in the DOM
   * on first commit. A callback ref plus a ResizeObserver measures it the moment
   * it mounts (and whenever it resizes) instead of reading a ref once.
   */
  const setAreaRef = useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    areaRef.current = node;
    if (!node) return;
    const update = () => {
      if (node.clientWidth > 0) {
        setBounds({ width: node.clientWidth, height: node.clientHeight });
        setMeasured(true);
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  // Open the app chosen during onboarding once the layout is hydrated and the
  // desktop has a real size. The chosen app always wins over a restored layout,
  // so the desktop is never left with nothing visible.
  const bootstrapped = useRef(false);
  useEffect(() => {
    if (bootstrapped.current) return;
    if (!wm.hydrated || !measured) return;
    bootstrapped.current = true;
    const existing = wm.windows.find((w) => w.id === initialApp);
    if (!existing || existing.minimized) {
      launch(initialApp, bounds);
    } else {
      focus(initialApp);
    }
  }, [bounds, focus, initialApp, launch, measured, wm.hydrated, wm.windows]);

  /** Dock behaviour: launch, focus, or minimize the already-focused window. */
  const handleDockSelect = useCallback(
    (id: AppId) => {
      const existing = windows.find((w) => w.id === id);
      if (!existing) {
        launch(id, measure());
      } else if (existing.minimized) {
        launch(id, measure());
      } else if (focused === id) {
        minimize(id);
      } else {
        focus(id);
      }
    },
    [focus, focused, launch, measure, minimize, windows],
  );

  /** Palette / launcher: always show the app, never minimize it. */
  const handleLaunch = useCallback(
    (id: AppId) => {
      launch(id, measure());
    },
    [launch, measure],
  );

  const focusedWindow = windows.find((w) => w.id === focused);

  // Announce focus changes for screen-reader users.
  useEffect(() => {
    if (!focused) {
      setAnnouncement("No windows open");
      return;
    }
    const app = apps.find((a) => a.id === focused);
    setAnnouncement(`${app?.name ?? "Window"} focused`);
  }, [focused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (shortcutsOpen) setShortcutsOpen(false);
        else if (focusedWindow?.maximized) toggleMaximize(focusedWindow.id);
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
        if (focused) {
          e.preventDefault();
          close(focused);
        }
        return;
      }

      if (isTyping(e.target) || mod || e.altKey) return;

      if (e.key >= "1" && e.key <= "9") {
        const target = apps[Number(e.key) - 1];
        if (target) handleDockSelect(target.id);
      } else if (e.key.toLowerCase() === "f") {
        if (focused) toggleMaximize(focused);
      } else if (e.key.toLowerCase() === "a") {
        toggleFunMode();
      } else if (e.key === "?") {
        setShortcutsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    close,
    cycle,
    focused,
    focusedWindow,
    handleDockSelect,
    paletteOpen,
    shortcutsOpen,
    toggleFunMode,
    toggleMaximize,
  ]);

  const Shell = shells[osTheme];

  return (
    <PowerProvider osTheme={osTheme} funMode={funMode}>
      <div
        data-os-theme={osTheme}
        className="os-desktop-bg relative h-screen overflow-hidden"
        aria-label={`PretendPro ${osTheme} desktop`}
      >
        <SparklesLayer enabled={funMode} />

        <Suspense fallback={null}>
          <Shell
            osTheme={osTheme}
            active={focused ?? initialApp}
            onSelect={handleDockSelect}
            openApps={openApps}
            minimizedApps={windows.filter((w) => w.minimized).map((w) => w.id)}
            focusedApp={focused}
            funMode={funMode}
            onToggleFunMode={toggleFunMode}
            onShowShortcuts={() => setShortcutsOpen(true)}
            onOpenPalette={() => setPaletteOpen(true)}
          >
            <div ref={areaRef} data-desktop-area className="relative h-full w-full">
              {funMode && <StickyNote />}
              {windows
                .filter((w) => !w.minimized)
                .map((w) => {
                  const app = apps.find((a) => a.id === w.id);
                  return (
                    <AppWindow
                      key={w.id}
                      osTheme={osTheme}
                      state={w}
                      appName={app?.name ?? "PretendPro"}
                      focused={focused === w.id}
                      funMode={funMode}
                      zIndex={wm.zIndexOf(w.id)}
                      bounds={bounds}
                      onFocus={() => focus(w.id)}
                      onClose={() => close(w.id)}
                      onMinimize={() => minimize(w.id)}
                      onToggleMaximize={() => toggleMaximize(w.id)}
                      onMove={(x, y) => wm.move(w.id, x, y)}
                      onResize={(width, height) => wm.resize(w.id, width, height)}
                      onDock={(zone) => wm.dock(w.id, zone, bounds)}
                      onAnnounce={setAnnouncement}
                    >
                      <AppScreen id={w.id} animated={funMode} />
                    </AppWindow>
                  );
                })}

              {windows.filter((w) => !w.minimized).length === 0 && (
                <p className="absolute inset-x-0 top-1/2 text-center text-xs text-foreground/60">
                  No windows open. Click an app below to get pretending.
                </p>
              )}
            </div>
          </Shell>
        </Suspense>

        <Suspense fallback={null}>
          {paletteOpen && (
            <CommandPalette
              open={paletteOpen}
              onClose={() => setPaletteOpen(false)}
              onSelect={handleLaunch}
            />
          )}
          {shortcutsOpen && (
            <ShortcutsOverlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
          )}
        </Suspense>
        <p aria-live="polite" role="status" className="sr-only">
          {announcement}
        </p>
      </div>
    </PowerProvider>
  );
}
