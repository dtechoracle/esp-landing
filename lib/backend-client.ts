export const DEFAULT_BACKEND_BASE_URL =
  "https://eventspacepro-backend-6nvx.onrender.com";

const TOKEN_KEY = "esp_admin_token";

/** Base URL of the hosted backend. Override with NEXT_PUBLIC_BACKEND_BASE_URL. */
export function backendBaseUrl(): string {
  if (
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL
  ) {
    return process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  }
  return DEFAULT_BACKEND_BASE_URL;
}

export type WaitlistEntry = {
  _id?: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  phone?: string;
  whatsappOn?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/* ---- token (localStorage, browser only) ---- */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

/* ---- waitlist signup (public landing form) ---- */
export async function waitlistSignup(input: {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role?: string;
  whatsappOn?: boolean;
  phone?: string;
}): Promise<{ ok: boolean; status: number; message?: string }> {
  let res: Response;
  try {
    res = await fetch(`${backendBaseUrl()}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    return {
      ok: false,
      status: 0,
      message:
        "Cannot reach the waitlist server. Please check your connection and try again.",
    };
  }

  let data: {
    message?: unknown;
    error?: unknown;
    retryAfter?: unknown;
  } | null = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response; fall through to status-based handling.
  }

  if (res.status === 429) {
    const retryAfter =
      typeof data?.retryAfter === "number" ? Math.max(1, data.retryAfter) : 60;
    const minutes = Math.ceil(retryAfter / 60);
    return {
      ok: false,
      status: 429,
      message: `We've had a lot of sign-ups from this connection. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  return {
    ok: res.ok,
    status: res.status,
    message:
      (typeof data?.message === "string" ? data.message : undefined) ||
      (typeof data?.error === "string" ? data.error : undefined),
  };
}

/* ---- admin login (POST /api/admin/login -> JWT) ---- */
export async function adminLogin(
  email: string,
  password: string
): Promise<{ ok: boolean; token?: string; message?: string }> {
  let res: Response;
  try {
    res = await fetch(`${backendBaseUrl()}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return {
      ok: false,
      message: "Cannot reach the login server. Please try again.",
    };
  }

  let data: { token?: unknown; message?: unknown } | null = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response; fall through to status-based handling.
  }

  if (res.status === 200 && data && typeof data.token === "string") {
    return { ok: true, token: data.token };
  }
  if (res.status === 401) {
    return { ok: false, message: "Invalid email or password." };
  }
  if (res.status === 400) {
    return {
      ok: false,
      message:
        typeof data?.message === "string"
          ? data.message
          : "Email and password are required.",
    };
  }
  return {
    ok: false,
    message:
      typeof data?.message === "string"
        ? data.message
        : `Login failed (HTTP ${res.status}).`,
  };
}

/* ---- broadcast email (POST /api/admin/broadcast-email with Bearer token) ---- */
export async function sendBroadcastEmail(
  token: string,
  payload: {
    emails?: string[];
    subject: string;
    message?: string;
    html?: string;
  }
): Promise<{
  ok: boolean;
  status?: number;
  message?: string;
  queuedCount?: number;
  audience?: string;
}> {
  let res: Response;
  try {
    res = await fetch(`${backendBaseUrl()}/api/admin/broadcast-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Cannot reach the broadcast server.",
    };
  }

  let data: {
    message?: unknown;
    queuedCount?: unknown;
    audience?: unknown;
  } | null = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response.
  }

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      message:
        typeof data?.message === "string"
          ? data.message
          : `Broadcast failed (HTTP ${res.status}).`,
    };
  }

  return {
    ok: true,
    status: res.status,
    message: typeof data?.message === "string" ? data.message : undefined,
    queuedCount: typeof data?.queuedCount === "number" ? data.queuedCount : undefined,
    audience: typeof data?.audience === "string" ? data.audience : undefined,
  };
}

export async function fetchWaitlist(
  token: string
): Promise<{
  ok: boolean;
  entries: WaitlistEntry[];
  status?: number;
  message?: string;
}> {
  let res: Response;
  try {
    res = await fetch(`${backendBaseUrl()}/api/admin/waitlist`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
  } catch {
    return {
      ok: false,
      entries: [],
      status: 0,
      message: "Cannot reach the waitlist server.",
    };
  }

  let data: { data?: unknown; message?: unknown } | null = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response.
  }

  if (!res.ok) {
    return {
      ok: false,
      entries: [],
      status: res.status,
      message:
        res.status === 401
          ? "Your session has expired. Please sign in again."
          : `Backend responded with HTTP ${res.status}.`,
    };
  }

  const raw = Array.isArray(data?.data) ? data.data : [];
  const entries: WaitlistEntry[] = (raw as unknown[])
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .map((e) => ({
      _id: typeof e._id === "string" ? e._id : undefined,
      email: typeof e.email === "string" ? e.email : undefined,
      name: typeof e.name === "string" ? e.name : undefined,
      firstName: typeof e.firstName === "string" ? e.firstName : undefined,
      lastName: typeof e.lastName === "string" ? e.lastName : undefined,
      role: typeof e.role === "string" ? e.role : undefined,
      phone: typeof e.phone === "string" ? e.phone : undefined,
      whatsappOn: typeof e.whatsappOn === "boolean" ? e.whatsappOn : undefined,
      createdAt:
        typeof e.createdAt === "string" ? e.createdAt : undefined,
      updatedAt:
        typeof e.updatedAt === "string" ? e.updatedAt : undefined,
    }));

  return { ok: true, entries };
}
