import { cn } from "@/lib/utils";

const linkedInUrl = "https://www.linkedin.com/in/mikedemopoulos";
const xUrl = "https://x.com/mike_demo";
const threadsUrl = "https://www.threads.com/@mdemop";

export function SocialFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 text-[11px] text-muted-foreground",
        className,
      )}
    >
      <span className="w-full text-center sm:w-auto">Made by MikeDemo</span>
      <span className="w-full text-center sm:w-auto" aria-label={`Copyright ${new Date().getFullYear()} MikeDemo`}>
        © {new Date().getFullYear()} MikeDemo
      </span>
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
    </footer>
  );
}
