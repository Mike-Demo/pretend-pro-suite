import { lazy, Suspense } from "react";
import type { OsTheme } from "@/components/pretendpro/WindowFrame";
import { isMobileTheme } from "@/components/pretendpro/WindowFrame";
import type { AppId } from "@/components/pretendpro/chrome";
import { Desktop } from "@/components/pretendpro/desktop/Desktop";
import { Phone } from "@/components/pretendpro/mobile/Phone";
import { useStrings } from "@/lib/i18n/context";

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
    <main>
      {/* SEO/accessibility heading only — visible bars would push the h-screen
          OS surface down and clip the dock below the viewport. */}
      <h1 className="sr-only">{t.shell.editionHeading[osTheme]}</h1>
      {isMobileTheme(osTheme) ? (
        <Phone osTheme={osTheme} initialApp={initialApp} />
      ) : (
        <Desktop osTheme={osTheme} initialApp={initialApp} />
      )}
      <Suspense fallback={null}>
        <Toaster />
      </Suspense>
    </main>
  );
}
