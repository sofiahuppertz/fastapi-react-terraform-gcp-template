import {
  UserCreate,
  UserResponse,
  LoginFormData,
  LoginResponse,
  ActivationRequest,
  ActivationResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  PasswordResetResponse,
} from '../../types/auth';
import { HttpClient } from '../core/HTTPClient';

export class AuthClient {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(`${import.meta.env.VITE_API_BASE_URL}/api/auth`);
  }

  public async login(credentials: LoginFormData): Promise<LoginResponse> {
    try {
      const formData = new URLSearchParams({
        username: credentials.email,
        password: credentials.password,
      });
      return await this.httpClient.post<LoginResponse>('/login', formData, { public: true });
    } catch (error) {
      throw new Error('The email or password you entered is incorrect. Please try again.');
    }
  }

  public async register(userData: UserCreate): Promise<UserResponse> {
    try {
      return await this.httpClient.post<UserResponse>('/register', userData, { public: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      if (errorMessage.includes('409')) {
        throw new Error('User with this email already exists');
      }
      if (errorMessage.includes('422')) {
        throw new Error('Invalid registration data');
      }
      throw new Error('Registration failed');
    }
  }

  public async activateAccount(activationData: ActivationRequest): Promise<ActivationResponse> {
    try {
      return await this.httpClient.post<ActivationResponse>('/activate', activationData, { public: true });
    } catch (error) {
      throw new Error('Account activation failed');
    }
  }

  public async forgotPassword(data: ForgotPasswordRequest): Promise<PasswordResetResponse> {
    try {
      return await this.httpClient.post<PasswordResetResponse>('/forgot-password', data, { public: true });
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  }

  public async resetPassword(data: ResetPasswordRequest): Promise<PasswordResetResponse> {
    try {
      return await this.httpClient.post<PasswordResetResponse>('/reset-password', data, { public: true });
    } catch (error) {
      throw new Error('Password reset failed');
    }
  }

  async updatePassword(data: PasswordUpdateRequest, token: string): Promise<PasswordUpdateResponse | null> {
    try {
        return await this.httpClient.put<PasswordResetResponse>('/password', data);
    } catch (error) {
        throw new Error('Password reset failed');
    }
  }
}

// Singleton instance
export const authClient = new AuthClient();
