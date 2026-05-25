export interface Auth {
  iss: string;
  exp: number;
  iat: number;
  userId: number;
  name: string;
  email: string;
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
