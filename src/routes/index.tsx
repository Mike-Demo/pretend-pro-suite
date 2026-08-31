import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Onboarding } from "@/components/pretendpro/Onboarding";
import { I18nProvider } from "@/lib/i18n/context";
import { defaultLocale, detectLocale } from "@/lib/i18n/locales";
import { alternateLinks } from "@/lib/i18n/head";
import { illustrations } from "@/components/pretendpro/Illustration";
import {
  socialOgImage,
  socialOgImageAlt,
  socialOgImageHeight,
  socialOgImageWidth,
  webPageJsonLd,
} from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PretendPro Office Suite — Set Up Your Fake Workday" },
      {
        name: "description",
        content:
          "Answer two questions and PretendPro Office Suite builds your ideal fake workday: pick the work you want to mimic and the window style that feels most like your job.",
      },
      { property: "og:title", content: "PretendPro Office Suite — Set Up Your Fake Workday" },
      {
        property: "og:description",
        content:
          "A wholesome parody office suite onboarding: choose your pretend work and your pretend operating system.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pretend.pro/" },
      { property: "og:image", content: socialOgImage },
      { property: "og:image:width", content: String(socialOgImageWidth) },
      { property: "og:image:height", content: String(socialOgImageHeight) },
      { property: "og:image:alt", content: socialOgImageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PretendPro Office Suite — Set Up Your Fake Workday" },
      {
        name: "twitter:description",
        content:
          "A wholesome parody office suite onboarding: choose your pretend work and your pretend operating system.",
      },
      { name: "twitter:image", content: socialOgImage },
      { name: "twitter:image:alt", content: socialOgImageAlt },
    ],
    links: [
      { rel: "canonical", href: "https://pretend.pro/" },
      ...alternateLinks(""),
      {
        rel: "preload",
        as: "image",
        href: illustrations.pondering.webp,
        type: "image/webp",
        fetchpriority: "high",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: webPageJsonLd({
          name: "PretendPro Office Suite — Set Up Your Fake Workday",
          url: "https://pretend.pro/",
          description:
            "Answer two questions and PretendPro Office Suite builds your ideal fake workday.",
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();

  // The unprefixed page is the crawlable x-default. Once hydrated, send people
  // to the locale folder that matches their saved choice or browser language.
  useEffect(() => {
    const detected = detectLocale();
    if (detected !== defaultLocale) {
      void navigate({ to: "/$locale", params: { locale: detected }, replace: true });
    }
  }, [navigate]);

  return (
    <I18nProvider locale={defaultLocale}>
      <Onboarding />
    </I18nProvider>
  );
}
