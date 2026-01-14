import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { palettes, primary, semantic } from '@/theme/irisGarden';

export type ActionButtonVariant = 
  | 'primary'     // Main action (Lilac)
  | 'secondary'   // Alternative action (Sage)
  | 'danger'      // Destructive action (Red)
  | 'warning'     // Caution action (Yellow/Orange)
  | 'success'     // Positive action (Green)
  | 'ghost'       // Minimal/tertiary action
  | 'outline';    // Outlined version

export type ActionButtonSize = 'sm' | 'md' | 'lg';

interface ActionButtonProps {
  children: React.ReactNode; // Button text
  onClick: (e: React.MouseEvent) => void;
  icon?: IconDefinition; // Optional icon
  iconPosition?: 'left' | 'right';
  variant?: ActionButtonVariant;
  size?: ActionButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  outline?: boolean; // Use outlined style (transparent bg with border)
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

const iconSizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
};

const getVariantColors = (variant: ActionButtonVariant, useOutline: boolean) => {
  const configs = {
    primary: {
      solid: {
        backgroundColor: primary.lilac,
        color: 'white',
        borderColor: primary.lilac
      },
      hover: {
        backgroundColor: palettes.lilac.lilac3,
        color: 'white',
        borderColor: palettes.lilac.lilac3
      },
      outline: {
        backgroundColor: 'transparent',
        color: primary.lilac,
        borderColor: primary.lilac
      },
      outlineHover: {
        backgroundColor: primary.lilac,
        color: 'white',
        borderColor: primary.lilac
      }
    },
    secondary: {
      solid: {
        backgroundColor: primary.sage,
        color: 'white',
        borderColor: primary.sage
      },
      hover: {
        backgroundColor: palettes.sage.sage3,
        color: 'white',
        borderColor: palettes.sage.sage3
      },
      outline: {
        backgroundColor: 'transparent',
        color: primary.sage,
        borderColor: primary.sage
      },
      outlineHover: {
        backgroundColor: primary.sage,
        color: 'white',
        borderColor: primary.sage
      }
    },
    danger: {
      solid: {
        backgroundColor: semantic.danger,
        color: 'white',
        borderColor: semantic.danger
      },
      hover: {
        backgroundColor: palettes.danger.danger3,
        color: 'white',
        borderColor: palettes.danger.danger3
      },
      outline: {
        backgroundColor: 'transparent',
        color: semantic.danger,
        borderColor: semantic.danger
      },
      outlineHover: {
        backgroundColor: semantic.danger,
        color: 'white',
        borderColor: semantic.danger
      }
    },
    warning: {
      solid: {
        backgroundColor: palettes.warning.warning3,
        color: 'white',
        borderColor: palettes.warning.warning3
      },
      hover: {
        backgroundColor: palettes.warning.warning4,
        color: 'white',
        borderColor: palettes.warning.warning4
      },
      outline: {
        backgroundColor: 'transparent',
        color: palettes.warning.warning3,
        borderColor: palettes.warning.warning3
      },
      outlineHover: {
        backgroundColor: palettes.warning.warning3,
        color: 'white',
        borderColor: palettes.warning.warning3
      }
    },
    success: {
      solid: {
        backgroundColor: palettes.success.success3,
        color: 'white',
        borderColor: palettes.success.success3
      },
      hover: {
        backgroundColor: palettes.success.success3,
        color: 'white',
        borderColor: palettes.success.success3
      },
      outline: {
        backgroundColor: 'transparent',
        color: palettes.success.success3,
        borderColor: palettes.success.success3
      },
      outlineHover: {
        backgroundColor: palettes.success.success3,
        color: 'white',
        borderColor: palettes.success.success3
      }
    },
    ghost: {
      solid: {
        backgroundColor: palettes.lilac.lilac0,
        color: palettes.lilac.lilac3,
        borderColor: palettes.lilac.lilac0
      },
      hover: {
        backgroundColor: palettes.lilac.lilac2,
        color: 'white',
        borderColor: palettes.lilac.lilac2
      },
      outline: {
        backgroundColor: 'transparent',
        color: palettes.lilac.lilac1,
        borderColor: palettes.lilac.lilac1 + '50'
      },
      outlineHover: {
        backgroundColor: palettes.lilac.lilac0,
        color: palettes.lilac.lilac3,
        borderColor: palettes.lilac.lilac2
      }
    }
  };

  // If variant is 'outline', use ghost config but with outline styling
  // Otherwise use the specified variant config
  const actualVariant = variant === 'outline' ? 'ghost' : variant;
  const config = configs[actualVariant] || configs.primary;
  
  // Use outline styles if outline prop is true OR variant is 'outline'
  const shouldUseOutline = useOutline || variant === 'outline';
  
  return {
    default: shouldUseOutline ? config.outline : config.solid,
    hover: shouldUseOutline ? config.outlineHover : config.hover
  };
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  icon,
  iconPosition = 'left',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  outline = false,
  className = '',
  type = 'button'
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const colors = getVariantColors(variant, outline);

  const handleClick = (e: React.MouseEvent) => {
    if (!disabled && !loading) {
      onClick(e);
    }
  };

  const style = {
    ...(isHovered && !disabled && !loading ? colors.hover : colors.default),
    opacity: disabled ? 0.5 : 1,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease'
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        inline-flex items-center justify-center gap-2
        rounded-full border font-body
        transition-all duration-200 
        hover:scale-105 
        disabled:hover:scale-100
        shadow-sm
        ${className}
      `.trim()}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading ? (
        <>
          <FontAwesomeIcon 
            icon={icon!} 
            className={`${iconSizeClasses[size]} animate-spin`} 
          />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <FontAwesomeIcon icon={icon} className={iconSizeClasses[size]} />
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <FontAwesomeIcon icon={icon} className={iconSizeClasses[size]} />
          )}
        </>
      )}
    </button>
  );
};