import { lazy, Suspense, type ComponentType } from "react";
import { apps, type AppId } from "@/components/pretendpro/chrome";

type ScreenProps = { animated: boolean };
type ScreenModule = { default: ComponentType<ScreenProps> };

/**
 * Every fake app screen, loaded on demand so opening one window never
 * downloads the other ten. Keys stay in sync with `AppId`.
 */
const loaders: Record<AppId, () => Promise<ScreenModule>> = {
  docufaker: () =>
    import("@/components/pretendpro/DocuFaker").then((m) => ({ default: m.DocuFaker })),
  sheets: () =>
    import("@/components/pretendpro/SheetShenanigans").then((m) => ({
      default: m.SheetShenanigans,
    })),
  browser: () =>
    import("@/components/pretendpro/BrowserBuddy").then((m) => ({ default: m.BrowserBuddy })),
  inbox: () =>
    import("@/components/pretendpro/InboxMirage").then((m) => ({ default: m.InboxMirage })),
  codeweb: () =>
    import("@/components/pretendpro/CodeFaker").then((m) => ({
      default: (props: ScreenProps) => <m.CodeFaker mode="web" {...props} />,
    })),
  codegame: () =>
    import("@/components/pretendpro/CodeFaker").then((m) => ({
      default: (props: ScreenProps) => <m.CodeFaker mode="game" {...props} />,
    })),
  deck: () =>
    import("@/components/pretendpro/DeckDreamer").then((m) => ({ default: m.DeckDreamer })),
  reader: () =>
    import("@/components/pretendpro/ReaderRealm").then((m) => ({ default: m.ReaderRealm })),
  photos: () =>
    import("@/components/pretendpro/PhotoPretender").then((m) => ({ default: m.PhotoPretender })),
  reels: () =>
    import("@/components/pretendpro/ReelPretender").then((m) => ({ default: m.ReelPretender })),
  sound: () =>
    import("@/components/pretendpro/SoundStage").then((m) => ({ default: m.SoundStage })),
};

const lazyScreens: Record<AppId, ComponentType<ScreenProps>> = (
  Object.keys(loaders) as AppId[]
).reduce(
  (acc, id) => {
    acc[id] = lazy(loaders[id]);
    return acc;
  },
  {} as Record<AppId, ComponentType<ScreenProps>>,
);

/** Warm an app's chunk before the user commits to opening it. */
export function preloadAppScreen(id: AppId): void {
  void loaders[id]().catch(() => {
    // A failed warm-up is harmless: the real render retries the import.
  });
}

function ScreenSkeleton() {
  return (
    <div className="flex h-full w-full flex-col gap-3 p-4" aria-hidden="true">
      <div className="h-6 w-1/3 animate-pulse rounded bg-foreground/10" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-foreground/10" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-foreground/10" />
      <div className="flex-1 animate-pulse rounded-lg bg-foreground/5" />
    </div>
  );
}

/** Renders one fake app screen, streaming in its chunk on first use. */
export function AppScreen({ id, animated }: { id: AppId; animated: boolean }) {
  const Screen = lazyScreens[id];
  const name = apps.find((a) => a.id === id)?.name ?? "PretendPro app";
  return (
    // Each open app is a section under the page H1, giving crawlers and screen
    // readers a single, correctly nested heading per fake app.
    <section aria-label={name} className="h-full w-full">
      <h2 className="sr-only">{name}</h2>
      <Suspense fallback={<ScreenSkeleton />}>
        <Screen animated={animated} />
      </Suspense>
    </section>
  );
}
