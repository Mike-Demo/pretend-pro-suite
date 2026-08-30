import type { OsTheme } from "@/components/pretendpro/WindowFrame";
import { isMobileTheme } from "@/components/pretendpro/WindowFrame";
import type { AppId } from "@/components/pretendpro/chrome";
import { Desktop } from "@/components/pretendpro/desktop/Desktop";
import { Phone } from "@/components/pretendpro/mobile/Phone";

export { themeRoutes } from "@/components/pretendpro/desktop/shell-shared";

const editionHeadings: Record<OsTheme, string> = {
  fruit: "PretendPro 3000 — Fruit (Mac OS X) Edition: a fake desktop for looking busy",
  apperture: "PretendPro 3000 — Apperture (Windows) Edition: a fake desktop for looking busy",
  bufferium: "PretendPro 3000 — BufferiumOS Edition: a fake desktop for looking busy",
  android: "PretendPro 3000 — Android Edition: a fake phone for looking busy",
  fos: "PretendPro 3000 — fOS Edition: a fake phone for looking busy",
};

export function Suite({
  osTheme,
  initialApp = "docufaker",
}: {
  osTheme: OsTheme;
  initialApp?: AppId;
}) {
  return (
    <>
      <h1 className="sr-only">{editionHeadings[osTheme]}</h1>
      {isMobileTheme(osTheme) ? (
        <Phone osTheme={osTheme} initialApp={initialApp} />
      ) : (
        <Desktop osTheme={osTheme} initialApp={initialApp} />
      )}
    </>
  );
}
