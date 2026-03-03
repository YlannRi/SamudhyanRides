// src/api.ts

const RAW_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

// Default to empty string so calls like apiFetch("/account/...") work even without env set.
// If you use a Vite proxy or nginx reverse-proxy, set VITE_API_BASE_URL="/api" and call apiFetch("/auth/login") etc.
const API_BASE_URL = (RAW_BASE ?? "").replace(/\/+$/, "");

/**
 * Join base + path safely.
 * - If API_BASE_URL="" and path="/account/..." => "/account/..."
 * - If API_BASE_URL="/api" and path="/auth/login" => "/api/auth/login"
 */
function buildUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}

export type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  auth?: boolean; // attach Bearer token from localStorage
};

export async function apiFetch<T = any>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
  const url = buildUrl(path);

  const headers: Record<string, string> = {
    ...(opts.headers ?? {}),
  };

  // Attach token automatically unless auth:false
  if (opts.auth !== false) {
    const token = localStorage.getItem("authToken");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...opts, headers });

  // Try to parse error body for nicer messages
    // Try to parse error body for nicer messages (and preserve structured error detail)
  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    let detail: any = null;
    try {
      const err = await res.json();
      detail = err?.detail ?? err;
      if (err?.detail) {
        if (typeof err.detail === "string") message = err.detail;
        else if (Array.isArray(err.detail) && err.detail[0]?.msg) {
          message = `Validation Error: ${err.detail[0].loc?.join?.(".") ?? "body"} - ${err.detail[0].msg}`;
        } else if (typeof err.detail === "object" && err.detail?.field_errors) {
          // Keep the generic message; field-level errors are available in e.detail
          message = "Please fix the highlighted fields.";
        }
      }
    } catch {
      // ignore JSON parse failures
    }

    const e: any = new Error(message);
    e.status = res.status;
    e.detail = detail;
    throw e;
  }

  // Some endpoints might return empty body (204)
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}