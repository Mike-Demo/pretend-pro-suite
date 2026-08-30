import { cn } from "@/lib/utils";

import ponderingSvg from "@/assets/transhumans/pondering.svg?url";
import coffeeSvg from "@/assets/transhumans/coffee.svg?url";
import growthSvg from "@/assets/transhumans/growth.svg?url";
import experimentsSvg from "@/assets/transhumans/experiments.svg?url";
import lookingAheadSvg from "@/assets/transhumans/looking-ahead.svg?url";
import chillinSvg from "@/assets/transhumans/chillin.svg?url";
import waitingSvg from "@/assets/transhumans/waiting.svg?url";
import felizSvg from "@/assets/transhumans/feliz.svg?url";

import ponderingWebp from "@/assets/transhumans/pondering.webp?url";
import coffeeWebp from "@/assets/transhumans/coffee.webp?url";
import growthWebp from "@/assets/transhumans/growth.webp?url";
import experimentsWebp from "@/assets/transhumans/experiments.webp?url";
import lookingAheadWebp from "@/assets/transhumans/looking-ahead.webp?url";
import chillinWebp from "@/assets/transhumans/chillin.webp?url";
import waitingWebp from "@/assets/transhumans/waiting.webp?url";
import felizWebp from "@/assets/transhumans/feliz.webp?url";

export type IllustrationName =
  | "pondering"
  | "coffee"
  | "growth"
  | "experiments"
  | "lookingAhead"
  | "chillin"
  | "waiting"
  | "feliz";

/**
 * Each Transhumans illustration in two flavours: a small WebP raster used by
 * every browser, and the optimized SVG as a fallback.
 */
export const illustrations: Record<IllustrationName, { webp: string; svg: string }> = {
  pondering: { webp: ponderingWebp, svg: ponderingSvg },
  coffee: { webp: coffeeWebp, svg: coffeeSvg },
  growth: { webp: growthWebp, svg: growthSvg },
  experiments: { webp: experimentsWebp, svg: experimentsSvg },
  lookingAhead: { webp: lookingAheadWebp, svg: lookingAheadSvg },
  chillin: { webp: chillinWebp, svg: chillinSvg },
  waiting: { webp: waitingWebp, svg: waitingSvg },
  feliz: { webp: felizWebp, svg: felizSvg },
};

/**
 * Decorative illustration. Renders the compact WebP first and keeps explicit
 * dimensions so the card never shifts while the image arrives.
 */
export function Illustration({
  name,
  className,
  priority = false,
  height = 320,
}: {
  name: IllustrationName;
  className?: string;
  /** Mark the single above-the-fold illustration so it loads eagerly. */
  priority?: boolean;
  height?: number;
}) {
  const art = illustrations[name];
  return (
    <picture>
      <source srcSet={art.webp} type="image/webp" />
      <img
        src={art.svg}
        alt=""
        aria-hidden="true"
        width={Math.round(height * 0.8)}
        height={height}
        className={cn("object-contain", className)}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
