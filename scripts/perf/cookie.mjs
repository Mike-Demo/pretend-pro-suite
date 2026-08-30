/**
 * Mints a valid pp_verified cookie for the locally served production build so
 * protected OS routes can be measured. Measurement-only: it depends on the
 * local CAPTCHA_SESSION_SECRET passed to the local server, never a real key.
 */
import { createHmac } from "node:crypto";

export const COOKIE_NAME = "pp_verified";

export function mintVerifiedCookie(
  secret = process.env["CAPTCHA_SESSION_SECRET"] ?? "perf-local-test-secret",
  ttlMs = 12 * 60 * 60 * 1000,
) {
  const payload = String(Date.now() + ttlMs);
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

if (import.meta.main) {
  process.stdout.write(mintVerifiedCookie());
}
