interface AuthUser {
  id: number;
  email: string;
  name: string;
}

let _token: string | null = null;
let _user: AuthUser | null = null;

const TOKEN_KEY = "cashwise_token";
const USER_KEY = "cashwise_user";

export function setToken(t: string | null) {
  _token = t;
  try {
    if (t) sessionStorage.setItem(TOKEN_KEY, t);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export function getToken(): string | null {
  if (_token) return _token;
  try {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) { _token = stored; return stored; }
  } catch {}
  return null;
}

export function clearToken() {
  _token = null;
  _user = null;
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch {}
}

export function setUser(u: AuthUser | null) {
  _user = u;
  try {
    if (u) sessionStorage.setItem(USER_KEY, JSON.stringify(u));
    else sessionStorage.removeItem(USER_KEY);
  } catch {}
}

export function getUser(): AuthUser | null {
  if (_user) return _user;
  try {
    const stored = sessionStorage.getItem(USER_KEY);
    if (stored) { _user = JSON.parse(stored); return _user; }
  } catch {}
  return null;
}
