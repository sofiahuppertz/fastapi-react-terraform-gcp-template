// components/buttons/AddButton.tsx
import React from 'react';
import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconButton, IconButtonSize } from '../base/IconButton';

interface AddButtonProps {
  onClick: (e: React.MouseEvent) => void;
  size?: IconButtonSize;
  tooltip?: string;
  disabled?: boolean;
  loading?: boolean;
  stopPropagation?: boolean;
  className?: string;
}

export const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  size = 'md',
  tooltip = 'Add',
  disabled = false,
  loading = false,
  stopPropagation = false,
  className = ''
}) => {
  return (
    <IconButton
      icon={loading ? faSpinner : faPlus}
      onClick={onClick}
      variant="success"
      size={size}
      tooltip={loading ? 'Adding...' : tooltip}
      disabled={disabled}
      loading={loading}
      stopPropagation={stopPropagation}
      className={className}
    />
  );
};
