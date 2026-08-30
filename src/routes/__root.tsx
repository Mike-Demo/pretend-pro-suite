import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  redirect,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { AppearanceEffect } from "@/components/pretendpro/AppearanceToggle";
import { getCaptchaGate } from "@/lib/captcha/verify.functions";
import { captchaClientFlag, isOpenPath } from "@/lib/captcha/session";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ location }) => {
    if (isOpenPath(location.pathname)) return;
    if (typeof window !== "undefined" && window.sessionStorage.getItem(captchaClientFlag) === "1") {
      return;
    }

    const gate = await getCaptchaGate();

    if (!gate.configured) return;
    if (gate.verified) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(captchaClientFlag, "1");
      }
      return;
    }

    throw redirect({ to: "/verify", search: { redirect: location.href } });
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PretendPro 3000 — Fake Productivity Suite" },
      {
        name: "description",
        content:
          "PretendPro 3000 is a playful parody office suite for pretending to work: DocuFaker, SheetShenanigans, BrowserBuddy and Inbox Mirage.",
      },
      { name: "author", content: "PretendPro 3000" },
      { property: "og:title", content: "PretendPro 3000 — Fake Productivity Suite" },
      {
        property: "og:description",
        content:
          "A cheerful parody office suite for getting absolutely nothing done, in three desktop styles.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "PretendPro 3000" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#e9639c" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "PretendPro" },
      { name: "application-name", content: "PretendPro 3000" },
    ],
    // Critical CSS: paints the correct background and font instantly while the
    // (small, Brotli-compressed) stylesheet is still in flight — no flash of
    // unstyled or wrong-scheme background on first paint.
    styles: [
      {
        children:
          "html{background:oklch(0.965 0.02 95)}html.dark{background:oklch(0.2 0.03 280)}body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',sans-serif}",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
        integrity: "sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==",
        crossOrigin: "anonymous",
        referrerPolicy: "no-referrer",
      },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://pretend.pro/#organization",
          name: "PretendPro 3000",
          url: "https://pretend.pro/",
          logo: {
            "@type": "ImageObject",
            url: "https://pretend.pro/apple-touch-icon.png",
            width: 180,
            height: 180,
          },
          sameAs: [
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
          "@type": "WebSite",
          "@id": "https://pretend.pro/#website",
          url: "https://pretend.pro/",
          name: "PretendPro 3000",
          description:
            "A playful parody productivity suite with five pretend operating-system editions.",
          publisher: { "@id": "https://pretend.pro/#organization" },
          inLanguage: "en",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <AppearanceEffect />
      <Outlet />
    </QueryClientProvider>
  );
}
