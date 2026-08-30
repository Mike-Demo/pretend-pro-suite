import { Battery, SignalHigh, Wifi } from "lucide-react";
import type { MobileOsTheme } from "@/components/pretendpro/WindowFrame";
import { cn } from "@/lib/utils";

export function StatusBar({
  osTheme,
  clock,
  children,
}: {
  osTheme: MobileOsTheme;
  clock: string;
  children?: React.ReactNode;
}) {
  const glyphs = (
    <span className="flex items-center gap-1.5 text-foreground/70" aria-hidden="true">
      <SignalHigh className="h-3.5 w-3.5" />
      <Wifi className="h-3.5 w-3.5" />
      <Battery className="h-3.5 w-3.5" />
    </span>
  );

  return (
    <div
      className={cn(
        "flex h-9 shrink-0 items-center gap-2 bg-[var(--os-statusbar)] px-4 text-[11px] font-semibold text-foreground/80 backdrop-blur",
        osTheme === "fos" && "px-6",
      )}
    >
      <span>{clock}</span>
      {osTheme === "fos" && (
        <span
          aria-hidden="true"
          className="mx-auto h-4 w-20 rounded-full bg-foreground/80 dark:bg-foreground/60"
        />
      )}
      <span className={cn("flex items-center gap-2", osTheme === "android" && "ml-auto")}>
        {children}
        {glyphs}
      </span>
    </div>
  );
}
