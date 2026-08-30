import { useState } from "react";
import { Layers, Wand2 } from "lucide-react";
import { Attribution, MediaPlaceholder, useOpenverseImages } from "./OpenverseMedia";

const layers = ["Background (locked)", "Adjustment: vibes", "Adjustment: more vibes", "Logo watermark"];

export function PhotoPretender({ animated }: { animated: boolean }) {
  const { data } = useOpenverseImages("landscape nature", 5);
  const assets = data?.assets ?? [];
  const [photo, setPhoto] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(110);
  const [contrast, setContrast] = useState(105);

  const current = assets[photo % Math.max(assets.length, 1)];
  const filter = `brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%)`;

  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-1.5 text-xs">
        <Wand2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span className="font-semibold">PhotoPretender</span>
        <span className="text-muted-foreground">— hero-shot-v27.psd</span>
      </div>
      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col p-3">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-muted">
            {current ? (
              <img
                src={current.url}
                alt=""
                aria-hidden="true"
                loading="lazy"
                style={{ filter }}
                className={animated ? "h-full w-full object-cover transition-[filter]" : "h-full w-full object-cover"}
              />
            ) : (
              <MediaPlaceholder label="Very large RAW file loading…" />
            )}
          </div>
          {current && <Attribution asset={current} className="mt-1.5" />}
          {assets.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {assets.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setPhoto(i)}
                  aria-label={`Open photo ${i + 1}`}
                  aria-pressed={i === photo % assets.length}
                  className={`h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                    i === photo % assets.length ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={a.thumbnail ?? a.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </main>
        <aside className="hidden w-48 shrink-0 flex-col border-l border-border bg-muted/30 p-3 text-xs sm:flex">
          <p className="mb-2 flex items-center gap-1.5 font-semibold">
            <Layers className="h-3.5 w-3.5" aria-hidden="true" /> Layers
          </p>
          <ul className="mb-4 space-y-1">
            {layers.map((l, i) => (
              <li
                key={l}
                className={`truncate rounded px-2 py-1 ${i === 0 ? "bg-primary/10 font-medium text-primary" : "text-foreground/70"}`}
              >
                {l}
              </li>
            ))}
          </ul>
          {(
            [
              ["Brightness", brightness, setBrightness],
              ["Saturation", saturation, setSaturation],
              ["Contrast", contrast, setContrast],
            ] as const
          ).map(([label, value, set]) => (
            <label key={label} className="mb-3 block">
              <span className="mb-1 flex justify-between text-muted-foreground">
                {label} <span>{value}%</span>
              </span>
              <input
                type="range"
                min={20}
                max={200}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
          ))}
          <p className="mt-auto text-[10px] text-muted-foreground">
            Sliders genuinely work. The talent does not ship with the app.
          </p>
        </aside>
      </div>
    </div>
  );
}
