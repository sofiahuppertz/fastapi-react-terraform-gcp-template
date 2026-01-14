// components/base/buttons/IconButton.tsx
import React, { useState, CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { palettes, primary, semantic } from '@/theme/irisGarden';

export type IconButtonVariant = 
  | 'primary'     // Lilac
  | 'secondary'   // Sage
  | 'danger'      // Red
  | 'warning'     // Yellow/Orange
  | 'success'     // Green
  | 'ghost';      // Transparent

export type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps {
  icon: IconDefinition;
  onClick: (e: React.MouseEvent) => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  tooltip?: string;
  disabled?: boolean;
  showOnHover?: boolean;
  parentHovered?: boolean;
  loading?: boolean;
  className?: string;
  stopPropagation?: boolean;
}

const sizeClasses = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-11 h-11'
};

const iconSizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
};

const getVariantColors = (variant: IconButtonVariant) => {
  switch (variant) {
    case 'primary':
      return {
        default: {
          backgroundColor: palettes.lilac.lilac0,
          color: palettes.lilac.lilac2,
          borderColor: palettes.lilac.lilac0
        },
        hover: {
          backgroundColor: palettes.lilac.lilac2,
          color: 'white',
          borderColor: palettes.lilac.lilac2
        }
      };
    case 'secondary':
      return {
        default: {
          backgroundColor: palettes.sage.sage0,
          color: palettes.sage.sage3,
          borderColor: palettes.sage.sage0
        },
        hover: {
          backgroundColor: palettes.sage.sage3,
          color: 'white',
          borderColor: palettes.sage.sage3
        }
      };
    case 'danger':
      return {
        default: {
          backgroundColor: palettes.danger.danger0,
          color: palettes.danger.danger2,
          borderColor: palettes.danger.danger0
        },
        hover: {
          backgroundColor: palettes.danger.danger2,
          color: 'white',
          borderColor: palettes.danger.danger2
        }
      };
    case 'warning':
      return {
        default: {
          backgroundColor: palettes.warning.warning0,
          color: palettes.warning.warning2,
          borderColor: palettes.warning.warning0
        },
        hover: {
          backgroundColor: palettes.warning.warning2,
          color: 'white',
          borderColor: palettes.warning.warning2
        }
      };
    case 'success':
      return {
        default: {
          backgroundColor: palettes.success.success0,
          color: palettes.success.success3,
          borderColor: palettes.success.success0
        },
        hover: {
          backgroundColor: palettes.success.success2,
          color: 'white',
          borderColor: palettes.success.success2
        }
      };
    case 'ghost':
      return {
        default: {
          backgroundColor: 'transparent',
          color: palettes.lilac.lilac2,
          borderColor: 'transparent'
        },
        hover: {
          backgroundColor: palettes.lilac.lilac2,
          color: 'white',
          borderColor: palettes.lilac.lilac2
        }
      };
  }
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  tooltip,
  disabled = false,
  showOnHover = false,
  parentHovered = false,
  loading = false,
  className = '',
  stopPropagation = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = getVariantColors(variant);

  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    if (!disabled && !loading) {
      onClick(e);
    }
  };

  // When showOnHover is true, show button when parent is hovered
  const shouldShow = showOnHover ? parentHovered : true;

  const style: CSSProperties = {
    ...colors.default,
    opacity: disabled ? 0.5 : (shouldShow ? 1 : 0),
    pointerEvents: disabled ? 'none' : (shouldShow ? 'auto' : 'none'),
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease'
  };

  const hoverStyle: CSSProperties = isHovered && !disabled && !loading
    ? colors.hover
    : colors.default;

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      title={tooltip}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full border transition-all duration-200 hover:scale-105 disabled:hover:scale-100 ${className} shadow-sm`}
      style={{ ...style, ...hoverStyle }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading ? (
        <FontAwesomeIcon 
          icon={faSpinner}
          className={`${iconSizeClasses[size]} animate-spin`} 
        />
      ) : (
        <FontAwesomeIcon icon={icon} className={iconSizeClasses[size]} />
      )}
    </button>
  );
};