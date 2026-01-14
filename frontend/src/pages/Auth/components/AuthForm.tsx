import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { authClient } from '../../../services/auth/authClient';
import { tokenManager } from '../../../services/core/tokenManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  RegisterFormData,
  UserCreate,
  LoginFormData,
  AuthFormProps
} from '@/types/auth';
import { ActionButton } from '@/components/base/ActionButton';
import { palettes } from '@/theme/colors';
import { useError } from '@/hooks/useError';

const AuthForm: React.FC<AuthFormProps> = ({ type, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showError } = useError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'register') {
        if (formData.password !== formData.confirmPassword) {
          showError('Password mismatch', 'The passwords you entered do not match.');
          setLoading(false);
          return;
        }
        const registerData: UserCreate = {
          email: formData.email,
          password: formData.password
        };
        await authClient.register(registerData);
        // Notify parent component about successful registration
        onRegistrationSuccess?.(formData.email);
      } else {
        const loginData: LoginFormData = {
          email: formData.email,
          password: formData.password
        };
        const response = await authClient.login(loginData);
        // Store tokens using tokenManager (saves to localStorage with correct keys)
        tokenManager.saveTokens(response.access_token, response.refresh_token, response.expires_in);
        // Update user context
        login({ email: formData.email });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      const title = type === 'register' ? 'Registration error' : 'Login error';
      showError(title, message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative group">
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-5 py-4 border rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 text-gray-700 transition-all duration-300"
          style={{
            borderColor: palettes.primary[2],
            backgroundColor: palettes.primary[0] + '10',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = palettes.primary[3];
            e.target.style.boxShadow = `0 0 0 2px ${palettes.primary[3]}33`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = palettes.primary[2];
            e.target.style.boxShadow = '';
          }}
          placeholder="email@example.com"
          required
        />
      </div>

      <div className="relative group">
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-5 py-4 border rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 text-gray-700 transition-all duration-300"
          style={{
            borderColor: palettes.primary[2],
            backgroundColor: palettes.primary[0] + '10',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = palettes.primary[3];
            e.target.style.boxShadow = `0 0 0 2px ${palettes.primary[3]}33`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = palettes.primary[2];
            e.target.style.boxShadow = '';
          }}
          placeholder="Password"
          required
        />
      </div>

      {type === 'register' && (
        <div className="relative group">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-5 py-4 border rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 text-gray-700 transition-all duration-300"
            style={{
              borderColor: palettes.primary[2],
              backgroundColor: palettes.primary[0] + '10',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = palettes.primary[3];
              e.target.style.boxShadow = `0 0 0 2px ${palettes.primary[3]}33`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = palettes.primary[2];
              e.target.style.boxShadow = '';
            }}
            placeholder="Confirm password"
            required
          />
        </div>
      )}

      <div className="mt-8">
        <ActionButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
          onClick={() => {
            // Form submission is handled by the form's onSubmit
          }}
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin" />
          ) : (
            type === 'login' ? 'Log in' : 'Create Account'
          )}
        </ActionButton>
      </div>
    </form>
  );
};

export default AuthForm;
