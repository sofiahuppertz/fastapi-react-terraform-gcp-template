// components/buttons/DeleteButton.tsx
import React from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton, IconButtonSize } from '../base/IconButton';

interface DeleteButtonProps {
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

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  size = 'md',
  tooltip = 'Delete',
  disabled = false,
  showOnHover = false,
  parentHovered = false,
  loading = false,
  stopPropagation = false,
  className = ''
}) => {
  return (
    <IconButton
      icon={faTrash}
      onClick={onClick}
      variant="danger"
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

