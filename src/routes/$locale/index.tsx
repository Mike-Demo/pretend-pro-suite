import { createFileRoute } from "@tanstack/react-router";
import { Onboarding } from "@/components/pretendpro/Onboarding";
import { illustrations } from "@/components/pretendpro/Illustration";
import { localeHomeHead } from "@/lib/i18n/head";
import { defaultLocale, isLocaleId } from "@/lib/i18n/locales";

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => {
    const locale = isLocaleId(params.locale) ? params.locale : defaultLocale;
    const head = localeHomeHead(locale);
    return {
      ...head,
      links: [
        ...head.links,
        {
          rel: "preload",
          as: "image",
          href: illustrations.pondering.webp,
          type: "image/webp",
          fetchpriority: "high",
        },
      ],
    };
  },
  component: Onboarding,
});
