// components/buttons/ViewButton.tsx
import React from 'react';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { IconButton, IconButtonSize } from '../base/IconButton';

interface ViewButtonProps {
  onClick: (e: React.MouseEvent) => void;
  size?: IconButtonSize;
  tooltip?: string;
  disabled?: boolean;
  loading?: boolean;
  showOnHover?: boolean;
  parentHovered?: boolean;
  stopPropagation?: boolean;
  className?: string;
}

export const ViewButton: React.FC<ViewButtonProps> = ({
  onClick,
  size = 'md',
  tooltip = 'View details',
  disabled = false,
  loading = false,
  showOnHover = false,
  parentHovered = false,
  stopPropagation = false,
  className = ''
}) => {
  return (
    <IconButton
      icon={faEye}
      onClick={onClick}
      variant="secondary"
      size={size}
      tooltip={tooltip}
      disabled={disabled}
      showOnHover={showOnHover}
      parentHovered={parentHovered}
      stopPropagation={stopPropagation}
      className={className}
      loading={loading}
    />
  );
};

