import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  redirect,
  useRouter,
  useRouterState,

  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { AppearanceEffect } from "@/components/pretendpro/AppearanceToggle";
import { Toaster } from "@/components/ui/sonner";
import { isLocaleId, localeMeta } from "@/lib/i18n/locales";
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

/**
 * Content-Security-Policy delivered via meta tag (the static host serves HTML
 * without custom response headers). Tightest policy that allows every
 * third-party resource the app loads:
 * - cdn.jsdelivr.net: FontAwesome stylesheet + webfonts
 * - policies.termageddon.com: privacy/terms embed script + iframe
 * - api.openverse.org: CC image/audio search API (fetch)
 * - arbitrary https: images/audio: Openverse returns third-party media URLs
 *   (thumbnails, audio files) hosted anywhere on the internet
 * - app.aikido.dev: security badge on the licenses page (covered by https:)
 * Inline styles need 'unsafe-inline' (React inline styles + critical CSS);
 * scripts do not (no inline scripts; JSON-LD blocks are non-executable).
 * NOTE: frame-ancestors cannot be set via meta tag — it needs a response
 * header if clickjacking protection is wanted.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' https://policies.termageddon.com",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://policies.termageddon.com",
  "font-src 'self' https://cdn.jsdelivr.net",
  "img-src 'self' https:",
  "media-src 'self' https:",
  "connect-src 'self' https://api.openverse.org https://policies.termageddon.com",
  "frame-src https://policies.termageddon.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
].join("; ");

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { httpEquiv: "Content-Security-Policy", content: CONTENT_SECURITY_POLICY },
      { title: "PretendPro Office Suite — Fake Productivity Suite" },
      {
        name: "description",
        content:
          "PretendPro Office Suite is a playful parody office suite for pretending to work: DocuFaker, SheetShenanigans, BrowserBuddy and Inbox Mirage.",
      },
      { name: "author", content: "PretendPro Office Suite" },
      { property: "og:title", content: "PretendPro Office Suite — Fake Productivity Suite" },
      {
        property: "og:description",
        content:
          "A cheerful parody office suite for getting absolutely nothing done, in three desktop styles.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "PretendPro Office Suite" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#2280f5" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "PretendPro" },
      { name: "application-name", content: "PretendPro Office Suite" },
      {
        name: "google-site-verification",
        content: "ULZC7bFseAJWc-94iAzz-yz_iDCOB98k-y7sV6YzGjw",
      },

    ],
    // Critical CSS: paints the correct background and font instantly while the
    // (small, Brotli-compressed) stylesheet is still in flight — no flash of
    // unstyled or wrong-scheme background on first paint.
    styles: [
      {
        children:
          "html{background:oklch(0.965 0.02 95)}html.dark{background:oklch(0.2 0.03 280)}body{margin:0;font-family:'Nebula Sans',system-ui,-apple-system,'Segoe UI',sans-serif}",
      },
    ],
    links: [
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.3.1/css/all.min.css" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/NebulaSans-Book.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/NebulaSans-Semibold.woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      // iOS home-screen splash screens (iOS ignores the manifest for these).
      {
        rel: "apple-touch-startup-image",
        href: "/splash-750x1334.png",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash-1125x2436.png",
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash-1170x2532.png",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash-1290x2796.png",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash-1620x2160.png",
        media:
          "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash-2160x1620.png",
        media:
          "(device-width: 1080px) and (device-height: 810px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://pretend.pro/#organization",
          name: "PretendPro Office Suite",
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
          name: "PretendPro Office Suite",
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const first = pathname.split("/").filter(Boolean)[0];
  const htmlLang = isLocaleId(first) ? localeMeta(first).htmlLang : "en";
  return (
    <html lang={htmlLang || "en"}>
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
      <Toaster />
    </QueryClientProvider>
  );
}
