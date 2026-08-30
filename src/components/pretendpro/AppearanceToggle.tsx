import { Moon, Sun, MonitorSmartphone } from "lucide-react";
import { useAppearance, type Appearance } from "@/lib/pretendpro/appearance";
import { cn } from "@/lib/utils";

/** Applies the system/stored appearance globally; renders nothing. */
export function AppearanceEffect() {
  useAppearance();
  return null;
}

const labels: Record<Appearance, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

const order: Appearance[] = ["system", "light", "dark"];

/** Cycles System → Light → Dark. Used in OS menus and page headers. */
export function AppearanceToggle({
  variant = "menu",
  className,
}: {
  variant?: "menu" | "icon";
  className?: string;
}) {
  const { appearance, resolved, setAppearance } = useAppearance();
  const next = order[(order.indexOf(appearance) + 1) % order.length] ?? "system";
  const Icon = appearance === "system" ? MonitorSmartphone : resolved === "dark" ? Moon : Sun;

  if (variant === "icon") {
    return (
      <button
        onClick={() => setAppearance(next)}
        aria-label={`Appearance: ${labels[appearance]}. Switch to ${labels[next]}`}
        title={`Appearance: ${labels[appearance]}`}
        className={cn(
          "fluent-focus inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground",
          className,
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
        {labels[appearance]}
      </button>
    );
  }

  return (
    <button
      onClick={() => setAppearance(next)}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      Appearance: {labels[appearance]}
    </button>
  );
}
