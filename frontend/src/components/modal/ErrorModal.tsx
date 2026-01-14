import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { palettes, text, semantic } from '@/theme/irisGarden';
import { CancelButton } from '../buttons/CancelButton';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title,
  description
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
        style={{
          backgroundColor: 'white'
        }}
      >
        {/* Header row with icon, text, and close button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: palettes.warning.warning0 + '50',
                color: semantic.warning
              }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5" />
            </div>
            <div>
              <h3
                className="font-heading"
                style={{
                  color: text.primary
                }}
              >
                {title}
              </h3>
              <p
                className="text-sm"
                style={{
                  color: text.subtle
                }}
              >
                Invalid operation
              </p>
            </div>
          </div>
          <CancelButton
            onClick={onClose}
            size="sm"
            tooltip="Close"
          />
        </div>

        {/* Description */}
        <p
          className="font-body font-sm"
          style={{
            color: text.secondary
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default ErrorModal;

