import { useMemo } from "react";
import {
  FileText,
  Table2,
  Globe,
  Mail,
  Code2,
  Gamepad2,
  Presentation,
  BookOpen,
  Image,
  Clapperboard,
  AudioWaveform,
  Sparkles as SparklesIcon,
} from "lucide-react";

export type AppId =
  | "docufaker"
  | "sheets"
  | "browser"
  | "inbox"
  | "codeweb"
  | "codegame"
  | "deck"
  | "reader"
  | "photos"
  | "reels"
  | "sound";

export const apps: Array<{
  id: AppId;
  name: string;
  icon: typeof FileText;
  chip: string;
}> = [
  { id: "docufaker", name: "DocuFaker", icon: FileText, chip: "bg-sky text-sky-foreground shadow-sm ring-1 ring-inset ring-sky-foreground/25" },
  { id: "sheets", name: "SheetShenanigans", icon: Table2, chip: "bg-mint text-mint-foreground shadow-sm ring-1 ring-inset ring-mint-foreground/25" },
  { id: "browser", name: "BrowserBuddy", icon: Globe, chip: "bg-grape text-grape-foreground shadow-sm ring-1 ring-inset ring-grape-foreground/25" },
  { id: "inbox", name: "Inbox Mirage", icon: Mail, chip: "bg-bubblegum text-bubblegum-foreground shadow-sm ring-1 ring-inset ring-bubblegum-foreground/25" },
  { id: "codeweb", name: "CodeFaker", icon: Code2, chip: "bg-grape text-grape-foreground shadow-sm ring-1 ring-inset ring-grape-foreground/25" },
  { id: "codegame", name: "CodeFaker: Game", icon: Gamepad2, chip: "bg-bubblegum text-bubblegum-foreground shadow-sm ring-1 ring-inset ring-bubblegum-foreground/25" },
  { id: "deck", name: "DeckDreamer", icon: Presentation, chip: "bg-butter text-butter-foreground shadow-sm ring-1 ring-inset ring-butter-foreground/25" },
  { id: "reader", name: "ReaderRealm", icon: BookOpen, chip: "bg-sky text-sky-foreground shadow-sm ring-1 ring-inset ring-sky-foreground/25" },
  { id: "photos", name: "PhotoPretender", icon: Image, chip: "bg-mint text-mint-foreground shadow-sm ring-1 ring-inset ring-mint-foreground/25" },
  { id: "reels", name: "ReelPretender", icon: Clapperboard, chip: "bg-grape text-grape-foreground shadow-sm ring-1 ring-inset ring-grape-foreground/25" },
  { id: "sound", name: "SoundStage", icon: AudioWaveform, chip: "bg-bubblegum text-bubblegum-foreground shadow-sm ring-1 ring-inset ring-bubblegum-foreground/25" },
];

export function SparklesLayer({ enabled }: { enabled: boolean }) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: (i * 67) % 100,
        top: (i * 37) % 90,
        delay: (i * 0.7) % 4,
        size: 10 + ((i * 5) % 12),
      })),
    [],
  );
  if (!enabled) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {sparkles.map((s, i) => (
        <SparklesIcon
          key={i}
          className="absolute text-primary/50"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `pretend-sparkle-float 4s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function StickyNote() {
  const t = useStrings();
  return (
    <div className="pointer-events-none absolute right-4 top-4 z-[5] hidden rotate-3 rounded-md bg-butter px-3 py-2 text-xs font-semibold text-butter-foreground shadow-md sm:block">
      {t.content.stickyNote}
    </div>
  );
}

export function StuckProgress() {
  const t = useStrings();
  return (
    <div className="mx-auto mt-6 w-full max-w-sm">
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>{t.content.progressLabel}</span>
        <span>99%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border border-border bg-muted">
        <div className="h-full w-[99%] rounded-full bg-primary" />
      </div>
      <p className="mt-1 text-center text-[11px] text-muted-foreground">
        {t.content.progressHint}
      </p>
    </div>
  );
}
