import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n/context";
import { isLocaleId } from "@/lib/i18n/locales";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLocaleId(params.locale)) throw notFound();
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale } = Route.useParams();
  if (!isLocaleId(locale)) return null;
  return (
    <I18nProvider locale={locale}>
      {/* Keyed by locale so a language switch replays the tumble-in animation. */}
      <div key={locale} className="animate-locale-swap">
        <Outlet />
      </div>
    </I18nProvider>
  );
}
