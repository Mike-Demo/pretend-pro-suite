import { cn } from "@/lib/utils";

const linkedInUrl = "https://www.linkedin.com/in/mikedemopoulos";
const xUrl = "https://x.com/mike_demo";
const threadsUrl = "https://www.threads.com/@mdemop";

export function SocialFooter({ className }: { className?: string }) {
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
        <a
          href="/us-en/privacy"
          className="fluent-focus inline-flex items-center gap-1.5 rounded px-1.5 py-1 font-medium text-foreground/80 hover:text-foreground"
        >
          <i className="fa-solid fa-shield-halved h-4 w-4 text-[14px]" aria-hidden="true" />
          Privacy
        </a>
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
