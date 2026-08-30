import { createContext, useContext, useMemo, type ReactNode } from "react";
import { defaultLocale, type LocaleId } from "./locales";
import { stringsFor, type Strings } from "./strings";

interface I18nValue {
  locale: LocaleId;
  t: Strings;
}

const I18nContext = createContext<I18nValue>({
  locale: defaultLocale,
  t: stringsFor(defaultLocale),
});

export function I18nProvider({ locale, children }: { locale: LocaleId; children: ReactNode }) {
  const value = useMemo<I18nValue>(() => ({ locale, t: stringsFor(locale) }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}

/** Convenience: just the strings for the active locale. */
export function useStrings(): Strings {
  return useContext(I18nContext).t;
}
