import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppearanceToggle } from "@/components/pretendpro/AppearanceToggle";
import type { AppId } from "@/components/pretendpro/chrome";
import { osThemes, type OsTheme } from "@/components/pretendpro/WindowFrame";
import { themeRoutes } from "@/components/pretendpro/Suite";
import {
  Illustration,
  illustrations,
  type IllustrationName,
} from "@/components/pretendpro/Illustration";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PretendPro 3000 — Set Up Your Fake Workday" },
      {
        name: "description",
        content:
          "Answer two questions and PretendPro 3000 builds your ideal fake workday: pick the work you want to mimic and the window style that feels most like your job.",
      },
      { property: "og:title", content: "PretendPro 3000 — Set Up Your Fake Workday" },
      {
        property: "og:description",
        content:
          "A wholesome parody office suite onboarding: choose your pretend work and your pretend operating system.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pretend.pro/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PretendPro 3000 — Set Up Your Fake Workday" },
      {
        name: "twitter:description",
        content:
          "A wholesome parody office suite onboarding: choose your pretend work and your pretend operating system.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://pretend.pro/" },
      {
        rel: "preload",
        as: "image",
        href: illustrations.pondering.webp,
        type: "image/webp",
        fetchpriority: "high",
      },
    ],
  }),
  component: Onboarding,
});

const workOptions: Array<{ id: AppId; title: string; description: string; art: IllustrationName }> = [
  {
    id: "docufaker",
    title: "Deep Document Work",
    description: "Type nonsense paragraphs with total conviction.",
    art: "pondering",
  },
  {
    id: "sheets",
    title: "Spreadsheet Theater",
    description: "Formulas that mean nothing, charts that mean less.",
    art: "growth",
  },
  {
    id: "browser",
    title: "Research Browsing",
    description: "Tabs that look important. Mostly cat videos.",
    art: "coffee",
  },
  {
    id: "inbox",
    title: "Urgent Inbox Triage",
    description: "Imaginary coworkers, imaginary deadlines.",
    art: "experiments",
  },
  {
    id: "codeweb",
    title: "Code — Web",
    description: "TypeScript that compiles. Understanding optional.",
    art: "lookingAhead",
  },
  {
    id: "codegame",
    title: "Code — Game",
    description: "A game loop that loops. A game, eventually.",
    art: "feliz",
  },
  {
    id: "deck",
    title: "Presentation",
    description: "Slides with real stock photos and fake confidence.",
    art: "growth",
  },
  {
    id: "reader",
    title: "Reading Documents",
    description: "Very important PDFs. Read at your own pace. Forever.",
    art: "pondering",
  },
  {
    id: "photos",
    title: "Editing Photos",
    description: "Sliders that actually slide on real CC images.",
    art: "waiting",
  },
  {
    id: "reels",
    title: "Editing Videos",
    description: "A timeline of clips, a render of dreams.",
    art: "chillin",
  },
  {
    id: "sound",
    title: "Editing Sound",
    description: "Waveforms, transport, and real CC-licensed audio.",
    art: "coffee",
  },
];

type StyleOption = { id: OsTheme; description: string; art: IllustrationName };

const desktopStyles: StyleOption[] = [
  {
    id: "fruit",
    description: "Soft translucent bar, three little traffic lights.",
    art: "lookingAhead",
  },
  {
    id: "apperture",
    description: "Crisp corners, glyph buttons in the top-right.",
    art: "chillin",
  },
  { id: "bufferium", description: "A tab strip that is eternally almost loaded.", art: "waiting" },
];

const mobileStyles: StyleOption[] = [
  { id: "android", description: "Home screen grid, back / home / recents bar.", art: "growth" },
  { id: "fos", description: "Notch, rounded icons, a dock, a home indicator.", art: "feliz" },
];

