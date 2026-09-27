import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suite } from "@/components/pretendpro/Suite";
import { localeEditionHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";
import { defaultAppId } from "@/lib/pretendpro/app-ids";
import { parseLegacyAppSearch } from "@/lib/pretendpro/search";

export const Route = createFileRoute("/$locale/apperture/")({
  validateSearch: parseLegacyAppSearch,
  // Legacy ?app= links move to the canonical per-work-type path.
  beforeLoad: ({ params, search }) => {
    if (search.app) {
      throw redirect({
        to: "/$locale/apperture/$app/",
        params: { locale: params.locale, app: search.app },
        replace: true,
      });
    }
  },
  head: ({ params }) =>
    localeEditionHead(isLocaleId(params.locale) ? params.locale : defaultLocale, "apperture"),
  component: ApperturePage,
});

function ApperturePage() {
  return <Suite osTheme="apperture" initialApp={defaultAppId} />;
}
