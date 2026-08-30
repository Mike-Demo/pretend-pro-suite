# Real windows, real dock, optional fun

Turn each OS page into a proper multi-window desktop: dock/taskbar/shelf buttons launch real app windows you can drag around, and all the joke sparkles/stickers move behind a single "Fun Mode" toggle that is off by default.

## Window manager

- Each of the four fake apps becomes an independent window with its own position, z-order, minimized and maximized state. Nothing is open at first launch except the app chosen during onboarding (`?app=`), which opens centered.
- Clicking a dock / taskbar / shelf button:
  - app not open -> opens it with a spring-in animation at a cascading offset
  - open but not focused -> raises and focuses it
  - focused -> minimizes it back to the dock (with a scale-down animation)
- Focus changes are animated: the focused window gets a stronger shadow, full-opacity chrome and a subtle lift; unfocused windows dim slightly and drop their shadow. Dock/taskbar indicators animate to match (Fruit dot, Apperture underline, Bufferium pill).
- Drag to rearrange: grab the title bar to move a window anywhere in the desktop area, clamped so the title bar stays reachable. Works with mouse and touch (pointer events). Dragging also focuses. Double-click the title bar toggles maximize. A bottom-right handle resizes.
- Window caption buttons stop being jokes: close really closes, minimize really minimizes, maximize/zoom really maximizes (Fruit traffic lights, Apperture Fluent glyphs, Bufferium controls all wired to the same actions).
- Keyboard: `1`-`4` open/focus an app, `Cmd/Ctrl+Tab` cycles open windows, `F` maximizes, `Cmd/Ctrl+W` closes the focused window, `Esc` restores, `Cmd/Ctrl+K` app switcher, `?` shortcuts. Command palette also opens/focuses windows.

## Fun Mode

- Remove the always-on easter eggs from the default experience: floating sparkles layer, "You're doing great, probably" sticky note, the 99% progress bar inside every window, and the joke toasts on window controls.
- Add a single **Fun Mode** toggle (replacing today's Animation Mode control) in each shell's menu/tray, plus the `A` shortcut. Off by default so the desktop reads as a believable OS.
- With Fun Mode on: sparkles return, the sticky note appears pinned to the desktop wallpaper (not over window chrome), the stuck 99% progress bar returns in window footers, bouncier window/dock animations, and occasional joke toasts.
- The choice persists per browser via localStorage so it survives reloads and theme switches.

## Technical notes

- New `src/lib/pretendpro/windows.ts`: `WindowState` type and a `useWindowManager` hook (open/focus/close/minimize/toggleMaximize/move/resize/cycle) holding a `Record<AppId, WindowState>` plus a z-order array.
- New `src/components/pretendpro/desktop/AppWindow.tsx`: absolutely-positioned draggable/resizable wrapper that renders the existing `WindowFrame` for chrome and the app screen as children; pointer-drag logic with `setPointerCapture`, transform-based movement, and CSS transitions for focus/open/close.
- `WindowFrame.tsx`: replace `fakeAction` toasts with real `onClose` / `onMinimize` / `onToggleMaximize` props and a `focused` flag; keep each theme's distinct chrome.
- `Desktop.tsx`: own the window manager, render one `AppWindow` per open app inside the shell's content area, keep shortcut handling, pass `funMode` down.
- `ShellProps` gains `openApps`, `minimized` and `focused` info so each shell renders accurate running indicators; `animated` becomes `funMode`/`onToggleFunMode`. Fruit dock, Apperture taskbar and Bufferium shelf keep their current visual language.
- `chrome.tsx`: `SparklesLayer`, `StickyNote`, `StuckProgress` stay but render only when Fun Mode is on; sticky note moves to a desktop-level position.
- New `src/lib/pretendpro/fun-mode.ts` for the persisted toggle (SSR-safe: reads in `useEffect`, defaults off).
- Respects `prefers-reduced-motion`; drag stays functional with animations reduced.
- Verify with typecheck, a build, and Playwright runs on `/fruit`, `/apperture`, `/bufferium` (launch two apps, drag one, check focus/z-order, toggle Fun Mode).
