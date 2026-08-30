import logo from "@/assets/pretendpro-logo.svg.asset.json";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  /** Hide the wordmark and show the mark alone (tight headers, mobile chrome). */
  markOnly?: boolean;
  className?: string;
};

/** The PretendPro logo mark paired with the wordmark, set in Nebula Sans. */
export function BrandLockup({ markOnly = false, className }: BrandLockupProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img
        src={logo.url}
        alt=""
        aria-hidden="true"
        width={28}
        height={28}
        className="h-7 w-7 shrink-0 rounded-lg"
      />
      {!markOnly && (
        <span className="text-base font-semibold tracking-tight text-foreground">
          PretendPro 3000
        </span>
      )}
    </span>
  );
}
