import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { text, palettes, colors } from '@/theme/colors';
import { authClient } from '../../services/auth/authClient';
import Breadcrumb from '../../components/controls/Breadcrumb';
import { useError } from '@/hooks/useError';
import { validatePassword, validatePasswordMatch, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from '@/utils/validation';

export function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showError } = useError();

  const isFormValid = () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      return false;
    }
    if (!validatePassword(newPassword).isValid) {
      return false;
    }
    if (!validatePasswordMatch(newPassword, confirmPassword).isValid) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      showError('Validation Error', 'Please fill all fields correctly');
      return;
    }

    setSubmitting(true);

    try {
      await authClient.updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      // Reset form on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Password updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update password';
      showError('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 mb-8">
        <Breadcrumb
          items={[
            { label: 'Settings', fontWeight: 'medium', color: text.primary },
          ]}
        />
      </div>

      <div className="max-w-xl">
        {/* Change Password Card */}
        <div
          className="rounded-2xl border shadow-sm p-8"
          style={{
            borderColor: palettes.primary[1],
            backgroundColor: 'white',
          }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: palettes.primary[0],
                color: colors.primary,
              }}
            >
              <FontAwesomeIcon icon={faLock} className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: text.primary }}>
                Change Password
              </h2>
              <p className="text-sm mt-1" style={{ color: text.subtle }}>
                Update your password to keep your account secure
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium mb-2"
                style={{ color: text.primary }}
              >
                Current Password <span style={{ color: colors.danger }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none transition-all duration-200"
                  style={{ borderColor: palettes.primary[1] }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = palettes.primary[2];
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${palettes.primary[0]}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = palettes.primary[1];
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your current password"
                  required
                  disabled={submitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg"
                  style={{ color: text.subtle }}
                >
                  <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium mb-2"
                style={{ color: text.primary }}
              >
                New Password <span style={{ color: colors.danger }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none transition-all duration-200"
                  style={{ borderColor: palettes.primary[1] }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = palettes.primary[2];
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${palettes.primary[0]}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = palettes.primary[1];
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder={`Enter new password (${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters)`}
                  required
                  minLength={PASSWORD_MIN_LENGTH}
                  maxLength={PASSWORD_MAX_LENGTH}
                  disabled={submitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg"
                  style={{ color: text.subtle }}
                >
                  <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs mt-1" style={{ color: text.subtle }}>
                Password must be between {PASSWORD_MIN_LENGTH} and {PASSWORD_MAX_LENGTH} characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium mb-2"
                style={{ color: text.primary }}
              >
                Confirm New Password <span style={{ color: colors.danger }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none transition-all duration-200"
                  style={{ borderColor: palettes.primary[1] }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = palettes.primary[2];
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${palettes.primary[0]}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = palettes.primary[1];
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Confirm your new password"
                  required
                  disabled={submitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg"
                  style={{ color: text.subtle }}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                </button>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs mt-1" style={{ color: colors.danger }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || !isFormValid()}
                className="w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  if (!submitting && isFormValid()) {
                    e.currentTarget.style.backgroundColor = palettes.primary[4];
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting && isFormValid()) {
                    e.currentTarget.style.backgroundColor = colors.primary;
                  }
                }}
              >
                <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                <span>{submitting ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
