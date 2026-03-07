const LS_KEY = "authToken";
const COOKIE_KEY = "authToken";

function setCookie(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split("=").slice(1).join("="));
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  const ls = localStorage.getItem(LS_KEY);
  if (ls) return ls;

  const ck = getCookie(COOKIE_KEY);
  if (ck) {
    localStorage.setItem(LS_KEY, ck);
    return ck;
  }
  return null;
}

export function setAuthToken(token: string) {
  localStorage.setItem(LS_KEY, token);
  setCookie(COOKIE_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(LS_KEY);
  deleteCookie(COOKIE_KEY);
}