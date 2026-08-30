import { useEffect, useRef, useState } from "react";
import { AlertTriangle, MailOpen, Inbox } from "lucide-react";
import { generateFakeEmail, seedEmails, type FakeEmail } from "@/lib/pretendpro/content";
import { cn } from "@/lib/utils";
import { useStrings } from "@/lib/i18n/context";

export function InboxMirage({ animated }: { animated: boolean }) {
  const pack = useStrings().content;
  const [emails, setEmails] = useState<FakeEmail[]>(() => seedEmails(5, pack));
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(new Set());
  const counter = useRef(5);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setEmails((prev) => [generateFakeEmail(counter.current, pack), ...prev].slice(0, 12));
      counter.current += 1;
    }, 6000);
    return () => window.clearInterval(interval);
  }, [pack]);

  const unread = emails.filter((e) => !readIds.has(e.id)).length;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg">
      <div className="flex items-center gap-2 border-b border-border bg-bubblegum px-4 py-2">
        <span className="text-sm font-bold text-bubblegum-foreground">Inbox Mirage</span>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-card/70 px-2 py-0.5 text-[11px] font-semibold text-bubblegum-foreground">
          <Inbox className="h-3 w-3" />
          {unread} unread
        </span>
      </div>

      <ul className="divide-y divide-border">
        {emails.map((email) => {
          const isRead = readIds.has(email.id);
          return (
            <li key={email.id}>
              <button
                onClick={() =>
                  setReadIds((prev) => new Set(prev).add(email.id))
                }
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
                  !isRead && "bg-accent/50",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    email.urgent
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground",
                  )}
                >
                  {email.from.charAt(0)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "truncate text-sm",
                        isRead
                          ? "font-medium text-muted-foreground"
                          : "font-bold text-card-foreground",
                      )}
                    >
                      {email.from}
                    </span>
                    {email.urgent && (
                      <span
                        className={cn(
                          "flex shrink-0 items-center gap-0.5 rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground",
                          animated && "animate-pretend-wiggle",
                        )}
                      >
                        <AlertTriangle className="h-2.5 w-2.5" />
                        URGENT!!
                      </span>
                    )}
                    <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                      {email.time}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "block truncate text-xs",
                      isRead ? "text-muted-foreground" : "font-semibold text-card-foreground",
                    )}
                  >
                    {email.subject}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {email.preview}
                  </span>
                </span>
                {isRead && <MailOpen className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="border-t border-border bg-muted/60 px-4 py-2 text-center text-[11px] text-muted-foreground">
        Auto-generating fake urgency from imaginary coworkers. None of these people exist.
      </p>
    </div>
  );
}
