import { createFileRoute } from "@tanstack/react-router";
import { PrivacyView } from "@/components/pretendpro/PrivacyView";
import { localePrivacyHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";

export const Route = createFileRoute("/$locale/privacy")({
  head: ({ params }) =>
    localePrivacyHead(isLocaleId(params.locale) ? params.locale : defaultLocale),
  component: PrivacyView,
});
