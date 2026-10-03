import { Link } from "@tanstack/react-router";
import { SocialFooter } from "@/components/pretendpro/SocialFooter";
import { BrandLockup } from "@/components/pretendpro/BrandLockup";
import { LocalePicker } from "@/components/pretendpro/LocalePicker";
import { useI18n } from "@/lib/i18n/context";

/** About copy is intentionally untranslated: identical text for every locale. */
export function AboutView() {
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

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          About PretendPro Office Suite
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A wholesome parody office suite for making realistic product screenshots and demos.
        </p>

        <div className="fluent-surface mt-8 space-y-6 p-6 sm:p-8">
          <section>
            <h2 className="text-lg font-semibold text-foreground">What it is</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              PretendPro Office Suite is a collection of browser-based fake-content demo
              tools: fake code editors, inboxes, documents, onboarding flows, and social
              mockups. It boots a pretend operating system full of useless-but-convincing
              fake apps, so you can take screenshots and record demos that look like real
              work without using any real data. Everything on the site is fictional:
              imaginary coworkers, nonsense documents, stock-photo slides.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Why it exists</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Good product demos need realistic-looking screens, but real screens contain
              real data. PretendPro is convincingly fake on purpose: imaginary coworkers
              with imaginary deadlines, nonsense documents typed with total conviction,
              stock-photo slides presented with fake confidence. Nothing here is real, so
              nothing can leak.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">What you get</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>
                Eleven parody apps: DocuFaker, SheetShenanigans, BrowserBuddy, Inbox Mirage,
                CodeFaker, CodeFaker: Game, DeckDreamer, ReaderRealm, PhotoPretender,
                ReelPretender, and SoundStage.
              </li>
              <li>
                Five pretend operating systems: Fruit (Mac OS X style), Apperture (Windows
                style), BufferiumOS, Android, and fOS.
              </li>
              <li>
                Six locales: US, Canadian, UK, Austrian, and Australian English — plus
                tlhIngan Hol (Klingon).
              </li>
              <li>Zero cost, zero accounts. Everything runs in your browser. Free forever.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Who made it</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              PretendPro was built by Mike &ldquo;Demo&rdquo; Demopoulos, a partnerships
              leader in cloud infrastructure and hosting who also builds playful AI
              workflow tooling. The suite is open source at{" "}
              <a
                href="https://github.com/Mike-Demo/pretend-pro-suite"
                className="fluent-focus text-primary hover:underline"
              >
                github.com/Mike-Demo/pretend-pro-suite
              </a>
              . Bug reports and edition ideas are welcome there.
            </p>
          </section>
        </div>

        <SocialFooter className="mt-6" locale={locale} />
      </div>
    </main>
  );
}
