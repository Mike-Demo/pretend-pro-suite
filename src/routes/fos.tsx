import { createFileRoute, redirect } from "@tanstack/react-router";
import { defaultLocale } from "@/lib/i18n/locales";
import { parseLegacyAppSearch } from "@/lib/pretendpro/search";

/**
 * Legacy unprefixed URL. Locale folders are canonical now, so send visitors and
 * crawlers to the default-locale page and keep old links working.
 */
export const Route = createFileRoute("/fos")({
  validateSearch: parseLegacyAppSearch,
  beforeLoad: ({ search }) => {
    throw redirect(
      search.app
        ? {
            to: "/$locale/fos/$app/",
            params: { locale: defaultLocale, app: search.app },
            replace: true,
          }
        : { to: "/$locale/fos/", params: { locale: defaultLocale }, replace: true },
    );
  },
});
