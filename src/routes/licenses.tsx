import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/licenses")({
  head: () => ({
    meta: [
      { title: "Open Source Licenses — PretendPro 3000" },
      {
        name: "description",
        content:
          "Attribution and license information for the open source illustrations, icons, and libraries used to build PretendPro 3000.",
      },
      { property: "og:title", content: "Open Source Licenses — PretendPro 3000" },
      {
        property: "og:description",
        content: "Every open source work used in PretendPro 3000, with author, license, and link.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LicensesPage,
});

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
    name: "Lucide icons",
    author: "Lucide contributors",
    license: "ISC",
    url: "https://lucide.dev/license",
  },
];

const libraries: Entry[] = [
  { name: "React", author: "Meta and contributors", license: "MIT", url: "https://github.com/facebook/react" },
  {
    name: "TanStack Router / Start / Query",
    author: "Tanner Linsley and contributors",
    license: "MIT",
    url: "https://github.com/TanStack",
  },
  { name: "Tailwind CSS", author: "Tailwind Labs", license: "MIT", url: "https://github.com/tailwindlabs/tailwindcss" },
  { name: "shadcn/ui", author: "shadcn", license: "MIT", url: "https://github.com/shadcn-ui/ui" },
  {
    name: "Fluent UI (Fluent 2 design system)",
    author: "Microsoft",
    license: "MIT",
    url: "https://github.com/microsoft/fluentui",
    note: "Fluent 2 design language used for this site's pages and the Apperture window style. Contributions follow the Microsoft Open Source Code of Conduct. No Fluent UI packages are bundled; tokens were recreated in CSS.",
  },
  { name: "Radix UI", author: "WorkOS", license: "MIT", url: "https://github.com/radix-ui/primitives" },
  { name: "Sonner", author: "Emil Kowalski", license: "MIT", url: "https://github.com/emilkowalski/sonner" },
  { name: "Vite", author: "Evan You and contributors", license: "MIT", url: "https://github.com/vitejs/vite" },
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
];

function Section({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <ul className="mt-3 space-y-3">
        {entries.map((entry) => (
          <li key={entry.name} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-bold text-card-foreground">{entry.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {entry.author} — {entry.license}
            </p>
            {entry.note && <p className="mt-1 text-xs text-muted-foreground">{entry.note}</p>}
            <a
              href={entry.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-block text-xs font-semibold text-primary underline"
            >
              {entry.url}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LicensesPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-xs font-semibold text-muted-foreground underline hover:text-foreground">
          Back to onboarding
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
          Open Source Licenses
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          PretendPro 3000 is a parody built on generous open source work. Everything used is listed
          below with its author, license, and a link to the original project.
        </p>

        <Section title="Artwork & icons" entries={assets} />
        <Section title="Libraries" entries={libraries} />
        <Section title="Design references" entries={references} />

        <p className="mt-10 text-[11px] text-muted-foreground">
          PretendPro 3000 is not affiliated with Apple, Microsoft, or Google. All OS styles are
          affectionate parodies.
        </p>
      </div>
    </div>
  );
}
