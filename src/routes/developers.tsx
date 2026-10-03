import { createFileRoute, redirect } from "@tanstack/react-router";
import { defaultLocale } from "@/lib/i18n/locales";

/** Legacy unprefixed URL — the locale folder version is canonical. */
export const Route = createFileRoute("/developers")({
  beforeLoad: () => {
    throw redirect({
      to: "/$locale/developers/",
      params: { locale: defaultLocale },
      replace: true,
    });
  },
});
