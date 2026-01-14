export interface AuthFormProps {
  type: 'login' | 'register';
  onRegistrationSuccess?: (email: string) => void;
}
