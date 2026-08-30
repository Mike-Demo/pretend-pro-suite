import { createFileRoute } from "@tanstack/react-router";
import { LicensesView } from "@/components/pretendpro/LicensesView";
import { localeLicensesHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";

export const Route = createFileRoute("/$locale/licenses")({
  head: ({ params }) =>
    localeLicensesHead(isLocaleId(params.locale) ? params.locale : defaultLocale),
  component: LicensesView,
});
