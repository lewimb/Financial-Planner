export interface User {
  id: number;
  email: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at?: string;
  updated_at?: string;
}
