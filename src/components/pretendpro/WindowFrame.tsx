import type { ReactNode } from "react";
import { Minus, Square, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type OsTheme = "fruit" | "apperture" | "bufferium";

export const osThemes: Array<{ id: OsTheme; name: string }> = [
  { id: "fruit", name: "Fruit" },
  { id: "apperture", name: "Apperture" },
  { id: "bufferium", name: "BufferiumOS" },
];

const fakeToasts: Record<string, string> = {
  close: "Nice try. This window believes in you.",
  minimize: "There is no escape from productivity.",
  maximize: "It's already as big as your ambitions.",
};

function fakeAction(kind: keyof typeof fakeToasts) {
  toast(fakeToasts[kind]);
}

function TrafficLight({ color, label }: { color: string; label: string }) {
  return (
    <button
      onClick={() => fakeAction("close")}
      aria-label={label}
      className={cn("h-3.5 w-3.5 rounded-full border border-foreground/10", color)}
    />
  );
}

function FruitBar({ appName }: { appName: string }) {
  return (
    <div className="relative flex items-center gap-2 rounded-t-[var(--os-radius)] border-b border-border/60 bg-[var(--os-titlebar)] px-3 py-2 backdrop-blur">
      <TrafficLight color="bg-bubblegum" label="Close (pretend)" />
      <TrafficLight color="bg-butter" label="Minimize (pretend)" />
      <TrafficLight color="bg-mint" label="Zoom (pretend)" />
      <span className="pointer-events-none absolute inset-x-0 text-center text-xs font-semibold text-foreground/70">
        {appName}
      </span>
    </div>
  );
}

function AppertureBar({ appName }: { appName: string }) {
  const btn =
    "flex h-7 w-9 items-center justify-center text-foreground/70 transition-colors hover:bg-muted";
  return (
    <div className="flex items-center rounded-t-[var(--os-radius)] border-b border-border/60 bg-[var(--os-titlebar)] backdrop-blur">
      <span className="px-3 text-xs font-semibold text-foreground/80">{appName}</span>
      <div className="ml-auto flex">
        <button onClick={() => fakeAction("minimize")} aria-label="Minimize (pretend)" className={btn}>
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => fakeAction("maximize")} aria-label="Maximize (pretend)" className={btn}>
          <Square className="h-3 w-3" />
        </button>
        <button
          onClick={() => fakeAction("close")}
          aria-label="Close (pretend)"
          className={cn(btn, "rounded-tr-[var(--os-radius)] hover:bg-destructive hover:text-destructive-foreground")}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function BufferiumBar({ appName }: { appName: string }) {
  return (
    <div className="flex items-end gap-1 rounded-t-[var(--os-radius)] bg-[var(--os-titlebar)] px-2 pt-1.5">
      <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-border/60 bg-card px-3 py-1.5">
        <span className="text-xs font-semibold text-foreground/80">{appName}</span>
        <button
          onClick={() => fakeAction("close")}
          aria-label="Close tab (pretend)"
          className="flex h-4 w-4 items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}

export function WindowFrame({
  osTheme,
  appName,
  children,
}: {
  osTheme: OsTheme;
  appName: string;
  children: ReactNode;
}) {
  return (
    <div
      data-os-theme={osTheme}
      className="overflow-hidden rounded-[var(--os-radius)] border-2 border-border bg-card shadow-xl"
    >
      {osTheme === "fruit" && <FruitBar appName={appName} />}
      {osTheme === "apperture" && <AppertureBar appName={appName} />}
      {osTheme === "bufferium" && <BufferiumBar appName={appName} />}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
