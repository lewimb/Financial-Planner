export interface Auth {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  userId: number;
  scope: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  message: string;
}

export interface AuthError {
  error: string;
}
