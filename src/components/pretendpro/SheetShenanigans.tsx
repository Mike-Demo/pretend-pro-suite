import { spreadsheetFormulas } from "@/lib/pretendpro/content";
import { useStrings } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const columns = ["A", "B", "C", "D", "E"] as const;
const rows = [1, 2, 3, 4, 5] as const;

const chartBars = [
  { label: "Waffles", value: 85, cls: "bg-chart-1" },
  { label: "Synergy", value: 62, cls: "bg-chart-2" },
  { label: "Vibes", value: 95, cls: "bg-chart-3" },
  { label: "Snacks", value: 40, cls: "bg-chart-4" },
  { label: "Naps", value: 78, cls: "bg-chart-5" },
];

export function SheetShenanigans({ animated }: { animated: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-mint px-4 py-2">
        <span className="text-sm font-bold text-mint-foreground">SheetShenanigans</span>
        <span className="rounded-full bg-card/70 px-2 py-0.5 text-[11px] font-semibold text-mint-foreground">
          Quarterly Vibes Report.xlsx
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-xs">
          <thead>
            <tr>
              <th className="w-10 border border-border bg-muted px-2 py-1.5 text-muted-foreground" />
              {columns.map((c) => (
                <th
                  key={c}
                  className="border border-border bg-muted px-2 py-1.5 font-bold text-muted-foreground"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r}>
                <td className="border border-border bg-muted px-2 py-1.5 text-center font-semibold text-muted-foreground">
                  {r}
                </td>
                {columns.map((c, ci) => {
                  const formula =
                    formulas[(r * columns.length + ci) % formulas.length];
                  return (
                    <td
                      key={c}
                      className="border border-border px-2 py-1.5 font-mono text-card-foreground hover:bg-accent"
                    >
                      {r === 1 && ci === 0 ? "=VIBES" : formula}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border bg-muted/50 px-5 py-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Vibes by Department (definitely accurate)
        </p>
        <div className="flex h-32 items-end justify-around gap-2 sm:gap-4">
          {chartBars.map((bar, i) => (
            <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div
                className={cn(
                  "w-full max-w-12 rounded-t-lg transition-all",
                  bar.cls,
                  animated && "animate-pretend-bounce",
                )}
                style={{
                  height: `${bar.value}%`,
                  animationDelay: animated ? `${i * 0.15}s` : undefined,
                }}
              />
              <span className="text-[10px] font-semibold text-muted-foreground">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
