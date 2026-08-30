// Browser Fullscreen API helper (see https://wiki.mozilla.org/Gecko:FullScreenAPI).
// Fullscreen can only be entered from a user gesture, so callers invoke
// requestDeviceFullscreen() from a click handler. Failures (unsupported
// browsers, denied permission) are intentionally swallowed — the app works
// fine windowed.

const STORAGE_KEY = "pretendpro:fullscreen";

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

export const isFullscreenSupported = (): boolean => {
  if (typeof document === "undefined") return false;
  const el = document.documentElement as FullscreenElement;
  return typeof el.requestFullscreen === "function" || typeof el.webkitRequestFullscreen === "function";
};

export const isFullscreenActive = (): boolean => {
  if (typeof document === "undefined") return false;
  const doc = document as FullscreenDocument;
  return Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement);
};

export const requestDeviceFullscreen = (): void => {
  if (typeof document === "undefined") return;
  const el = document.documentElement as FullscreenElement;
  try {
    const request = el.requestFullscreen ?? el.webkitRequestFullscreen;
    const result = request?.call(el);
    if (result instanceof Promise) result.catch(() => undefined);
  } catch {
    // Not supported or blocked — continue windowed.
  }
};

export const exitDeviceFullscreen = (): void => {
  if (typeof document === "undefined") return;
  const doc = document as FullscreenDocument;
  try {
    const exit = doc.exitFullscreen ?? doc.webkitExitFullscreen;
    const result = exit?.call(doc);
    if (result instanceof Promise) result.catch(() => undefined);
  } catch {
    // Ignore.
  }
};

// Toggle fullscreen from a user gesture. Returns false when fullscreen is
// unsupported or the browser denies the request, so callers can surface a
// friendly toast instead of silently staying windowed.
export const toggleDeviceFullscreen = async (): Promise<boolean> => {
  if (typeof document === "undefined") return false;
  if (isFullscreenActive()) {
    exitDeviceFullscreen();
    return true;
  }
  if (!isFullscreenSupported()) return false;
  const el = document.documentElement as FullscreenElement;
  try {
    const request = el.requestFullscreen ?? el.webkitRequestFullscreen;
    await request?.call(el);
    return isFullscreenActive();
  } catch {
    return false;
  }
};

// Live fullscreen state for the badge: subscribes to (webkit)fullscreenchange.
export const subscribeFullscreen = (onChange: () => void): (() => void) => {
  if (typeof document === "undefined") return () => undefined;
  document.addEventListener("fullscreenchange", onChange);
  document.addEventListener("webkitfullscreenchange", onChange);
  return () => {
    document.removeEventListener("fullscreenchange", onChange);
    document.removeEventListener("webkitfullscreenchange", onChange);
  };
};

export const loadFullscreenPreference = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

export const saveFullscreenPreference = (enabled: boolean): void => {
  if (typeof window === "undefined") return;
  try {
    if (enabled) {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Private mode etc. — preference just won't persist.
  }
};
