import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { authClient } from '../../services/auth/authClient';
import { palettes, colors, text } from '@/theme/colors';
import { ActionButton } from '@/components/base/ActionButton';
import { validatePassword, validatePasswordMatch, PASSWORD_MIN_LENGTH } from '@/utils/validation';
// Image is in public/images/ - reference with absolute path
const logoImage = '/images/logo.webp';

type Step = 'email' | 'reset';

const CODE_LENGTH = 6;

// Email validation regex
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const codeInputRefs = useState<(HTMLInputElement | null)[]>(Array(CODE_LENGTH).fill(null))[0];

  // Track touched fields
  const [touched, setTouched] = useState({
    email: false,
    newPassword: false,
    confirmPassword: false
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Validation states
  const validation = useMemo(() => {
    const emailValid = isValidEmail(email);
    const passwordValid = validatePassword(newPassword).isValid;
    const confirmPasswordValid = validatePasswordMatch(newPassword, confirmPassword).isValid;
    const codeComplete = codeDigits.join('').length === CODE_LENGTH;

    return {
      email: { isValid: emailValid, error: emailValid ? null : 'Please enter a valid email' },
      newPassword: {
        isValid: passwordValid,
        error: passwordValid ? null : `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
      },
      confirmPassword: {
        isValid: confirmPasswordValid,
        error: confirmPasswordValid ? null : 'Passwords do not match'
      },
      code: { isValid: codeComplete, error: codeComplete ? null : 'Please enter the complete 6-digit code' }
    };
  }, [email, newPassword, confirmPassword, codeDigits]);

  // Form validity checks
  const isEmailFormValid = validation.email.isValid;
  const isResetFormValid = validation.code.isValid && validation.newPassword.isValid && validation.confirmPassword.isValid;

  // Get border color based on validation state
  const getBorderColor = (field: 'email' | 'newPassword' | 'confirmPassword') => {
    if (!touched[field]) return palettes.primary[2];
    return validation[field].isValid ? palettes.success[3] : palettes.danger[3];
  };

  // Get box shadow color based on validation state
  const getBoxShadowColor = (field: 'email' | 'newPassword' | 'confirmPassword') => {
    if (!touched[field]) return palettes.primary[3];
    return validation[field].isValid ? palettes.success[3] : palettes.danger[3];
  };

  const handleBlur = (field: keyof typeof touched, e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    e.target.style.boxShadow = '';
  };

  const handleFocus = (field: 'email' | 'newPassword' | 'confirmPassword', e: React.FocusEvent<HTMLInputElement>) => {
    const color = getBoxShadowColor(field);
    e.target.style.borderColor = color;
    e.target.style.boxShadow = `0 0 0 2px ${color}33`;
  };

  // Render validation icon
  const renderValidationIcon = (field: 'email' | 'newPassword' | 'confirmPassword') => {
    if (!touched[field]) return null;

    const isValid = validation[field].isValid;
    return (
      <FontAwesomeIcon
        icon={isValid ? faCheck : faXmark}
        className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4"
        style={{ color: isValid ? palettes.success[3] : palettes.danger[3] }}
      />
    );
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailFormValid) return;

    setLoading(true);
    setError(null);

    try {
      await authClient.forgotPassword({ email });
      setSuccessMessage('If the email exists, a password reset code has been sent.');
      setStep('reset');
      // Reset touched state for reset form
      setTouched(prev => ({ ...prev, newPassword: false, confirmPassword: false }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeDigitChange = (index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1) {
      value = value.slice(-1);
    }
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);

    // Auto-focus next input
    if (value && index < CODE_LENGTH - 1) {
      codeInputRefs[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace - move to previous input
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      codeInputRefs[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (pastedData) {
      const newDigits = [...codeDigits];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setCodeDigits(newDigits);
      // Focus the next empty input or the last one
      const nextEmptyIndex = newDigits.findIndex(d => !d);
      const focusIndex = nextEmptyIndex === -1 ? CODE_LENGTH - 1 : nextEmptyIndex;
      codeInputRefs[focusIndex]?.focus();
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isResetFormValid) return;

    setLoading(true);
    setError(null);

    try {
      await authClient.resetPassword({
        code: codeDigits.join(''),
        new_password: newPassword,
      });
      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  // Check if all code digits are filled
  const isCodeComplete = codeDigits.every(d => d !== '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div
        className={`w-full max-w-md px-8 py-12 transition-all duration-1000 ease-out relative
                   ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logoImage}
            alt="Logo"
            className="h-20 w-auto object-contain rounded-xl"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-medium" style={{ color: text.primary }}>
            {step === 'email' ? 'Reset Password' : 'Enter 6-digit Code'}
          </h2>
          <p className="mt-2" style={{ color: text.secondary }}>
            {step === 'email'
              ? 'Enter your email address to receive a reset code.'
              : `We sent a code to ${email}.`}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="p-3 mb-6 text-sm rounded-xl border animate-fadeIn"
            style={{
              backgroundColor: palettes.danger[0],
              color: palettes.danger[3],
              borderColor: palettes.danger[1],
            }}
          >
            {error}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div
            className="p-3 mb-6 text-sm rounded-xl border animate-fadeIn"
            style={{
              backgroundColor: palettes.success[0],
              color: palettes.success[3],
              borderColor: palettes.success[1],
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            <div className="flex space-x-4">
              <ActionButton
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => navigate('/auth')}
              >
                Back to Login
              </ActionButton>
              <ActionButton
                type="submit"
                variant="secondary"
                fullWidth
                disabled={loading || !isEmailFormValid}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
                ) : (
                  'Send Reset Code'
                )}
              </ActionButton>
            </div>
          </form>
        )}

        {/* Step 2: Reset Password Form */}
        {step === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-6">
            {/* 6-digit code input */}
            <div className="flex justify-center gap-2">
              {codeDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { codeInputRefs[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  onPaste={handleCodePaste}
                  autoComplete="one-time-code"
                  className="w-14 h-14 text-center text-xl border font-semibold rounded-xl shadow-sm focus:outline-none focus:ring-2 text-gray-700 transition-all duration-300"
                  style={{
                    borderColor: isCodeComplete ? palettes.success[3] : palettes.primary[2],
                    backgroundColor: palettes.primary[0] + '10',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = palettes.primary[3];
                    e.target.style.boxShadow = `0 0 0 2px ${palettes.primary[3]}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isCodeComplete ? palettes.success[3] : palettes.primary[2];
                    e.target.style.boxShadow = '';
                  }}
                />
              ))}
            </div>

            <div>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={(e) => handleBlur('newPassword', e)}
                  onFocus={(e) => handleFocus('newPassword', e)}
                  minLength={PASSWORD_MIN_LENGTH}
                  className="w-full px-5 py-4 pr-12 border rounded-full shadow-sm placeholder-gray-400 focus:outline-none text-gray-700 transition-all duration-300"
                  style={{
                    borderColor: getBorderColor('newPassword'),
                    backgroundColor: palettes.primary[0] + '10',
                  }}
                  placeholder="New password"
                  required
                />
                {renderValidationIcon('newPassword')}
              </div>
              <p
                className="mt-1 ml-4 text-xs"
                style={{
                  color: touched.newPassword
                    ? (validation.newPassword.isValid ? palettes.success[3] : palettes.danger[3])
                    : palettes.neutral[4]
                }}
              >
                {touched.newPassword && !validation.newPassword.isValid
                  ? validation.newPassword.error
                  : `Minimum ${PASSWORD_MIN_LENGTH} characters`}
              </p>
            </div>

            <div>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={(e) => handleBlur('confirmPassword', e)}
                  onFocus={(e) => handleFocus('confirmPassword', e)}
                  className="w-full px-5 py-4 pr-12 border rounded-full shadow-sm placeholder-gray-400 focus:outline-none text-gray-700 transition-all duration-300"
                  style={{
                    borderColor: getBorderColor('confirmPassword'),
                    backgroundColor: palettes.primary[0] + '10',
                  }}
                  placeholder="Confirm new password"
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

            <div className="flex space-x-4">
              <ActionButton
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => {
                  setStep('email');
                  setError(null);
                  setSuccessMessage(null);
                }}
              >
                Back
              </ActionButton>
              <ActionButton
                type="submit"
                variant="secondary"
                fullWidth
                disabled={loading || !isResetFormValid}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
                ) : (
                  'Reset Password'
                )}
              </ActionButton>
            </div>
          </form>
        )}

        {/* Back to login link */}
        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: palettes.neutral[4] }}>
            Remember your password?{' '}
            <Link
              to="/auth"
              className="font-medium transition-colors duration-300"
              style={{ color: colors.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.color = palettes.primary[4])}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.primary)}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
