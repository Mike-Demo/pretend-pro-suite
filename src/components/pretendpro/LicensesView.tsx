import { Link } from "@tanstack/react-router";
import { SocialFooter } from "@/components/pretendpro/SocialFooter";
import { BrandLockup } from "@/components/pretendpro/BrandLockup";
import { LocalePicker } from "@/components/pretendpro/LocalePicker";
import { useI18n } from "@/lib/i18n/context";

type Entry = { name: string; author: string; license: string; url: string; note?: string };

const assets: Entry[] = [
  {
    name: "Transhumans illustrations",
    author: "Pablo Stanley",
    license: "CC0 1.0 Universal",
    url: "https://www.transhumans.xyz/",
    note: "Used for the onboarding artwork.",
  },
  {
    name: "Nebula Sans",
    author: "Nebula Entertainment & Broadcasting LLC",
    license: "SIL Open Font License 1.1",
    url: "https://www.nebulasans.com/license/",
    note: "Used as the site's default typeface. Based on Source Sans, with Reserved Font Name 'Nebula'.",
  },
  {
    name: "Openverse media catalog",
    author: "WordPress / Openverse and CC creators",
    license: "Various Creative Commons licenses",
    url: "https://openverse.org/",
    note: "Stock photos and audio shown in the fake apps are fetched live from the Openverse API. Each asset displays its own creator and license with a link to the source.",
  },
  {
    name: "Lucide icons",
    author: "Lucide contributors",
    license: "ISC",
    url: "https://lucide.dev/license",
  },
  {
    name: "Klingon icon",
    author: "Pictogrammers",
    license: "Apache License 2.0",
    url: "https://iconbuddy.com/mdi/klingon",
    note: "Used as the Klingon locale flag in the language picker.",
  },
  {
    name: "Onboarding step transition concept",
    author: "John Heiner",
    license: "CodePen demo, used as design inspiration",
    url: "https://codepen.io/johnheiner",
    note: "The staggered panel sweep between onboarding steps is inspired by a CodePen by John Heiner; the implementation here is original.",
  },
];


const libraries: Entry[] = [
  {
    name: "React",
    author: "Meta and contributors",
    license: "MIT",
    url: "https://github.com/facebook/react",
  },
  {
    name: "TanStack Router / Start / Query",
    author: "Tanner Linsley and contributors",
    license: "MIT",
    url: "https://github.com/TanStack",
  },
  {
    name: "Tailwind CSS",
    author: "Tailwind Labs",
    license: "MIT",
    url: "https://github.com/tailwindlabs/tailwindcss",
  },
  { name: "shadcn/ui", author: "shadcn", license: "MIT", url: "https://github.com/shadcn-ui/ui" },
  {
    name: "Fluent UI (Fluent 2 design system)",
    author: "Microsoft",
    license: "MIT",
    url: "https://github.com/microsoft/fluentui",
    note: "Fluent 2 design language used for this site's pages and the Apperture window style. Contributions follow the Microsoft Open Source Code of Conduct. No Fluent UI packages are bundled; tokens were recreated in CSS.",
  },
  {
    name: "Radix UI",
    author: "WorkOS",
    license: "MIT",
    url: "https://github.com/radix-ui/primitives",
  },
  {
    name: "Sonner",
    author: "Emil Kowalski",
    license: "MIT",
    url: "https://github.com/emilkowalski/sonner",
  },
  {
    name: "Vite",
    author: "Evan You and contributors",
    license: "MIT",
    url: "https://github.com/vitejs/vite",
  },
  {
    name: "Supabase",
    author: "Supabase, Inc.",
    license: "MIT (client libraries)",
    url: "https://github.com/supabase/supabase-js/blob/master/LICENSE",
  },
];

const references: Entry[] = [
  {
    name: "Apple macOS design resources",
    author: "Apple",
    license: "Reference only",
    url: "https://developer.apple.com/design/",
    note: "Inspiration for the Fruit window chrome. No Apple assets are included.",
  },
  {
    name: "Windows Fluent design docs",
    author: "Microsoft",
    license: "CC BY 4.0 (docs)",
    url: "https://github.com/MicrosoftDocs/windows-dev-docs",
    note: "Inspiration for the Apperture window chrome.",
  },
  {
    name: "ChromiumOS user experience docs",
    author: "The Chromium Authors",
    license: "BSD-3-Clause",
    url: "https://www.chromium.org/user-experience/",
    note: "Inspiration for the BufferiumOS window chrome.",
  },
  {
    name: "Material Components for Android",
    author: "Google and the Material Components authors",
    license: "Apache License 2.0",
    url: "https://github.com/material-components/material-components-android",
    note: "Design reference for the Android phone edition (shape, elevation, navigation bar). No Material packages are bundled.",
  },
  {
    name: "Material Components for iOS",
    author: "Google and the Material Components authors",
    license: "Apache License 2.0",
    url: "https://github.com/material-components/material-components-ios",
    note: "Design reference for the fOS phone edition (rounded icons, dock, home indicator). No Material packages are bundled.",
  },
];

function Section({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <ul className="mt-3 space-y-3">
        {entries.map((entry) => (
          <li key={entry.name} className="fluent-surface p-4">
            <p className="text-sm font-semibold text-card-foreground">{entry.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {entry.author} — {entry.license}
            </p>
            {entry.note && <p className="mt-1 text-xs text-muted-foreground">{entry.note}</p>}
            <a
              href={entry.url}
              target="_blank"
              rel="noreferrer noopener"
              className="fluent-focus mt-2 inline-block text-xs font-medium text-primary hover:underline"
            >
              {entry.url}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LicensesView() {
  const { locale, t } = useI18n();
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
            {t.licenses.back}
          </Link>
          <LocalePicker className="ml-auto" />
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          {t.licenses.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.licenses.intro}</p>
        <div className="mt-4">
        <a
          href="https://app.aikido.dev/audit-report/external/smlvhLoPnScdRnVeF7TjudEr/request"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Aikido Security Audit Report (opens in new tab)"
        >
          <img
            src="https://app.aikido.dev/assets/badges/full-light-theme.svg"
            alt="Aikido Security Audit Report"
            height={40}
          />
        </a>
        </div>

        <Section title={t.licenses.artwork} entries={assets} />
        <Section title={t.licenses.libraries} entries={libraries} />
        <Section title={t.licenses.references} entries={references} />

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Open source</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            This site's source code is on{" "}
            <a
              href="https://github.com/Mike-Demo/pretend-pro-suite"
              target="_blank"
              rel="noreferrer noopener"
              className="fluent-focus font-medium text-primary hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Digital carbon</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Homepage transfer is about 626.9 KB, roughly 0.095 g of CO2 per visit. Estimated with
            CO2.js using the Sustainable Web Design Model v4, measured 2026-09-27. Hosting:
            SpaceFast, which is not currently listed in the Green Web Foundation&apos;s green
            hosting dataset. Machine-readable disclosure:{" "}
            <a
              href="/carbon.txt"
              className="fluent-focus font-medium text-primary hover:underline"
            >
              /carbon.txt
            </a>
            .
          </p>
        </section>

        <p className="mt-10 text-[11px] text-muted-foreground">{t.licenses.disclaimer}</p>

        <SocialFooter className="mt-6" locale={locale} />
      </div>
    </main>
  );
}
