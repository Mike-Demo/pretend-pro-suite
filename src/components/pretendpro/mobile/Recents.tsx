import { X } from "lucide-react";
import type { MobileOsTheme } from "@/components/pretendpro/WindowFrame";
import { apps, type AppId } from "@/components/pretendpro/chrome";
import { cn } from "@/lib/utils";

export function Recents({
  osTheme,
  tasks,
  onResume,
  onClose,
}: {
  osTheme: MobileOsTheme;
  tasks: AppId[];
  onResume: (id: AppId) => void;
  onClose: (id: AppId) => void;
}) {
  const cards = [...tasks].reverse();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/70">
        Recent apps
      </h2>
      {cards.length === 0 ? (
        <p className="text-xs text-foreground/70">Nothing running. Impressively unproductive.</p>
      ) : (
        <ul className="flex w-full max-w-3xl snap-x gap-4 overflow-x-auto pb-4">
          {cards.map((id) => {
            const app = apps.find((a) => a.id === id);
            if (!app) return null;
            const Icon = app.icon;
            return (
              <li key={id} className="w-40 shrink-0 snap-center">
                <div
                  className={cn(
                    "relative flex flex-col overflow-hidden bg-[var(--os-surface)] shadow-[var(--os-elevation)]",
                    osTheme === "fos" ? "rounded-[1.35rem]" : "rounded-2xl",
                  )}
                >
                  <button
                    onClick={() => onClose(id)}
                    aria-label={`Close ${app.name}`}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/10 text-foreground/70 hover:bg-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onResume(id)}
                    className="group flex h-40 w-full flex-col items-center justify-center gap-2 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
                  >
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:animate-icon-pop",
                        app.chip,
                      )}
                    >
                      <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                    </span>
                    <span className="px-2 text-center text-[11px] font-semibold text-foreground/90">
                      {app.name}
                    </span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
