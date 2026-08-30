import { useMemo } from "react";
import { useStrings } from "@/lib/i18n/context";
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
  { id: "docufaker", name: "DocuFaker", icon: FileText, chip: "app-tile app-tile-blue" },
  { id: "sheets", name: "SheetShenanigans", icon: Table2, chip: "app-tile app-tile-green" },
  { id: "browser", name: "BrowserBuddy", icon: Globe, chip: "app-tile app-tile-violet" },
  { id: "inbox", name: "Inbox Mirage", icon: Mail, chip: "app-tile app-tile-teal" },
  { id: "codeweb", name: "CodeFaker", icon: Code2, chip: "app-tile app-tile-violet" },
  { id: "codegame", name: "CodeFaker: Game", icon: Gamepad2, chip: "app-tile app-tile-teal" },
  { id: "deck", name: "DeckDreamer", icon: Presentation, chip: "app-tile app-tile-orange" },
  { id: "reader", name: "ReaderRealm", icon: BookOpen, chip: "app-tile app-tile-blue" },
  { id: "photos", name: "PhotoPretender", icon: Image, chip: "app-tile app-tile-green" },
  { id: "reels", name: "ReelPretender", icon: Clapperboard, chip: "app-tile app-tile-violet" },
  { id: "sound", name: "SoundStage", icon: AudioWaveform, chip: "app-tile app-tile-orange" },
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
