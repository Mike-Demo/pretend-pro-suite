import { createFileRoute, redirect } from "@tanstack/react-router";
import { defaultLocale } from "@/lib/i18n/locales";

/**
 * Legacy unprefixed URL. Locale folders are canonical now, so send visitors and
 * crawlers to the default-locale page and keep old links working.
 */
export const Route = createFileRoute("/android")({
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/$locale/android",
      params: { locale: defaultLocale },
      search,
      replace: true,
    });
  },
});
