import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ImageOff } from "lucide-react";
import { searchOpenverseAudio, searchOpenverseImages } from "@/lib/openverse/openverse.functions";
import type { OpenverseAsset } from "@/lib/openverse/types";
import { cn } from "@/lib/utils";

export function useOpenverseImages(query: string, pageSize = 8) {
  const search = useServerFn(searchOpenverseImages);
  return useQuery({
    queryKey: ["openverse", "images", query, pageSize],
    queryFn: () => search({ data: { query, pageSize } }),
    staleTime: 10 * 60 * 1000,
  });
}

export function useOpenverseAudio(query: string, pageSize = 6) {
  const search = useServerFn(searchOpenverseAudio);
  return useQuery({
    queryKey: ["openverse", "audio", query, pageSize],
    queryFn: () => search({ data: { query, pageSize } }),
    staleTime: 10 * 60 * 1000,
  });
}

/** Creator + license credit with a link back to the source, as CC requires. */
export function Attribution({ asset, className }: { asset: OpenverseAsset; className?: string }) {
  const href = asset.foreignLandingUrl ?? asset.creatorUrl ?? asset.licenseUrl;
  const label = `"${asset.title}" by ${asset.creator} — ${asset.license} via Openverse`;
  return (
    <a
      href={href ?? "https://openverse.org"}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "block truncate text-[10px] text-muted-foreground underline-offset-2 hover:underline",
        className,
      )}
      title={label}
    >
      {label}
    </a>
  );
}

export function MediaPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground",
        className,
      )}
    >
      <ImageOff className="h-6 w-6" aria-hidden="true" />
      <span className="px-3 text-center text-[11px]">{label}</span>
    </div>
  );
}
