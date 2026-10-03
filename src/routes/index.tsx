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
  webApplicationJsonLd,
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
      { rel: "alternate", type: "text/markdown", href: "https://pretend.pro/index.md" },
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
      {
        type: "application/ld+json",
        children: webApplicationJsonLd(),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://pretend.pro/#organization",
          name: "PretendPro Office Suite",
          url: "https://pretend.pro/",
          description:
            "Wholesome parody office suite: browser-based fake-content demo tools for realistic product screenshots and demos.",
          sameAs: [
            "https://github.com/Mike-Demo",
            "https://www.linkedin.com/in/mikedemopoulos",
            "https://x.com/mike_demo",
            "https://www.threads.com/@mdemop",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is PretendPro Office Suite?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "PretendPro Office Suite is a wholesome parody office suite: browser-based fake-content demo tools (fake code editors, inboxes, documents, onboarding flows, social mockups) for making realistic product screenshots and demos. Everything on the site is fictional.",
              },
            },
            {
              "@type": "Question",
              name: "Is PretendPro free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. PretendPro is free forever, with no accounts, no tiers, and no paid plans. Everything runs in your browser.",
              },
            },
            {
              "@type": "Question",
              name: "Does PretendPro have an API?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. PretendPro is a fully client-side static site with no public API, no OAuth, no accounts, and no MCP server.",
              },
            },
            {
              "@type": "Question",
              name: "Is any of the content on PretendPro real?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. Every coworker name, email, document, and code sample is fictional parody. Nothing on the site is real user data.",
              },
            },
          ],
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
      void navigate({ to: "/$locale/", params: { locale: detected }, replace: true });
    }
  }, [navigate]);

  return (
    <I18nProvider locale={defaultLocale}>
      <Onboarding />
    </I18nProvider>
  );
}
