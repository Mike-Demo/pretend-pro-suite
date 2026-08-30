import { useEffect, useRef, useState } from "react";
import { FileCode2, Folder, Play, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const webFiles = [
  { name: "src/synergy.ts", lang: "TypeScript" },
  { name: "src/waffles.config.ts", lang: "TypeScript" },
  { name: "src/hooks/useLookBusy.ts", lang: "TypeScript" },
  { name: "README.md", lang: "Markdown" },
];

const gameFiles = [
  { name: "src/game-loop.ts", lang: "TypeScript" },
  { name: "src/physics/gravity-ish.ts", lang: "TypeScript" },
  { name: "src/entities/player.ts", lang: "TypeScript" },
  { name: "assets/placeholder-everything.png", lang: "Asset" },
];

const webSnippet = `export function synergize(metrics: WaffleMetrics): Synergy {
  const vibe = calibrate(metrics, { confidence: "high" });
  // TODO: figure out what this does (written 2019, works, do not touch)
  return metrics.map((m) => m * vibe.quotient).reduce(align, 0);
}`;

const gameSnippet = `function tick(dt: number): void {
  player.velocity.y += GRAVITY_ISH * dt;
  if (player.isGrounded()) player.coyoteTime = 0.12;
  // frame-perfect jump buffering, absolutely not stolen from a tutorial
  spawnParticles("convincing", player.position);
}`;

const buildLog = [
  "$ pretend build --look-busy",
  "Resolving dependencies… 1,204 packages that all do the same thing",
  "Compiling synergy.ts … ok",
  "Compiling vibes.module.ts … ok",
  "Tree-shaking unused ambition … done",
  "Optimizing waffle metrics … 0 warnings, 0 understanding",
  "Bundling … 4.2 MB of pure confidence",
  "Build finished in 0.4s. Nobody will read the output anyway.",
];

export function CodeFaker({ mode, animated }: { mode: "web" | "game"; animated: boolean }) {
  const files = mode === "web" ? webFiles : gameFiles;
  const snippet = mode === "web" ? webSnippet : gameSnippet;
  const [logLines, setLogLines] = useState(3);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated) return;
    const id = window.setInterval(() => {
      setLogLines((n) => (n >= buildLog.length + 6 ? 3 : n + 1));
    }, 900);
    return () => window.clearInterval(id);
  }, [animated]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [logLines]);

  const visibleLog = Array.from({ length: logLines }, (_, i) => buildLog[i % buildLog.length]);

  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-1.5 text-xs">
        <FileCode2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span className="font-semibold">CodeFaker</span>
        <span className="text-muted-foreground">— {mode === "web" ? "Web Project" : "Game Project"}</span>
        <button className="fluent-focus ml-auto flex items-center gap-1 rounded bg-mint px-2 py-0.5 text-[11px] font-semibold text-mint-foreground">
          <Play className="h-3 w-3" aria-hidden="true" /> Run (does nothing)
        </button>
      </div>
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-44 shrink-0 border-r border-border bg-muted/30 p-2 text-xs sm:block">
          <p className="mb-1 flex items-center gap-1 font-semibold text-muted-foreground">
            <Folder className="h-3.5 w-3.5" aria-hidden="true" /> pretend-project
          </p>
          <ul className="space-y-0.5 pl-3">
            {files.map((f, i) => (
              <li
                key={f.name}
                className={cn(
                  "truncate rounded px-1.5 py-1",
                  i === 0 ? "bg-primary/10 font-medium text-primary" : "text-foreground/80",
                )}
              >
                {f.name}
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <pre className="min-h-0 flex-1 overflow-auto p-4 font-mono text-[12px] leading-6">
            <code>{snippet}</code>
          </pre>
          <div className="border-t border-border bg-foreground/[0.03]">
            <p className="flex items-center gap-1.5 border-b border-border px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              <TerminalSquare className="h-3.5 w-3.5" aria-hidden="true" /> Terminal — Look Busy
            </p>
            <div ref={logRef} className="h-24 overflow-hidden px-3 py-1.5 font-mono text-[11px] text-foreground/70">
              {visibleLog.map((line, i) => (
                <p key={i} className="truncate">
                  {line}
                </p>
              ))}
              <p aria-hidden="true">▊</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
