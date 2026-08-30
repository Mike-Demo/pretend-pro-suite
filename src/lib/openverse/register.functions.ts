import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const registerInput = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(500),
  email: z.string().trim().email().max(160),
});

export const registerOpenverseApp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => registerInput.parse(data))
  .handler(async ({ data }) => {
    const { registerApplication } = await import("./register.server");
    return registerApplication(data);
  });

export const getOpenverseStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { readStatus } = await import("./register.server");
  return readStatus();
});
