import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { LocaleId } from "@/lib/i18n/locales";

const linkedInUrl = "https://www.linkedin.com/in/mikedemopoulos";
const xUrl = "https://x.com/mike_demo";
const threadsUrl = "https://www.threads.com/@mdemop";

export function SocialFooter({ className, locale }: { className?: string; locale?: LocaleId }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-[11px] text-muted-foreground",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span>Made by MikeDemo</span>
        <span aria-label={`Copyright ${year}`}>© {year}</span>
      </div>
      <nav
        aria-label="Legal and social links"
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          to="/$locale/privacy"
          params={{ locale: locale ?? "us-en" }}
          className="fluent-focus inline-flex items-center gap-1.5 rounded px-1.5 py-1 font-medium text-foreground/80 hover:text-foreground"
        >
          <i className="fa-solid fa-shield-halved h-4 w-4 text-[14px]" aria-hidden="true" />
          Privacy
        </Link>
        <Link
          to="/$locale/terms"
          params={{ locale: locale ?? "us-en" }}
          className="fluent-focus inline-flex items-center gap-1.5 rounded px-1.5 py-1 font-medium text-foreground/80 hover:text-foreground"
        >
          <i className="fa-solid fa-file-contract h-4 w-4 text-[14px]" aria-hidden="true" />
          Terms
        </Link>
        <Link
          to="/$locale/licenses"
          params={{ locale: locale ?? "us-en" }}
          className="fluent-focus inline-flex items-center gap-1.5 rounded px-1.5 py-1 font-medium text-foreground/80 hover:text-foreground"
        >
          <i className="fa-solid fa-code h-4 w-4 text-[14px]" aria-hidden="true" />
          Open Source
        </Link>
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="MikeDemo on LinkedIn (opens in new tab)"
          className="fluent-focus inline-flex items-center gap-1.5 rounded px-1.5 py-1 font-medium text-foreground/80 hover:text-foreground"
        >
          <i className="fa-brands fa-linkedin h-4 w-4 text-[14px]" aria-hidden="true" />
          LinkedIn
        </a>
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="MikeDemo on X (opens in new tab)"
          className="fluent-focus inline-flex items-center gap-1.5 rounded px-1.5 py-1 font-medium text-foreground/80 hover:text-foreground"
        >
          <i className="fa-brands fa-x-twitter h-4 w-4 text-[14px]" aria-hidden="true" />
          X
        </a>
        <a
          href={threadsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="MikeDemo on Threads (opens in new tab)"
          className="fluent-focus inline-flex items-center gap-1.5 rounded px-1.5 py-1 font-medium text-foreground/80 hover:text-foreground"
        >
          <i className="fa-brands fa-threads h-4 w-4 text-[14px]" aria-hidden="true" />
          Threads
        </a>
      </nav>
    </footer>
  );
}
