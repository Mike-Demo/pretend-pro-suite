import { useRouterState } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { isLocaleId, locales, localeMeta, saveLocale, type LocaleId } from "@/lib/i18n/locales";

/**
 * Rebuild the current URL under another locale prefix. Language switches use a
 * plain anchor (document navigation) so the server renders the new locale's
 * markup and `html lang` from the start.
 */
function hrefForLocale(pathname: string, search: string, locale: LocaleId): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocaleId(segments[0])) segments.shift();
  const rest = segments.join("/");
  return `/${locale}${rest ? `/${rest}` : ""}${search}`;
}

export function LocalePicker({
  className,
  variant = "row",
}: {
  className?: string;
  variant?: "row" | "menu";
}) {
  const { locale, t } = useI18n();
  const { pathname, search } = useRouterState({
    select: (s) => ({ pathname: s.location.pathname, search: s.location.searchStr }),
  });

  if (variant === "menu") {
    return (
      <div className={cn("flex flex-col", className)}>
        <p className="px-2 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t.shell.language}
        </p>
        {locales.map((l) => (
          <a
            key={l.id}
            href={hrefForLocale(pathname, search, l.id)}
            onClick={() => saveLocale(l.id)}
            hrefLang={l.htmlLang}
            aria-current={l.id === locale ? "true" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted",
              l.id === locale && "font-semibold text-primary",
            )}
          >
            {l.flagImg ? (
              <img src={l.flagImg} alt="" aria-hidden className="h-[1.125rem] w-[1.125rem] rounded-sm object-contain" />
            ) : (
              <span aria-hidden="true">{l.flag}</span>
            )}
            {l.label}
          </a>
        ))}
      </div>
    );
  }

  return (
    <nav aria-label={t.onboarding.localePickerLabel} className={cn("flex items-center gap-1", className)}>
      <Globe className="mr-0.5 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      {locales.map((l) => (
        <a
          key={l.id}
          href={hrefForLocale(pathname, search, l.id)}
          onClick={() => saveLocale(l.id)}
          hrefLang={l.htmlLang}
          title={l.label}
          aria-label={l.label}
          aria-current={l.id === locale ? "true" : undefined}
          className={cn(
            "fluent-focus rounded px-1.5 py-1 text-base leading-none transition-transform hover:scale-110",
            l.id === locale
              ? "bg-primary/10 ring-1 ring-primary"
              : "opacity-70 hover:opacity-100",
          )}
        >
          {l.flagImg ? (
            <img src={l.flagImg} alt="" aria-hidden className="h-[1.125rem] w-[1.125rem] rounded-sm object-contain" />
          ) : (
            <span aria-hidden="true">{l.flag}</span>
          )}
        </a>
      ))}
      <span className="ml-1 hidden text-[11px] font-medium text-muted-foreground sm:inline">
        {localeMeta(locale).label}
      </span>
    </nav>
  );
}
