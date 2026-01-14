// components/buttons/CancelButton.tsx
import React from 'react';
import { faTimes, faUndo } from '@fortawesome/free-solid-svg-icons';
import { IconButton, IconButtonSize } from '../base/IconButton';

interface CancelButtonProps {
  onClick: (e: React.MouseEvent) => void;
  size?: IconButtonSize;
  tooltip?: string;
  disabled?: boolean;
  variant?: 'times' | 'undo';
  stopPropagation?: boolean;
  className?: string;
}

export const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  size = 'md',
  tooltip = 'Cancel',
  disabled = false,
  variant = 'times',
  stopPropagation = false,
  className = ''
}) => {
  return (
    <IconButton
      icon={variant === 'times' ? faTimes : faUndo}
      onClick={onClick}
      variant="ghost"
      size={size}
      tooltip={tooltip}
      disabled={disabled}
      stopPropagation={stopPropagation}
      className={className}
    />
  );
};

