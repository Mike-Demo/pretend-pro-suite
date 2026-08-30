import { useEffect, useState } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Check, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppearanceToggle } from "@/components/pretendpro/AppearanceToggle";
import { LocalePicker } from "@/components/pretendpro/LocalePicker";
import { Checkbox } from "@/components/ui/checkbox";
import {
  isFullscreenSupported,
  loadFullscreenPreference,
  requestDeviceFullscreen,
  saveFullscreenPreference,
} from "@/lib/pretendpro/fullscreen";
import type { AppId } from "@/components/pretendpro/chrome";
import { osThemes, type OsTheme } from "@/components/pretendpro/WindowFrame";
import {
  Illustration,
  type IllustrationName,
} from "@/components/pretendpro/Illustration";
import { SocialFooter } from "@/components/pretendpro/SocialFooter";
import { useI18n } from "@/lib/i18n/context";
import { localeThemeRoutes } from "@/lib/i18n/locales";

const workArt: Record<AppId, IllustrationName> = {
  docufaker: "pondering",
  sheets: "growth",
  browser: "coffee",
  inbox: "experiments",
  codeweb: "lookingAhead",
  codegame: "feliz",
  deck: "growth",
  reader: "pondering",
  photos: "waiting",
  reels: "chillin",
  sound: "coffee",
};

const workOrder: AppId[] = [
  "docufaker",
  "sheets",
  "browser",
  "inbox",
  "codeweb",
  "codegame",
  "deck",
  "reader",
  "photos",
  "reels",
  "sound",
];

const desktopStyleOrder: OsTheme[] = ["fruit", "apperture", "bufferium"];
const mobileStyleOrder: OsTheme[] = ["android", "fos"];

const styleArt: Record<OsTheme, IllustrationName> = {
  fruit: "lookingAhead",
  apperture: "chillin",
  bufferium: "waiting",
  android: "growth",
  fos: "feliz",
};

function OptionCard({
  title,
  description,
  art,
  selected,
  onSelect,
  priority = false,
  onPrefetch,
}: {
  title: string;
  description: string;
  art: IllustrationName;
  selected: boolean;
  onSelect: () => void;
  priority?: boolean;
  onPrefetch?: () => void;
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
    </button>
  );
}

export function Onboarding() {
  const navigate = useNavigate();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { locale, t } = useI18n();
  const [step, setStep] = useState<1 | 2>(1);
  const [work, setWork] = useState<AppId | null>(null);
  const [style, setStyle] = useState<OsTheme | null>(null);
  const [fillScreen, setFillScreen] = useState(false);
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);

  // Read the remembered preference and capability after hydration (browser-only).
  useEffect(() => {
    setFillScreen(loadFullscreenPreference());
    setFullscreenAvailable(isFullscreenSupported());
  }, []);

  const toggleFillScreen = (checked: boolean) => {
    setFillScreen(checked);
    saveFullscreenPreference(checked);
  };

  // Phones see the phone editions first; wide screens see the desktop ones first.
  const styleGroups = isMobile
    ? [
        { heading: t.onboarding.recommendedHeading, options: mobileStyleOrder },
        { heading: t.onboarding.desktopHeading, options: desktopStyleOrder },
      ]
    : [
        { heading: t.onboarding.desktopHeading, options: desktopStyleOrder },
        { heading: t.onboarding.mobileHeading, options: mobileStyleOrder },
      ];

  const canContinue = step === 1 ? work !== null : style !== null;

  const onContinue = () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (style && work) {
      // Must fire inside this click — the Fullscreen API requires a user gesture.
      if (fillScreen) requestDeviceFullscreen();
      navigate({ to: localeThemeRoutes[style], params: { locale }, search: { app: work } });
    }
  };

  return (
    <div data-design="fluent" className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <header className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
        {t.onboarding.headerPrefix}
        <span className="rounded bg-primary px-2 py-0.5 text-primary-foreground">
          PretendPro 3000
        </span>
        <LocalePicker className="ml-auto" />
        <Link
          to="/$locale/licenses"
          params={{ locale }}
          className="fluent-focus text-xs font-medium text-primary hover:underline"
        >
          {t.onboarding.licensesLink}
        </Link>
        <AppearanceToggle variant="icon" />
      </header>

      <main className="mx-auto mt-8 max-w-5xl">
        <div className="fluent-surface relative overflow-hidden px-4 py-10 sm:px-10 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t.onboarding.stepLabel(step)}
            </p>
            <h1 className="mt-3 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
              {step === 1 ? t.onboarding.questionWork : t.onboarding.questionStyle}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {step === 1 ? t.onboarding.subtitleWork : t.onboarding.subtitleStyle}
            </p>

            {step === 1 ? (
              <div className="mt-8 grid max-h-[55vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-4">
                {workOrder.map((id, i) => (
                  <OptionCard
                    key={id}
                    title={t.onboarding.work[id].title}
                    description={t.onboarding.work[id].description}
                    art={workArt[id]}
                    priority={i === 0}
                    selected={work === id}
                    onSelect={() => setWork(id)}
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
                      {group.options.map((id) => (
                        <OptionCard
                          key={id}
                          title={osThemes.find((theme) => theme.id === id)?.name ?? id}
                          description={t.onboarding.styles[id]}
                          art={styleArt[id]}
                          selected={style === id}
                          onSelect={() => setStyle(id)}
                          onPrefetch={() => {
                            // Warm the edition's route chunk before the user commits.
                            void router.preloadRoute({
                              to: localeThemeRoutes[id],
                              params: { locale },
                              search: { app: work ?? "docufaker" },
                            });
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
                {step === 1 ? t.onboarding.continue : t.onboarding.start}
              </button>
              {fullscreenAvailable && (
                <label
                  htmlFor="fill-screen"
                  className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"
                >
                  <Checkbox
                    id="fill-screen"
                    checked={fillScreen}
                    onCheckedChange={(checked) => toggleFillScreen(checked === true)}
                    aria-describedby="fill-screen-hint"
                  />
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Maximize className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {t.onboarding.fullscreenLabel}
                  </span>
                  <span id="fill-screen-hint">{t.onboarding.fullscreenHint}</span>
                </label>
              )}
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="fluent-focus flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {t.onboarding.back}
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

      <SocialFooter className="mx-auto mt-8 max-w-5xl" locale={locale} />
    </div>
  );
}
