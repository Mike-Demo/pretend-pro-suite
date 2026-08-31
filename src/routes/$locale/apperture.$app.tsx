import { createFileRoute, notFound } from "@tanstack/react-router";
import type { AppId } from "@/components/pretendpro/chrome";
import { Suite } from "@/components/pretendpro/Suite";
import { localeEditionHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";
import { isAppId } from "@/lib/pretendpro/app-ids";

export const Route = createFileRoute("/$locale/apperture/$app")({
  beforeLoad: ({ params }) => {
    if (!isAppId(params.app)) throw notFound();
  },
  head: ({ params }) =>
    isAppId(params.app)
      ? localeEditionHead(
          isLocaleId(params.locale) ? params.locale : defaultLocale,
          "apperture",
          params.app,
        )
      : { meta: [{ name: "robots", content: "noindex" }] },
  component: AppertureAppPage,
});

function AppertureAppPage() {
  const { app } = Route.useParams();
  return <Suite osTheme="apperture" initialApp={app as AppId} />;
}
