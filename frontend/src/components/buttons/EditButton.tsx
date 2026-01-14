// components/buttons/EditButton.tsx
import React from 'react';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { IconButton, IconButtonSize } from '../base/IconButton';

interface EditButtonProps {
  onClick: (e: React.MouseEvent) => void;
  size?: IconButtonSize;
  tooltip?: string;
  disabled?: boolean;
  showOnHover?: boolean;
  parentHovered?: boolean;
  loading?: boolean;
  stopPropagation?: boolean;
  className?: string;
}

export const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  size = 'md',
  tooltip = 'Edit',
  disabled = false,
  showOnHover = false,
  parentHovered = false,
  loading = false,
  stopPropagation = false,
  className = ''
}) => {
  return (
    <IconButton
      icon={faPen}
      onClick={onClick}
      variant="warning"
      size={size}
      tooltip={tooltip}
      disabled={disabled}
      showOnHover={showOnHover}
      parentHovered={parentHovered}
      loading={loading}
      stopPropagation={stopPropagation}
      className={className}
    />
  );
};

