import { createFileRoute } from "@tanstack/react-router";
import { Suite } from "@/components/pretendpro/Suite";
import { parseAppSearch } from "@/lib/pretendpro/search";
import { localeEditionHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";

export const Route = createFileRoute("/$locale/apperture")({
  validateSearch: parseAppSearch,
  head: ({ params }) =>
    localeEditionHead(isLocaleId(params.locale) ? params.locale : defaultLocale, "apperture"),
  component: ApperturePage,
});

function ApperturePage() {
  const { app } = Route.useSearch();
  return <Suite osTheme="apperture" initialApp={app} />;
}
