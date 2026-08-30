import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

import { captchaCookieName, captchaSessionMaxAge } from "./session";

export interface CaptchaGate {
  readonly configured: boolean;
  readonly verified: boolean;
  readonly siteKey: string | null;
}

export const getCaptchaGate = createServerFn({ method: "GET" }).handler(
  async (): Promise<CaptchaGate> => {
    const siteKey = process.env["HCAPTCHA_SITE_KEY"] ?? null;
    const configured = Boolean(siteKey && process.env["HCAPTCHA_SECRET_KEY"]);
    const { isCaptchaCookieValid } = await import("./verify.server");
    const verified = configured ? await isCaptchaCookieValid(getCookie(captchaCookieName)) : false;
    return { configured, verified, siteKey: configured ? siteKey : null };
  },
);

export const verifyCaptcha = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => z.object({ token: z.string().min(1) }).parse(input))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const { verifyHcaptchaToken, createCaptchaCookieValue } = await import("./verify.server");
    const result = await verifyHcaptchaToken(data.token);
    if (!result.ok) {
      return { ok: false, error: result.errors?.[0] ?? "invalid-token" };
    }

    setCookie(captchaCookieName, await createCaptchaCookieValue(), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: captchaSessionMaxAge,
    });
    return { ok: true };
  });