function OptionCard({
  title,
  description,
  art,
  selected,
  onSelect,
  priority = false,
  onPrefetch,
  children,
}: {
  title: string;
  description: string;
  art: IllustrationName;
  selected: boolean;
  onSelect: () => void;
  priority?: boolean;
  onPrefetch?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      aria-pressed={selected}
      className={cn(
        "fluent-focus relative flex w-full flex-col items-center rounded-lg border bg-card p-4 text-center transition-all",
        selected
          ? "border-primary shadow-[var(--fluent-shadow-8)] ring-1 ring-primary"
          : "border-border shadow-[var(--fluent-shadow-2)] hover:border-primary/60 hover:shadow-[var(--fluent-shadow-8)]",
      )}
    >
      <span
        className={cn(
          "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-[1.5px]",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-foreground/40",
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
      <Illustration name={art} priority={priority} className="h-28 w-auto" />
      <span className="mt-3 text-sm font-semibold text-foreground">{title}</span>
      <span className="mt-1 text-xs text-muted-foreground">{description}</span>
      {children}
    </button>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [step, setStep] = useState<1 | 2>(1);
  const [work, setWork] = useState<AppId | null>(null);
  const [style, setStyle] = useState<OsTheme | null>(null);

  // Phones see the phone editions first; wide screens see the desktop ones first.
  const styleGroups = isMobile
    ? [
        { heading: "Recommended for your device", options: mobileStyles },
        { heading: "Desktop styles", options: desktopStyles },
      ]
    : [
        { heading: "Desktop styles", options: desktopStyles },
        { heading: "Mobile styles", options: mobileStyles },
      ];

  const canContinue = step === 1 ? work !== null : style !== null;

  const onContinue = () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (style && work) {
      navigate({ to: themeRoutes[style], search: { app: work } });
    }
  };

  return (
    <div data-design="fluent" className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <header className="mx-auto flex max-w-5xl items-center gap-2 text-sm font-semibold text-foreground">
        Onboarding in
        <span className="rounded bg-primary px-2 py-0.5 text-primary-foreground">
          PretendPro 3000
        </span>
        <Link
          to="/licenses"
          className="fluent-focus ml-auto text-xs font-medium text-primary hover:underline"
        >
          Open source licenses
        </Link>
        <AppearanceToggle variant="icon" />
      </header>

      <main className="mx-auto mt-8 max-w-5xl">
        <div className="fluent-surface relative overflow-hidden px-4 py-10 sm:px-10 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Step {step} of 2
            </p>
            <h1 className="mt-3 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
              {step === 1
                ? "How are you planning to pretend to work?"
                : "Which device style feels most like your job?"}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {step === 1
                ? "We'll streamline your fake setup experience accordingly."
                : "Purely cosmetic. Like most productivity decisions."}
            </p>

            {step === 1 ? (
              <div className="mt-8 grid max-h-[55vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-4">
                {workOptions.map((option, i) => (
                  <OptionCard
                    key={option.id}
                    title={option.title}
                    description={option.description}
                    art={option.art}
                    priority={i === 0}
                    selected={work === option.id}
                    onSelect={() => setWork(option.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                {styleGroups.map((group) => (
                  <section key={group.heading}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {group.heading}
                    </h2>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {group.options.map((option) => (
                        <OptionCard
                          key={option.id}
                          title={osThemes.find((t) => t.id === option.id)?.name ?? option.id}
                          description={option.description}
                          art={option.art}
                          selected={style === option.id}
                          onSelect={() => setStyle(option.id)}
                          onPrefetch={() => {
                            // Warm the edition's route chunk before the user commits.
                            void router.preloadRoute({ to: themeRoutes[option.id], search: {} });
                          }}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                onClick={onContinue}
                disabled={!canContinue}
                className="fluent-focus w-full max-w-xs rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--fluent-shadow-2)] transition-colors hover:bg-[var(--fluent-brand-90)] active:bg-[var(--fluent-brand-100)] disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
              >
                {step === 1 ? "Continue" : "Start pretending"}
              </button>
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="fluent-focus flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Back
                </button>
              )}
            </div>
          </div>

          <Illustration
            name="feliz"
            className="pointer-events-none absolute bottom-0 left-2 hidden h-32 w-auto lg:block"
          />
        </div>
      </main>

      <footer className="mx-auto mt-8 max-w-5xl text-center text-[11px] text-muted-foreground">
        Illustrations by Pablo Stanley (Transhumans), released under CC0 1.0.
      </footer>
    </div>
  );
}
