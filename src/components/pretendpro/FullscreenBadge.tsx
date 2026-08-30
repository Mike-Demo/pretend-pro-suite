import { useSyncExternalStore } from "react";
import { Maximize } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  isFullscreenActive,
  subscribeFullscreen,
} from "@/lib/pretendpro/fullscreen";

/** Small "Fullscreen enabled" chip that tracks the real Fullscreen API state. */
export function FullscreenBadge({ className }: { className?: string }) {
  const active = useSyncExternalStore(subscribeFullscreen, isFullscreenActive, () => false);
  if (!active) return null;
  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded-full border border-border/60 px-1.5 py-0.5 text-[10px] font-semibold text-foreground/70",
        className,
      )}
      title="The app is using your entire device screen. Press Esc to leave."
    >
      <Maximize className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
      <span className="hidden sm:inline">Fullscreen enabled</span>
      <span className="sr-only">Fullscreen enabled</span>
    </span>
  );
}
