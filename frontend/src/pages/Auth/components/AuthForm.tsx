import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { authClient } from '../../../services/auth/authClient';
import { tokenManager } from '../../../services/core/tokenManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  RegisterFormData,
  UserCreate,
  LoginFormData,
  AuthFormProps
} from '@/types/auth';
import { ActionButton } from '@/components/base/ActionButton';
import { palettes } from '@/theme/colors';
import { useError } from '@/hooks/useError';
import { validatePassword, validatePasswordMatch, PASSWORD_MIN_LENGTH } from '@/utils/validation';

// Email validation regex
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const AuthForm: React.FC<AuthFormProps> = ({ type, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({
    email: false,
    password: false,
    confirmPassword: false
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showError } = useError();

  // Validation states
  const validation = useMemo(() => {
    const emailValid = isValidEmail(formData.email);
    const passwordValid = type === 'register'
      ? validatePassword(formData.password).isValid
      : formData.password.length > 0;
    const confirmPasswordValid = type === 'register'
      ? validatePasswordMatch(formData.password, formData.confirmPassword).isValid
      : true;

    return {
      email: { isValid: emailValid, error: emailValid ? null : 'Please enter a valid email' },
      password: {
        isValid: passwordValid,
        error: passwordValid ? null : `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
      },
      confirmPassword: {
        isValid: confirmPasswordValid,
        error: confirmPasswordValid ? null : 'Passwords do not match'
      }
    };
  }, [formData, type]);

  // Check if form is valid for submission
  const isFormValid = useMemo(() => {
    if (type === 'login') {
      return validation.email.isValid && formData.password.length > 0;
    }
    return validation.email.isValid && validation.password.isValid && validation.confirmPassword.isValid;
  }, [validation, type, formData.password.length]);

  // Get border color based on validation state
  const getBorderColor = (field: 'email' | 'password' | 'confirmPassword') => {
    if (!touched[field]) return palettes.primary[2];
    if (field === 'password' && type === 'login') {
      return formData.password.length > 0 ? palettes.success[3] : palettes.primary[2];
    }
    return validation[field].isValid ? palettes.success[3] : palettes.danger[3];
  };

  // Get box shadow color based on validation state
  const getBoxShadowColor = (field: 'email' | 'password' | 'confirmPassword') => {
    if (!touched[field]) return palettes.primary[3];
    if (field === 'password' && type === 'login') {
      return formData.password.length > 0 ? palettes.success[3] : palettes.primary[3];
    }
    return validation[field].isValid ? palettes.success[3] : palettes.danger[3];
  };

  // Render validation icon
  const renderValidationIcon = (field: 'email' | 'password' | 'confirmPassword') => {
    if (!touched[field]) return null;

    // For login, password just needs to have content
    if (field === 'password' && type === 'login') {
      if (formData.password.length === 0) return null;
      return (
        <FontAwesomeIcon
          icon={faCheck}
          className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: palettes.success[3] }}
        />
      );
    }

    const isValid = validation[field].isValid;
    return (
      <FontAwesomeIcon
        icon={isValid ? faCheck : faXmark}
        className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4"
        style={{ color: isValid ? palettes.success[3] : palettes.danger[3] }}
      />
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);

    try {
      if (type === 'register') {
        const registerData: UserCreate = {
          email: formData.email,
          password: formData.password
        };
        await authClient.register(registerData);
        onRegistrationSuccess?.(formData.email);
      } else {
        const loginData: LoginFormData = {
          email: formData.email,
          password: formData.password
        };
        const response = await authClient.login(loginData);
        tokenManager.saveTokens(response.access_token, response.refresh_token, response.expires_in);
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

  const handleBlur = (field: string, e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    // Clear box shadow on blur
    e.target.style.boxShadow = '';
  };

  const handleFocus = (field: 'email' | 'password' | 'confirmPassword', e: React.FocusEvent<HTMLInputElement>) => {
    const color = getBoxShadowColor(field);
    e.target.style.borderColor = color;
    e.target.style.boxShadow = `0 0 0 2px ${color}33`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email field */}
      <div>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={(e) => handleBlur('email', e)}
            onFocus={(e) => handleFocus('email', e)}
            className="w-full px-5 py-4 pr-12 border rounded-full shadow-sm placeholder-gray-400 focus:outline-none text-gray-700 transition-all duration-300"
            style={{
              borderColor: getBorderColor('email'),
              backgroundColor: palettes.primary[0] + '10',
            }}
            placeholder="email@example.com"
            required
          />
          {renderValidationIcon('email')}
        </div>
        {touched.email && !validation.email.isValid && (
          <p className="mt-1 ml-4 text-xs" style={{ color: palettes.danger[3] }}>
            {validation.email.error}
          </p>
        )}
      </div>

      {/* Password field */}
      <div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={(e) => handleBlur('password', e)}
            onFocus={(e) => handleFocus('password', e)}
            minLength={type === 'register' ? PASSWORD_MIN_LENGTH : undefined}
            className="w-full px-5 py-4 pr-12 border rounded-full shadow-sm placeholder-gray-400 focus:outline-none text-gray-700 transition-all duration-300"
            style={{
              borderColor: getBorderColor('password'),
              backgroundColor: palettes.primary[0] + '10',
            }}
            placeholder="Password"
            required
          />
          {renderValidationIcon('password')}
        </div>
        {type === 'register' && (
          <p
            className="mt-1 ml-4 text-xs"
            style={{
              color: touched.password
                ? (validation.password.isValid ? palettes.success[3] : palettes.danger[3])
                : palettes.neutral[4]
            }}
          >
            {touched.password && !validation.password.isValid
              ? validation.password.error
              : `Minimum ${PASSWORD_MIN_LENGTH} characters`}
          </p>
        )}
      </div>

      {/* Confirm password field (register only) */}
      {type === 'register' && (
        <div>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={(e) => handleBlur('confirmPassword', e)}
              onFocus={(e) => handleFocus('confirmPassword', e)}
              className="w-full px-5 py-4 pr-12 border rounded-full shadow-sm placeholder-gray-400 focus:outline-none text-gray-700 transition-all duration-300"
              style={{
                borderColor: getBorderColor('confirmPassword'),
                backgroundColor: palettes.primary[0] + '10',
              }}
              placeholder="Confirm password"
              required
            />
            {renderValidationIcon('confirmPassword')}
          </div>
          {touched.confirmPassword && !validation.confirmPassword.isValid && (
            <p className="mt-1 ml-4 text-xs" style={{ color: palettes.danger[3] }}>
              {validation.confirmPassword.error}
            </p>
          )}
        </div>
      )}

      {/* Submit button */}
      <div className="mt-8">
        <ActionButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading || !isFormValid}
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
