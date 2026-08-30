import { Link } from "@tanstack/react-router";
import { SocialFooter } from "@/components/pretendpro/SocialFooter";
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
    name: "Procrastinate icon (site favicon)",
    author: "Parzival' 1997",
    license: "Flaticon Free License (attribution required)",
    url: "https://www.flaticon.com/free-icons/procrastinate",
    note: "Procrastinate icons created by Parzival' 1997 - Flaticon. Used as the site favicon.",
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
    <div data-design="fluent" className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/$locale"
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

        <Section title={t.licenses.artwork} entries={assets} />
        <Section title={t.licenses.libraries} entries={libraries} />
        <Section title={t.licenses.references} entries={references} />

        <p className="mt-10 text-[11px] text-muted-foreground">{t.licenses.disclaimer}</p>

        <SocialFooter className="mt-6" locale={locale} />
      </div>
    </div>
  );
}
