import { createFileRoute } from "@tanstack/react-router";
import { DevelopersView } from "@/components/pretendpro/DevelopersView";
import { localeDevelopersHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";

export const Route = createFileRoute("/$locale/developers")({
  head: ({ params }) =>
    localeDevelopersHead(isLocaleId(params.locale) ? params.locale : defaultLocale),
  component: DevelopersView,
});
