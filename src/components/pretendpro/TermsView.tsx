import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { SocialFooter } from "@/components/pretendpro/SocialFooter";
import { BrandLockup } from "@/components/pretendpro/BrandLockup";
import { LocalePicker } from "@/components/pretendpro/LocalePicker";
import { useI18n } from "@/lib/i18n/context";

const EMBED_SCRIPT_SRC = "https://policies.termageddon.com/api/embed/c/YVdsTksyMVZUWE5MVVVKRFEyYzlQUT09.js";
const EMBED_DIV_ID = "YVdsTksyMVZUWE5MVVVKRFEyYzlQUT09";
const POLICY_URL = "https://policies.termageddon.com/api/policy/YVdsTksyMVZUWE5MVVVKRFEyYzlQUT09";

/** Legal copy is intentionally untranslated: identical text for every locale. */
export function TermsView() {
  const { locale } = useI18n();
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scriptRef.current) return;

    const script = document.createElement("script");
    script.src = EMBED_SCRIPT_SRC;
    script.async = true;
    scriptRef.current = script;

    const container = containerRef.current;
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      scriptRef.current = null;
    };
  }, []);

  return (
    <div data-design="fluent" className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <BrandLockup markOnly />
          <Link
            to="/$locale"
            params={{ locale }}
            className="fluent-focus text-xs font-medium text-primary hover:underline"
          >
            Back to PretendPro 3000
          </Link>
          <LocalePicker className="ml-auto" />
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Our terms of service are provided below. They load directly from Termageddon so they stay
          up to date.
        </p>

        <section
          ref={containerRef}
          className="fluent-surface mt-8 min-h-[480px] p-4 sm:p-6"
          aria-label="Terms of service embed"
        >
          <div
            id={EMBED_DIV_ID}
            className="policy_embed_div"
            style={{ width: "100%", minHeight: "480px" }}
            aria-live="polite"
            aria-busy="true"
          >
            Please wait while the policy is loaded. If it does not load, please{" "}
            <a
              rel="nofollow noopener noreferrer"
              aria-label="click here to view the policy"
              href={POLICY_URL}
              target="_blank"
              className="fluent-focus text-primary hover:underline"
            >
              click here to view the policy
            </a>
            .
          </div>
        </section>

        <SocialFooter className="mt-6" locale={locale} />
      </div>
    </div>
  );
}
