import { useEffect, useState } from "react";
import { Clapperboard, Scissors } from "lucide-react";
import { MediaPlaceholder, useOpenverseImages } from "./OpenverseMedia";
import { useFunMode } from "@/lib/pretendpro/fun-mode";

const clips = [
  { name: "intro-broll.mp4", width: 22, chip: "bg-sky text-sky-foreground" },
  { name: "talking-head-v3.mp4", width: 34, chip: "bg-mint text-mint-foreground" },
  { name: "transition-whoosh.mp4", width: 8, chip: "bg-butter text-butter-foreground" },
  { name: "outro-logo-final2.mp4", width: 26, chip: "bg-bubblegum text-bubblegum-foreground" },
];

export function ReelPretender({ animated }: { animated: boolean }) {
  const { funMode } = useFunMode();
  const { data } = useOpenverseImages("film cinema camera", 3);
  const poster = data?.assets[0];
  const [playhead, setPlayhead] = useState(35);

  useEffect(() => {
    if (!animated) return;
    const id = window.setInterval(() => setPlayhead((p) => (p >= 95 ? 5 : p + 1)), 400);
    return () => window.clearInterval(id);
  }, [animated]);

  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-1.5 text-xs">
        <Clapperboard className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span className="font-semibold">ReelPretender</span>
        <span className="text-muted-foreground">— launch-video-almost-there.prproj</span>
        <button className="fluent-focus ml-auto flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[11px] font-semibold">
          <Scissors className="h-3 w-3" aria-hidden="true" /> Split clip
        </button>
      </div>
      <div className="relative m-3 min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-muted">
        {poster ? (
          <img
            src={poster.thumbnail ?? poster.url}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover opacity-70"
          />
        ) : (
          <MediaPlaceholder label="Preview render pending… forever" />
        )}
        <span className="absolute left-2 top-2 rounded bg-foreground/80 px-1.5 py-0.5 font-mono text-[10px] text-background">
          00:0{Math.floor(playhead / 20)}:{String(playhead % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="border-t border-border p-3">
        <div className="relative h-16 rounded-lg border border-border bg-muted/40 p-2">
          <div className="flex h-full gap-1">
            {clips.map((c) => (
              <div
                key={c.name}
                style={{ width: `${c.width}%` }}
                className={`flex items-center truncate rounded px-1.5 text-[10px] font-semibold ${c.chip}`}
              >
                {c.name}
              </div>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-y-0 w-0.5 bg-primary"
            style={{ left: `${playhead}%` }}
          />
        </div>
        {funMode && (
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Exporting… 99% — rendering since 2019.
          </p>
        )}
      </div>
    </div>
  );
}
