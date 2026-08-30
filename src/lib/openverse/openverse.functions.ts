import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { searchAudio, searchImages, searchInput } from "./openverse.server";

export const searchOpenverseImages = createServerFn({ method: "GET" })
  .inputValidator((data) => searchInput.parse(data))
  .handler(async ({ data }) => searchImages(data.query, data.pageSize));

export const searchOpenverseAudio = createServerFn({ method: "GET" })
  .inputValidator((data) => searchInput.parse(data))
  .handler(async ({ data }) => searchAudio(data.query, data.pageSize));
