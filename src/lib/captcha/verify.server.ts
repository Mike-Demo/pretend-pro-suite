import { captchaSessionMaxAge } from "./session";

const encoder = new TextEncoder();

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

function sessionSecret(): string {
  return process.env["CAPTCHA_SESSION_SECRET"] ?? process.env["HCAPTCHA_SECRET_KEY"] ?? "";
}

export async function createCaptchaCookieValue(): Promise<string> {
  const expires = Date.now() + captchaSessionMaxAge * 1000;
  const payload = String(expires);
  return `${payload}.${await sign(payload, sessionSecret())}`;
}

export async function isCaptchaCookieValid(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expires = Number(payload);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = await sign(payload, sessionSecret());
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

export interface HcaptchaVerifyResult {
  readonly ok: boolean;
  readonly errors?: ReadonlyArray<string>;
}

export async function verifyHcaptchaToken(token: string): Promise<HcaptchaVerifyResult> {
  const secret = process.env["HCAPTCHA_SECRET_KEY"];
  if (!secret) return { ok: false, errors: ["missing-secret"] };

  const body = new URLSearchParams({ secret, response: token });
  const res = await fetch("https://api.hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) return { ok: false, errors: ["verification-unavailable"] };

  const json = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
  return json.success === true
    ? { ok: true }
    : { ok: false, errors: json["error-codes"] ?? ["invalid-token"] };
}
