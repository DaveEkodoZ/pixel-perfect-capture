const KEY = "cuy_auth";

export function getAuth(): { email: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function login(email: string) {
  localStorage.setItem(KEY, JSON.stringify({ email }));
}

export function logout() {
  localStorage.removeItem(KEY);
}
