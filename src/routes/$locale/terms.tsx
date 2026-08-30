import { createFileRoute } from "@tanstack/react-router";
import { TermsView } from "@/components/pretendpro/TermsView";
import { localeTermsHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";

export const Route = createFileRoute("/$locale/terms")({
  head: ({ params }) =>
    localeTermsHead(isLocaleId(params.locale) ? params.locale : defaultLocale),
  component: TermsView,
});
