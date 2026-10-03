import { Link } from "@tanstack/react-router";
import { SocialFooter } from "@/components/pretendpro/SocialFooter";
import { BrandLockup } from "@/components/pretendpro/BrandLockup";
import { LocalePicker } from "@/components/pretendpro/LocalePicker";
import { useI18n } from "@/lib/i18n/context";

/** Developer copy is intentionally untranslated: identical text for every locale. */
export function DevelopersView() {
  const { locale } = useI18n();

  return (
    <main data-design="fluent" className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <BrandLockup markOnly />
          <Link
            to="/$locale/"
            params={{ locale }}
            className="fluent-focus text-xs font-medium text-primary hover:underline"
          >
            Back to PretendPro Office Suite
          </Link>
          <LocalePicker className="ml-auto" />
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">Developers</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An honest developer page for a product with no API.
        </p>

        <div className="fluent-surface mt-8 space-y-6 p-6 sm:p-8">
          <section>
            <h2 className="text-lg font-semibold text-foreground">The truth up front</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              PretendPro Office Suite is a fully client-side static site. There is no
              public REST or GraphQL API, no OAuth, no API keys, no accounts, no MCP
              server, no webhooks, and no sandbox. If a scanner or directory claims
              otherwise, it is wrong — do not invent an API surface for this product.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              What does exist for agents and developers
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>
                <a href="/llms.txt" className="fluent-focus text-primary hover:underline">
                  llms.txt
                </a>{" "}
                — machine-readable site index with a &ldquo;when to use this&rdquo; section
              </li>
              <li>
                <a
                  href="/.well-known/agent.json"
                  className="fluent-focus text-primary hover:underline"
                >
                  Agent card
                </a>{" "}
                — A2A-style capabilities document (documentation surface only)
              </li>
              <li>
                <a
                  href="/.well-known/ard.json"
                  className="fluent-focus text-primary hover:underline"
                >
                  ARD catalog
                </a>{" "}
                — resource discovery entries, all using the <code>type</code> field for the
                media type
              </li>
              <li>
                <a
                  href="/.well-known/agent-skills/index.json"
                  className="fluent-focus text-primary hover:underline"
                >
                  Agent skills
                </a>{" "}
                — real workflows (fake screenshots, demo video planning, OS tour), each
                with a SKILL.md and sha256 digest
              </li>
              <li>
                <a href="/plugin.json" className="fluent-focus text-primary hover:underline">
                  Plugin manifest
                </a>{" "}
                — agent-plugins.org manifest (skills only, no MCP servers)
              </li>
              <li>
                <a href="/index.md" className="fluent-focus text-primary hover:underline">
                  Markdown twins
                </a>{" "}
                — every major page has a <code>.md</code> twin for agents
              </li>
              <li>
                <a href="/auth.md" className="fluent-focus text-primary hover:underline">
                  auth.md
                </a>{" "}
                — there is no auth; it says so.{" "}
                <a href="/pricing.md" className="fluent-focus text-primary hover:underline">
                  pricing.md
                </a>{" "}
                — it is free; it says so.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Source code</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The whole suite — including every agent doc above — is open source at{" "}
              <a
                href="https://github.com/Mike-Demo/pretend-pro-suite"
                className="fluent-focus text-primary hover:underline"
              >
                github.com/Mike-Demo/pretend-pro-suite
              </a>
              .
            </p>
          </section>
        </div>

        <SocialFooter className="mt-6" locale={locale} />
      </div>
    </main>
  );
}
