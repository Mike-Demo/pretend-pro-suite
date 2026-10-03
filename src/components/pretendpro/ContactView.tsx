import { Link } from "@tanstack/react-router";
import { SocialFooter } from "@/components/pretendpro/SocialFooter";
import { BrandLockup } from "@/components/pretendpro/BrandLockup";
import { LocalePicker } from "@/components/pretendpro/LocalePicker";
import { useI18n } from "@/lib/i18n/context";

/** Contact copy is intentionally untranslated: identical text for every locale. */
export function ContactView() {
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

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">Contact</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          PretendPro is a free parody side project — there is no support desk, no ticket
          queue, and no sales team.
        </p>

        <div className="fluent-surface mt-8 space-y-6 p-6 sm:p-8">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Bug reports and ideas</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The best way to reach us is a GitHub issue on the open-source repo:{" "}
              <a
                href="https://github.com/Mike-Demo/pretend-pro-suite"
                className="fluent-focus text-primary hover:underline"
              >
                github.com/Mike-Demo/pretend-pro-suite
              </a>
              . Found a typo in a fake inbox? Have an idea for a twelfth parody app? That
              is the place.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Public profiles</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>
                GitHub:{" "}
                <a
                  href="https://github.com/Mike-Demo"
                  className="fluent-focus text-primary hover:underline"
                >
                  github.com/Mike-Demo
                </a>
              </li>
              <li>
                LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/mikedemopoulos"
                  className="fluent-focus text-primary hover:underline"
                >
                  linkedin.com/in/mikedemopoulos
                </a>
              </li>
              <li>
                X:{" "}
                <a
                  href="https://x.com/mike_demo"
                  className="fluent-focus text-primary hover:underline"
                >
                  x.com/mike_demo
                </a>
              </li>
              <li>
                Threads:{" "}
                <a
                  href="https://www.threads.com/@mdemop"
                  className="fluent-focus text-primary hover:underline"
                >
                  threads.com/@mdemop
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">A note on the content</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Every coworker name, email, document, and code sample on pretend.pro is
              fictional parody. If something on the site looks like it is about a real
              person, that is a coincidence — please say so via a GitHub issue and it
              will be changed.
            </p>
          </section>
        </div>

        <SocialFooter className="mt-6" locale={locale} />
      </div>
    </main>
  );
}
