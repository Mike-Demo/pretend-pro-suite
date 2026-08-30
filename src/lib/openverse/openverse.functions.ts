import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { searchAudio, searchImages } from "./openverse.server";

const searchInput = z.object({
  query: z.string().trim().min(1).max(120),
  pageSize: z.number().int().min(1).max(20).default(8),
});

export const searchOpenverseImages = createServerFn({ method: "GET" })
  .inputValidator((data) => searchInput.parse(data))
  .handler(async ({ data }) => searchImages(data.query, data.pageSize));

export const searchOpenverseAudio = createServerFn({ method: "GET" })
  .inputValidator((data) => searchInput.parse(data))
  .handler(async ({ data }) => searchAudio(data.query, data.pageSize));
