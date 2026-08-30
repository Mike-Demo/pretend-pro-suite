import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pretendpro:appearance";

export type Appearance = "system" | "light" | "dark";

type Listener = (value: Appearance) => void;

const listeners = new Set<Listener>();
let current: Appearance = "system";
let hydrated = false;

function isAppearance(value: string | null): value is Appearance {
  return value === "system" || value === "light" || value === "dark";
}

function prefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Applies the resolved scheme to <html> so every route and OS theme follows it. */
function apply(value: Appearance): void {
  const dark = value === "dark" || (value === "system" && prefersDark());
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

function set(value: Appearance): void {
  current = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // storage blocked: keep the in-memory choice
  }
  apply(value);
  listeners.forEach((listener) => listener(value));
}

/**
 * Appearance follows the operating system by default and can be overridden.
 * The override is remembered per browser.
 */
export function useAppearance(): {
  appearance: Appearance;
  resolved: "light" | "dark";
  setAppearance: (value: Appearance) => void;
  toggleAppearance: () => void;
} {
  const [appearance, setLocal] = useState<Appearance>(current);
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (!hydrated) {
      hydrated = true;
      let stored: string | null = null;
      try {
        stored = window.localStorage.getItem(STORAGE_KEY);
      } catch {
        stored = null;
      }
      current = isAppearance(stored) ? stored : "system";
      apply(current);
    }
    setLocal(current);
    setResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");

    const listener: Listener = (value) => {
      setLocal(value);
      setResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    listeners.add(listener);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (current === "system") {
        apply(current);
        setResolved(media.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", onSystemChange);

    return () => {
      listeners.delete(listener);
      media.removeEventListener("change", onSystemChange);
    };
  }, []);

  const setAppearance = useCallback((value: Appearance) => set(value), []);

  const toggleAppearance = useCallback(() => {
    const dark = document.documentElement.classList.contains("dark");
    set(dark ? "light" : "dark");
  }, []);

  return { appearance, resolved, setAppearance, toggleAppearance };
}
