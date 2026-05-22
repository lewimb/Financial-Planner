let _token: string | null = null;

export function setToken(t: string | null) {
  _token = t;
}

export function getToken(): string | null {
  return _token;
}

export function clearToken() {
  _token = null;
}
