import { createFileRoute } from "@tanstack/react-router";
import { ContactView } from "@/components/pretendpro/ContactView";
import { localeContactHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";

export const Route = createFileRoute("/$locale/contact")({
  head: ({ params }) =>
    localeContactHead(isLocaleId(params.locale) ? params.locale : defaultLocale),
  component: ContactView,
});
