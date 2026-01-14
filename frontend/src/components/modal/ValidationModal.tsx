import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { text, palettes } from '@/theme/colors';
import { CancelButton, SaveButton } from '@/components/buttons';

interface ValidationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  icon?: IconDefinition;
  title?: string;
  description?: string;
}

const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
  icon = faExclamationTriangle,
  title = "Validate Chosen Abundances",
  description = "This action will validate the chosen abundances (polar or apolar) and proceed to generate natural resource suggestions. This process is irreversible and you won't be able to modify molecule chosen abundances after validation.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal content */}
      <div 
        className="relative rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
          <FontAwesomeIcon 
            icon={icon} 
            className="h-5 w-5 mr-3"
            style={{ color: palettes.primary[3] }}
          />
          <h3 
            className="text-lg font-heading"
            style={{ color: text.primary }}
          >
            {title}
          </h3>
        </div>
        
        <p 
          className="mb-6"
          style={{ color: text.secondary }}
        >
          {description}
        </p>
        
        <div className="flex justify-end space-x-3">
          <CancelButton
            onClick={onCancel}
            disabled={isLoading}
            size="md"
            tooltip="Cancel"
          />
          <SaveButton
            onClick={onConfirm}
            disabled={isLoading}
            size="md"
            tooltip="Validate"
          />
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;

