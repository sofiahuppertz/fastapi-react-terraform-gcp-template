// components/buttons/ExpandButton.tsx
import React from 'react';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { IconButton, IconButtonSize } from '../base/IconButton';

interface ExpandButtonProps {
  onClick: (e: React.MouseEvent) => void;
  size?: IconButtonSize;
  tooltip?: string;
  disabled?: boolean;
  showOnHover?: boolean;
  parentHovered?: boolean;
  stopPropagation?: boolean;
  className?: string;
}

export const ExpandButton: React.FC<ExpandButtonProps> = ({
  onClick,
  size = 'md',
  tooltip = 'Expand',
  disabled = false,
  showOnHover = false,
  parentHovered = false,
  stopPropagation = false,
  className = ''
}) => {
  return (
    <IconButton
      icon={faUpRightAndDownLeftFromCenter}
      onClick={onClick}
      variant="primary"
      size={size}
      tooltip={tooltip}
      disabled={disabled}
      showOnHover={showOnHover}
      parentHovered={parentHovered}
      stopPropagation={stopPropagation}
      className={className}
    />
  );
};

