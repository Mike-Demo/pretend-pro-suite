import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pretendpro:fun-mode";

/**
 * Fun Mode gates every easter egg. Off by default so the desktop reads as a
 * believable OS; the choice is remembered per browser.
 */
export function useFunMode(): { funMode: boolean; toggleFunMode: () => void } {
  const [funMode, setFunMode] = useState(false);

  useEffect(() => {
    try {
      setFunMode(window.localStorage.getItem(STORAGE_KEY) === "on");
    } catch {
      // storage blocked: keep the default
    }
  }, []);

  const toggleFunMode = useCallback(() => {
    setFunMode((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { funMode, toggleFunMode };
}
