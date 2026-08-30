import { useMemo, useRef, useState } from "react";
import { AudioWaveform, Pause, Play } from "lucide-react";
import { Attribution, useOpenverseAudio } from "./OpenverseMedia";
import { cn } from "@/lib/utils";

export function SoundStage({ animated }: { animated: boolean }) {
  const { data } = useOpenverseAudio("ambient music", 6);
  const tracks = useMemo(() => data?.assets ?? [], [data]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = tracks[current % Math.max(tracks.length, 1)];

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const bars = useMemo(
    () => Array.from({ length: 48 }, (_, i) => 20 + ((i * 37) % 70)),
    [],
  );

  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-1.5 text-xs">
        <AudioWaveform className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span className="font-semibold">SoundStage</span>
        <span className="text-muted-foreground">— podcast-intro-v12.wav</span>
      </div>
      <main className="flex min-h-0 flex-1 flex-col p-4">
        <div className="flex h-28 items-end gap-[3px] rounded-lg border border-border bg-muted/40 p-3">
          {bars.map((h, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={cn(
                "flex-1 rounded-sm bg-primary/70",
                animated && playing && "animate-pulse",
              )}
              style={{ height: `${h}%`, animationDelay: `${(i % 8) * 0.12}s` }}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={toggle}
            disabled={!track}
            aria-label={playing ? "Pause" : "Play"}
            className="fluent-focus flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {track ? track.title : "Loading CC-licensed audio…"}
            </p>
            {track ? (
              <Attribution asset={track} />
            ) : (
              <p className="text-[10px] text-muted-foreground">via Openverse</p>
            )}
          </div>
        </div>

        {tracks.length > 0 && (
          <ul className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto">
            {tracks.map((t, i) => (
              <li key={t.id}>
                <button
                  onClick={() => {
                    setCurrent(i);
                    setPlaying(false);
                  }}
                  aria-pressed={i === current % tracks.length}
                  className={cn(
                    "w-full truncate rounded-md border px-2.5 py-1.5 text-left text-xs",
                    i === current % tracks.length
                      ? "border-primary bg-primary/10 font-medium"
                      : "border-border text-foreground/80",
                  )}
                >
                  {t.title} — {t.creator}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
      {track && (
        <audio
          ref={audioRef}
          src={track.url}
          onEnded={() => setPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  );
}
