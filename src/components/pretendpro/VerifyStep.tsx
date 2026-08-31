import { useEffect, useRef, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { CaptchaGate } from "@/lib/captcha/verify.functions";

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

/**
 * The hCaptcha human check rendered inside the onboarding card. The parent owns
 * the token and submits it, so the OS transition stays on the Continue click.
 */
export function VerifyStep({
  gate,
  onToken,
  error,
  resetKey,
}: {
  gate: CaptchaGate;
  onToken: (token: string | null) => void;
  error: string | null;
  resetKey: number;
}) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [widgetError, setWidgetError] = useState<string | null>(null);

  // Clear the widget whenever the parent bumps the reset key (failed verify).
  useEffect(() => {
    if (resetKey === 0) return;
    window.hcaptcha?.reset(widgetIdRef.current ?? undefined);
    onToken(null);
  }, [resetKey, onToken]);

  useEffect(() => {
    if (!gate.configured || !gate.siteKey) return;

    const render = () => {
      const container = containerRef.current;
      if (!container || !window.hcaptcha || widgetIdRef.current !== null) return;
      const isDark = document.documentElement.classList.contains("dark");
      widgetIdRef.current = window.hcaptcha.render(container, {
        sitekey: gate.siteKey as string,
        theme: isDark ? "dark" : "light",
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(null),
        "error-callback": () => {
          onToken(null);
          setWidgetError(t.onboarding.verifyWidgetError);
        },
      });
      setLoading(false);
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
      script.onerror = () => setWidgetError(t.onboarding.verifyLoadError);
      document.head.appendChild(script);
    }
  }, [gate.configured, gate.siteKey, onToken, t.onboarding.verifyLoadError, t.onboarding.verifyWidgetError]);

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <ShieldCheck className="h-6 w-6" aria-hidden="true" />
      </span>
      <div ref={containerRef} className="flex min-h-[78px] items-center justify-center" />
      {loading && !widgetError && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t.onboarding.verifyLoading}
        </p>
      )}
      {(error ?? widgetError) && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error ?? widgetError}
        </p>
      )}
    </div>
  );
}
