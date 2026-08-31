import { createFileRoute, notFound } from "@tanstack/react-router";
import type { AppId } from "@/components/pretendpro/chrome";
import { Suite } from "@/components/pretendpro/Suite";
import { localeEditionHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";
import { isAppId } from "@/lib/pretendpro/app-ids";

export const Route = createFileRoute("/$locale/fos/$app")({
  beforeLoad: ({ params }) => {
    if (!isAppId(params.app)) throw notFound();
  },
  head: ({ params }) =>
    isAppId(params.app)
      ? localeEditionHead(
          isLocaleId(params.locale) ? params.locale : defaultLocale,
          "fos",
          params.app,
        )
      : { meta: [{ name: "robots", content: "noindex" }] },
  component: FosAppPage,
});

function FosAppPage() {
  const { app } = Route.useParams();
  return <Suite osTheme="fos" initialApp={app as AppId} />;
}
