export interface UserCreate {
  email: string;
  password: string;
  is_superuser?: boolean;
}
