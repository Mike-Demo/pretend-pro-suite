import { createFileRoute, redirect } from "@tanstack/react-router";
import { defaultLocale } from "@/lib/i18n/locales";

/** Legacy unprefixed URL — the locale folder version is canonical. */
export const Route = createFileRoute("/licenses")({
  beforeLoad: () => {
    throw redirect({
      to: "/$locale/licenses/",
      params: { locale: defaultLocale },
      replace: true,
    });
  },
});
