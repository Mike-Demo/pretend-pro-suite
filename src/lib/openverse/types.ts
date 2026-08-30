/** Typed DTO for a Creative-Commons asset returned by the Openverse API. */
export interface OpenverseAsset {
  id: string;
  kind: "image" | "audio";
  url: string;
  thumbnail: string | null;
  title: string;
  creator: string;
  creatorUrl: string | null;
  license: string;
  licenseUrl: string | null;
  foreignLandingUrl: string | null;
  /** Audio only: duration in milliseconds. */
  durationMs: number | null;
}

export interface OpenverseSearchResult {
  assets: OpenverseAsset[];
  /** True when served anonymously (no registered credentials configured). */
  anonymous: boolean;
}
