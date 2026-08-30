import { useEffect, useMemo, useState } from "react";
import { Bold, Italic, Underline, AlignLeft, Wand2 } from "lucide-react";
import { randomJargon } from "@/lib/pretendpro/content";
import { cn } from "@/lib/utils";
import { useStrings } from "@/lib/i18n/context";

export function DocuFaker({ animated }: { animated: boolean }) {
  const pack = useStrings().content;
  const [paragraphs, setParagraphs] = useState<string[]>(() => randomJargon(3, 0, pack));
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);
  const [flash, setFlash] = useState(false);

  const typingSource = useMemo(
    () => randomJargon(2, 0, pack).join(" "),
    [paragraphs.length, pack],
  );

  useEffect(() => {
    if (!typing) return undefined;
    if (typed.length >= typingSource.length) {
      const done = window.setTimeout(() => setTyping(false), 1200);
      return () => window.clearTimeout(done);
    }
    const t = window.setTimeout(
      () => setTyped((prev) => typingSource.slice(0, prev.length + 1)),
      40,
    );
    return () => window.clearTimeout(t);
  }, [typing, typed, typingSource]);

  const lookBusy = () => {
    setParagraphs(randomJargon(6, paragraphs.length, pack));
    setTyped("");
    setTyping(true);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 600);
  };

  const toolbarIcons = [Bold, Italic, Underline, AlignLeft, Wand2];

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg">
      <div
        className={cn(
          "flex items-center gap-2 border-b border-border px-4 py-2 transition-colors",
          flash ? "bg-primary/30" : "bg-sky",
        )}
      >
        <span className="text-sm font-bold text-sky-foreground">DocuFaker</span>
        <span className="ml-2 truncate text-xs text-sky-foreground/70">
          Untitled_Synergy_FINAL_v7.docx
        </span>
        <div className="ml-auto flex gap-2">
          {toolbarIcons.map((Icon, i) => (
            <span
              key={i}
              className={cn(
                "rounded-md bg-card/60 p-1.5 text-sky-foreground",
                animated && "animate-pretend-wiggle",
              )}
              style={animated ? { animationDelay: `${i * 0.3}s` } : undefined}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3 px-5 py-4 sm:px-8 sm:py-6">
        <h3 className="text-lg font-bold text-card-foreground">
          Quarterly Synergy Pancake Alignment Memo
        </h3>
        {paragraphs.map((p, i) => (
          <p key={`${p}-${i}`} className="text-sm leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}
        {typing && (
          <p className="text-sm leading-relaxed text-card-foreground">
            {typed}
            <span className="animate-pretend-caret ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-primary" />
          </p>
        )}
      </div>

      <div className="border-t border-border bg-muted/60 px-5 py-4">
        <button
          onClick={lookBusy}
          className={cn(
            "w-full rounded-xl bg-primary px-6 py-4 text-lg font-extrabold tracking-wide text-primary-foreground shadow-md transition-transform hover:scale-[1.02] active:scale-95 sm:text-xl",
            animated && "animate-pretend-bounce",
          )}
        >
          LOOK BUSY
        </button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Fills the page with credible nonsense. Boss-tested.
        </p>
      </div>
    </div>
  );
}
