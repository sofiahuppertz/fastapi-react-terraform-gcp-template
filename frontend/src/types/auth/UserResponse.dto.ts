export interface UserResponse {
  id: string;
  email: string;
  is_superuser: boolean;
  is_active: boolean;
  last_connected_at: string | null;
  created_at: string;
  updated_at: string;
}
