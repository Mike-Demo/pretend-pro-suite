import { Search } from "lucide-react";
import type { MobileOsTheme } from "@/components/pretendpro/WindowFrame";
import { apps, type AppId } from "@/components/pretendpro/chrome";
import { cn } from "@/lib/utils";

const dockIds: AppId[] = ["docufaker", "browser", "inbox", "sheets"];

export function HomeScreen({
  osTheme,
  onLaunch,
  onOpenPalette,
}: {
  osTheme: MobileOsTheme;
  onLaunch: (id: AppId) => void;
  onOpenPalette: () => void;
}) {
  const rounded = osTheme === "fos" ? "rounded-[1.35rem]" : "rounded-[1.65rem]";

  return (
    <div className="flex h-full flex-col">
      {osTheme === "android" && (
        <div className="px-4 pt-4">
          <button
            onClick={onOpenPalette}
            className="flex w-full max-w-md items-center gap-2 rounded-full bg-[var(--os-surface)] px-4 py-2.5 text-left text-xs text-muted-foreground shadow-[var(--os-elevation)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Search className="h-4 w-4 shrink-0" />
            Search pretend apps
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <ul className="mx-auto grid max-w-3xl grid-cols-4 gap-x-3 gap-y-6 sm:grid-cols-6">
          {apps.map((app, i) => {
            const Icon = app.icon;
            return (
              <li key={app.id}>
                <button
                  onClick={() => onLaunch(app.id)}
                  className="group flex w-full flex-col items-center gap-1.5 rounded-xl p-1 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-90"
                >
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center shadow-[var(--os-elevation)] transition-transform group-hover:animate-icon-pop",
                      rounded,
                      app.chip,
                    )}
                  >
                    <Icon className="h-6 w-6 transition-transform group-hover:scale-110" />
                  </span>
                  <span className="line-clamp-2 text-center text-[10px] font-semibold leading-tight text-foreground/90">
                    {app.name}
                  </span>
                  <span className="sr-only">{i < 9 ? `Shortcut: press ${i + 1}` : ""}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {osTheme === "fos" && (
        <div className="px-4 pb-2">
          <ul className="mx-auto flex max-w-sm items-center justify-around rounded-[1.6rem] bg-[var(--os-surface)] p-3 shadow-[var(--os-elevation)]">
            {dockIds.map((id) => {
              const app = apps.find((a) => a.id === id);
              if (!app) return null;
              const Icon = app.icon;
              return (
                <li key={id}>
                  <button
                    onClick={() => onLaunch(id)}
                    aria-label={`Open ${app.name}`}
                    className={cn(
                      "group flex h-12 w-12 items-center justify-center rounded-[1.1rem] transition-transform hover:-translate-y-1 hover:animate-icon-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-90",
                      app.chip,
                    )}
                  >
                    <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
