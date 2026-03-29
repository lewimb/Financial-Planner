export interface User {
  id: number;
  username: number;
  email: string;
  password: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}
