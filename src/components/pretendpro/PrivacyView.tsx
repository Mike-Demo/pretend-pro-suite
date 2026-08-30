import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { SocialFooter } from "@/components/pretendpro/SocialFooter";
import { BrandLockup } from "@/components/pretendpro/BrandLockup";
import { LocalePicker } from "@/components/pretendpro/LocalePicker";
import { useI18n } from "@/lib/i18n/context";

const EMBED_SCRIPT_SRC = "https://policies.termageddon.com/api/embed/c/TkV3eGQwSXJRWE5aUmsxd1VHYzlQUT09.js";
const EMBED_DIV_ID = "TkV3eGQwSXJRWE5aUmsxd1VHYzlQUT09";

export function PrivacyView() {
  const { locale, t } = useI18n();
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
            {t.privacy.back}
          </Link>
          <LocalePicker className="ml-auto" />
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          {t.privacy.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.privacy.intro}</p>

        <section
          ref={containerRef}
          className="fluent-surface mt-8 min-h-[480px] p-4 sm:p-6"
          aria-label="Privacy policy embed"
        >
          <div
            id={EMBED_DIV_ID}
            className="policy_embed_div"
            style={{ width: "100%", minHeight: "480px" }}
            aria-live="polite"
            aria-busy="true"
          >
            {t.privacy.loading}{" "}
            <a
              rel="nofollow noopener noreferrer"
              aria-label={t.privacy.fallbackLabel}
              href={t.privacy.fallbackLink}
              target="_blank"
              className="fluent-focus text-primary hover:underline"
            >
              {t.privacy.fallbackLabel}
            </a>
            .
          </div>
        </section>

        <SocialFooter className="mt-6" />
      </div>
    </div>
  );
}
