import Cookies from "js-cookie";

const TOKEN_KEY = "mita_token";
const USER_KEY = "mita_user";
const ROLE_KEY = "mita_role";

const COOKIE_OPTS = {
  expires: 1,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
};

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, COOKIE_OPTS);
}

export function removeToken(): void {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

export function saveUser(user: object): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  // Also persist role in a readable cookie for middleware (Edge runtime)
  const role = (user as Record<string, unknown>).role;
  if (typeof role === "string" && role) {
    Cookies.set(ROLE_KEY, role, COOKIE_OPTS);
  }
}

export function getSavedUser<T>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
