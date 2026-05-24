interface AuthUser {
  id: number;
  email: string;
  name: string;
}

let _token: string | null = null;
let _user: AuthUser | null = null;

export function setToken(t: string | null) {
  _token = t;
}

export function getToken(): string | null {
  return _token;
}

export function clearToken() {
  _token = null;
  _user = null;
}

export function setUser(u: AuthUser | null) {
  _user = u;
}

export function getUser(): AuthUser | null {
  return _user;
}
