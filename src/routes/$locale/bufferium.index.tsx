import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suite } from "@/components/pretendpro/Suite";
import { localeEditionHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";
import { defaultAppId } from "@/lib/pretendpro/app-ids";
import { parseLegacyAppSearch } from "@/lib/pretendpro/search";

export const Route = createFileRoute("/$locale/bufferium/")({
  validateSearch: parseLegacyAppSearch,
  // Legacy ?app= links move to the canonical per-work-type path.
  beforeLoad: ({ params, search }) => {
    if (search.app) {
      throw redirect({
        to: "/$locale/bufferium/$app/",
        params: { locale: params.locale, app: search.app },
        replace: true,
      });
    }
  },
  head: ({ params }) =>
    localeEditionHead(isLocaleId(params.locale) ? params.locale : defaultLocale, "bufferium"),
  component: BufferiumPage,
});

function BufferiumPage() {
  return <Suite osTheme="bufferium" initialApp={defaultAppId} />;
}
