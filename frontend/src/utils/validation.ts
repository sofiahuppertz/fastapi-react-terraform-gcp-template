// Password validation constants (must match backend requirements)
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

export interface PasswordValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validates password against backend requirements
 * - Minimum 8 characters
 * - Maximum 72 characters
 */
export function validatePassword(password: string): PasswordValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
    };
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Password must be no more than ${PASSWORD_MAX_LENGTH} characters`
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validates that passwords match
 */
export function validatePasswordMatch(password: string, confirmPassword: string): PasswordValidationResult {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return { isValid: true, error: null };
}
