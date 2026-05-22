import Cookies from "js-cookie";

const TOKEN_KEY = "mita_token";
const USER_KEY = "mita_user";

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    expires: 1,        // 1 day
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function removeToken(): void {
  Cookies.remove(TOKEN_KEY);
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

export function saveUser(user: object): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
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
