import type { OsTheme } from "@/components/pretendpro/WindowFrame";
import type { AppId } from "@/components/pretendpro/chrome";
import { Desktop } from "@/components/pretendpro/desktop/Desktop";

export { themeRoutes } from "@/components/pretendpro/desktop/shell-shared";

export function Suite({
  osTheme,
  initialApp = "docufaker",
}: {
  osTheme: OsTheme;
  initialApp?: AppId;
}) {
  return <Desktop osTheme={osTheme} initialApp={initialApp} />;
}
