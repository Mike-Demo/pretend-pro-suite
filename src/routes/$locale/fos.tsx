import { createFileRoute } from "@tanstack/react-router";
import { Suite } from "@/components/pretendpro/Suite";
import { parseAppSearch } from "@/lib/pretendpro/search";
import { localeEditionHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";

export const Route = createFileRoute("/$locale/fos")({
  validateSearch: parseAppSearch,
  head: ({ params }) =>
    localeEditionHead(isLocaleId(params.locale) ? params.locale : defaultLocale, "fos"),
  component: FosPage,
});

function FosPage() {
  const { app } = Route.useSearch();
  return <Suite osTheme="fos" initialApp={app} />;
}
