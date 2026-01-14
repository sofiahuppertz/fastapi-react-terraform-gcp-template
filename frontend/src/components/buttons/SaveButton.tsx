// components/buttons/SaveButton.tsx
import React from 'react';
import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconButton, IconButtonSize } from '../base/IconButton';

interface SaveButtonProps {
  onClick: (e: React.MouseEvent) => void;
  size?: IconButtonSize;
  tooltip?: string;
  disabled?: boolean;
  loading?: boolean;
  stopPropagation?: boolean;
  className?: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  size = 'md',
  tooltip = 'Save',
  disabled = false,
  loading = false,
  stopPropagation = false,
  className = ''
}) => {
  return (
    <IconButton
      icon={loading ? faSpinner : faCheck}
      onClick={onClick}
      variant="success"
      size={size}
      tooltip={loading ? 'Saving...' : tooltip}
      disabled={disabled}
      loading={loading}
      stopPropagation={stopPropagation}
      className={className}
    />
  );
};

