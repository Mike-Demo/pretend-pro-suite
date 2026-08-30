const API_BASE = "https://api.openverse.org/v1";
const REQUEST_TIMEOUT_MS = 10_000;

export interface OpenverseCredentials {
  clientId: string;
  clientSecret: string;
  name: string;
}

export type RegisterOutcome =
  | { ok: true; credentials: OpenverseCredentials }
  | { ok: false; error: string };

/** Registers an Openverse API application (client credentials are emailed/verified by Openverse). */
export async function registerApplication(input: {
  name: string;
  description: string;
  email: string;
}): Promise<RegisterOutcome> {
  try {
    const res = await fetch(`${API_BASE}/auth_tokens/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const text = await res.text();
    if (!res.ok) {
      let message = `Openverse rejected the registration (HTTP ${res.status}).`;
      try {
        const parsed = JSON.parse(text) as Record<string, unknown>;
        const detail = Object.entries(parsed)
          .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(" ") : String(value)}`)
          .join(" · ");
        if (detail) message = detail;
      } catch {
        /* keep the generic message */
      }
      return { ok: false, error: message };
    }
    const data = JSON.parse(text) as { name?: string; client_id?: string; client_secret?: string };
    if (!data.client_id || !data.client_secret) {
      return { ok: false, error: "Openverse did not return credentials. Please try again." };
    }
    return {
      ok: true,
      credentials: {
        clientId: data.client_id,
        clientSecret: data.client_secret,
        name: data.name ?? input.name,
      },
    };
  } catch {
    return { ok: false, error: "Could not reach the Openverse API. Please try again in a moment." };
  }
}

export interface OpenverseStatus {
  configured: boolean;
  tokenWorks: boolean;
  message: string;
}

/** Reports whether the stored secrets exist and actually mint a token. */
export async function readStatus(): Promise<OpenverseStatus> {
  const clientId = process.env["OPENVERSE_CLIENT_ID"];
  const clientSecret = process.env["OPENVERSE_CLIENT_SECRET"];
  if (!clientId || !clientSecret) {
    return {
      configured: false,
      tokenWorks: false,
      message: "Anonymous access — media still loads, with stricter rate limits.",
    };
  }
  try {
    const res = await fetch(`${API_BASE}/auth_tokens/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) {
      return {
        configured: true,
        tokenWorks: false,
        message:
          "Keys are stored but Openverse refused them. Confirm you clicked the verification link in your email.",
      };
    }
    return {
      configured: true,
      tokenWorks: true,
      message: "Authenticated — higher rate limits are active.",
    };
  } catch {
    return {
      configured: true,
      tokenWorks: false,
      message: "Keys are stored but the token check could not reach Openverse just now.",
    };
  }
}
