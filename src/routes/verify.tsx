import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

import { AppearanceToggle } from "@/components/pretendpro/AppearanceToggle";
import { getCaptchaGate, verifyCaptcha } from "@/lib/captcha/verify.functions";
import { captchaClientFlag, safeRedirect } from "@/lib/captcha/session";

export const Route = createFileRoute("/verify")({
  validateSearch: (search: Record<string, unknown>): { redirect: string } => ({
    redirect: safeRedirect(search["redirect"]),
  }),
  loader: () => getCaptchaGate(),
  head: () => ({
    meta: [
      { title: "Human Check — PretendPro 3000" },
      {
        name: "description",
        content:
          "Confirm you are a human before entering PretendPro 3000, the parody productivity suite for pretending to work.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Human Check — PretendPro 3000" },
      {
        property: "og:description",
        content: "A quick hCaptcha check before your fake workday begins.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerifyPage,
});

interface HcaptchaApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  reset: (id?: string) => void;
}

declare global {
  interface Window {
    hcaptcha?: HcaptchaApi;
  }
}

const scriptSrc = "https://js.hcaptcha.com/1/api.js?render=explicit&onload=pretendProHcaptchaReady";

type Status = "loading" | "ready" | "checking" | "error";

function VerifyPage() {
  const gate = Route.useLoaderData();
  const { redirect } = Route.useSearch();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string | null>(null);

  const target = safeRedirect(redirect);

  const handleToken = useCallback(
    async (token: string) => {
      setStatus("checking");
      setMessage(null);
      try {
        const result = await verifyCaptcha({ data: { token } });
        if (!result.ok) {
          setStatus("error");
          setMessage("That check didn't pass. Give it one more try.");
          window.hcaptcha?.reset(widgetIdRef.current ?? undefined);
          return;
        }
        window.sessionStorage.setItem(captchaClientFlag, "1");
        window.location.assign(target);
      } catch {
        setStatus("error");
        setMessage("We couldn't reach the check service. Please try again.");
        window.hcaptcha?.reset(widgetIdRef.current ?? undefined);
      }
    },
    [target],
  );

  useEffect(() => {
    if (!gate.configured || !gate.siteKey) return;
    if (gate.verified) {
      window.sessionStorage.setItem(captchaClientFlag, "1");
      window.location.assign(target);
      return;
    }

    const render = () => {
      const container = containerRef.current;
      if (!container || !window.hcaptcha || widgetIdRef.current !== null) return;
      const isDark = document.documentElement.classList.contains("dark");
      widgetIdRef.current = window.hcaptcha.render(container, {
        sitekey: gate.siteKey as string,
        theme: isDark ? "dark" : "light",
        callback: (token: string) => {
          void handleToken(token);
        },
        "expired-callback": () => setStatus("ready"),
        "error-callback": () => {
          setStatus("error");
          setMessage("The check widget hit a snag. Try again.");
        },
      });
      setStatus("ready");
    };

    (window as unknown as Record<string, unknown>)["pretendProHcaptchaReady"] = render;

    if (window.hcaptcha) {
      render();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${scriptSrc}"]`);
    if (!existing) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        setStatus("error");
        setMessage("The check couldn't load. Check your connection and refresh.");
      };
      document.head.appendChild(script);
    }
  }, [gate.configured, gate.siteKey, gate.verified, handleToken, target]);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-8">
        <span className="text-sm font-semibold tracking-tight">PretendPro 3000</span>
        <AppearanceToggle />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="size-6" aria-hidden />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Prove you&apos;re a human pretending to work
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            One quick check and we&apos;ll take you straight where you were headed.
          </p>

          {gate.configured ? (
            <div className="mt-6 flex flex-col items-center gap-3">
              <div ref={containerRef} className="flex min-h-[78px] items-center justify-center" />
              {status === "loading" || status === "checking" ? (
                <p
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  role="status"
                  aria-live="polite"
                >
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  {status === "checking" ? "Verifying…" : "Loading the check…"}
                </p>
              ) : null}
              {message ? (
                <p className="text-sm font-medium text-destructive" role="alert">
                  {message}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              <p>
                The human check isn&apos;t configured yet, so the door is open. Add hCaptcha keys to
                switch it on.
              </p>
              <a
                href={target}
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Continue
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
