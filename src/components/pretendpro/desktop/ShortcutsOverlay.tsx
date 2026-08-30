import { X } from "lucide-react";

const shortcuts: Array<[string, string]> = [
  ["1 – 4", "Launch / focus DocuFaker, SheetShenanigans, BrowserBuddy, Inbox Mirage"],
  ["Ctrl / ⌘ + Tab", "Next window"],
  ["Ctrl / ⌘ + Shift + Tab", "Previous window"],
  ["Ctrl / ⌘ + K", "App switcher"],
  ["Ctrl / ⌘ + W", "Close focused window"],
  ["F", "Maximize / restore window"],
  ["A", "Toggle Fun Mode (easter eggs)"],
  ["?", "Show this cheat sheet"],
  ["Esc", "Close overlays / restore window"],
];

export function ShortcutsOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4">
      <div
        className="w-full max-w-md rounded-2xl border-2 border-border bg-popover p-5 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-base font-bold text-popover-foreground">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
            aria-label="Close shortcuts"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {shortcuts.map(([keys, label]) => (
            <li key={keys} className="flex items-center justify-between gap-3 text-xs">
              <kbd className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-[11px] text-foreground">
                {keys}
              </kbd>
              <span className="text-right text-muted-foreground">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
