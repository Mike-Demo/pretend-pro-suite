import { createFileRoute } from "@tanstack/react-router";
import { AboutView } from "@/components/pretendpro/AboutView";
import { localeAboutHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";

export const Route = createFileRoute("/$locale/about")({
  head: ({ params }) =>
    localeAboutHead(isLocaleId(params.locale) ? params.locale : defaultLocale),
  component: AboutView,
});
