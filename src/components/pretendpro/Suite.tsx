import { lazy, Suspense } from "react";
import type { OsTheme } from "@/components/pretendpro/WindowFrame";
import { isMobileTheme } from "@/components/pretendpro/WindowFrame";
import type { AppId } from "@/components/pretendpro/chrome";
import { Desktop } from "@/components/pretendpro/desktop/Desktop";
import { Phone } from "@/components/pretendpro/mobile/Phone";
import { useStrings } from "@/lib/i18n/context";

export { themeRoutes } from "@/components/pretendpro/desktop/shell-shared";

// Toasts only ever come from the OS surfaces (power actions, settings), so the
// toast runtime lives here instead of the root route: onboarding and the
// licenses page never download it.
const Toaster = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));

export function Suite({
  osTheme,
  initialApp = "docufaker",
}: {
  osTheme: OsTheme;
  initialApp?: AppId;
}) {
  const t = useStrings();
  return (
    <>
      <h1 className="px-4 py-2 text-sm font-semibold tracking-tight text-foreground bg-background/80 backdrop-blur-sm border-b border-border">
        {t.shell.editionHeading[osTheme]}
      </h1>
      {isMobileTheme(osTheme) ? (
        <Phone osTheme={osTheme} initialApp={initialApp} />
      ) : (
        <Desktop osTheme={osTheme} initialApp={initialApp} />
      )}
      <Suspense fallback={null}>
        <Toaster />
      </Suspense>
    </>
  );
}
