export interface Auth {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  userId: number;
  scope: string;
}
