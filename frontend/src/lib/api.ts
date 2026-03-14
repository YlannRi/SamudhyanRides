// src/api.ts
import { clearAuthToken } from "./authToken";

const RAW_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
const PROD_API_BASE_URL = 'https://samudhyanrides-api.purplerock-a57ae792.francecentral.azurecontainerapps.io';
const DEV_API_BASE_URL = 'https://localhost:8000';

type LocationLike = Pick<Location, 'hostname' | 'origin' | 'protocol'>;

function getCurrentLocation(): LocationLike | null {
  return typeof window === 'undefined' ? null : window.location;
}

function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/, '');
}

function isLocalHost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

function normalizeAbsoluteBaseUrl(rawBase: string, currentLocation: LocationLike | null) {
  const parsed = new URL(rawBase);

  if (currentLocation?.protocol === 'https:' && parsed.protocol === 'http:') {
    parsed.protocol = 'https:';
  }

  return trimTrailingSlashes(parsed.toString());
}

export function resolveApiBaseUrl(
  rawBase = RAW_BASE,
  currentLocation: LocationLike | null = getCurrentLocation(),
) {
  const base = trimTrailingSlashes((rawBase ?? '').trim());
  const appIsLocal = currentLocation ? isLocalHost(currentLocation.hostname) : false;

  if (base.startsWith('/')) {
    return base;
  }

  if (base) {
    try {
      const normalized = normalizeAbsoluteBaseUrl(base, currentLocation);
      const apiHost = new URL(normalized).hostname;

      if (!appIsLocal && isLocalHost(apiHost)) {
        return PROD_API_BASE_URL;
      }

      return normalized;
    } catch {
      return base;
    }
  }

  if (appIsLocal) {
    return DEV_API_BASE_URL;
  }

  return currentLocation ? PROD_API_BASE_URL : '';
}

/**
 * Join base + path safely.
 * - If base="" and path="/account/..." => "/account/..."
 * - If base="/api" and path="/auth/login" => "/api/auth/login"
 */
export function buildApiUrl(path: string, rawBase = RAW_BASE, currentLocation: LocationLike | null = getCurrentLocation()) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${resolveApiBaseUrl(rawBase, currentLocation)}${p}`;
}

export function buildWebSocketUrl(
  path: string,
  rawBase = RAW_BASE,
  currentLocation: LocationLike | null = getCurrentLocation(),
) {
  const p = path.startsWith('/') ? path : `/${path}`;
  const apiBaseUrl = resolveApiBaseUrl(rawBase, currentLocation);
  const absoluteBase = apiBaseUrl.startsWith('/')
    ? trimTrailingSlashes(new URL(apiBaseUrl, currentLocation?.origin ?? 'http://localhost').toString())
    : apiBaseUrl;

  return `${absoluteBase.replace(/^http/i, 'ws')}${p}`;
}

export type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  auth?: boolean; // attach Bearer token from localStorage
};

export async function apiFetch<T = any>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
  const url = buildApiUrl(path);

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
    if (res.status === 401) {
      clearAuthToken();
    }

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
