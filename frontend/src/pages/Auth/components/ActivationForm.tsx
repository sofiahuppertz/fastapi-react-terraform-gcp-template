import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { authClient } from '../../../services/auth/authClient';
import { ActivationFormProps } from '@/types/auth';
import { palettes } from '@/theme/colors';
import { ActionButton } from '@/components/base/ActionButton';

const ActivationForm: React.FC<ActivationFormProps> = ({ email, onActivationSuccess, onCancel }) => {
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authClient.activateAccount({
        email,
        activation_code: activationCode,
      });
      onActivationSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-medium text-gray-800">
          Activate Your Account
        </h3>
        <p className="mt-2 text-gray-600">
          Please enter the activation code sent to {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value)}
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
            placeholder="Enter activation code"
            required
          />
        </div>

        {error && (
          <div
            className="p-3 text-sm rounded-xl border animate-fadeIn"
            style={{
              backgroundColor: palettes.danger[0],
              color: palettes.danger[3],
              borderColor: palettes.danger[1]
            }}
          >
            {error}
          </div>
        )}

        <div className="flex space-x-4">
          <ActionButton
            type="button"
            variant="ghost"
            fullWidth
            onClick={() => {
              onCancel();
            }}
          >
            Cancel
          </ActionButton>
          <ActionButton
            type="submit"
            variant="success"
            fullWidth
            disabled={loading}
            onClick={() => {
              // Handled by form submit
            }}
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
            ) : (
              'Activate Account'
            )}
          </ActionButton>
        </div>
      </form>
    </div>
  );
};

export default ActivationForm;
