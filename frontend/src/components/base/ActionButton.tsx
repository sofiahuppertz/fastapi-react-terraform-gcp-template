import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { palettes, colors } from '@/theme/colors';

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
        backgroundColor: colors.primary,
        color: 'white',
        borderColor: colors.primary
      },
      hover: {
        backgroundColor: palettes.primary[4],
        color: 'white',
        borderColor: palettes.primary[4]
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.primary,
        borderColor: colors.primary
      },
      outlineHover: {
        backgroundColor: colors.primary,
        color: 'white',
        borderColor: colors.primary
      }
    },
    secondary: {
      solid: {
        backgroundColor: colors.secondary,
        color: 'white',
        borderColor: colors.secondary
      },
      hover: {
        backgroundColor: palettes.secondary[4],
        color: 'white',
        borderColor: palettes.secondary[4]
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.secondary,
        borderColor: colors.secondary
      },
      outlineHover: {
        backgroundColor: colors.secondary,
        color: 'white',
        borderColor: colors.secondary
      }
    },
    danger: {
      solid: {
        backgroundColor: colors.danger,
        color: 'white',
        borderColor: colors.danger
      },
      hover: {
        backgroundColor: palettes.danger[4],
        color: 'white',
        borderColor: palettes.danger[4]
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.danger,
        borderColor: colors.danger
      },
      outlineHover: {
        backgroundColor: colors.danger,
        color: 'white',
        borderColor: colors.danger
      }
    },
    warning: {
      solid: {
        backgroundColor: colors.warning,
        color: 'white',
        borderColor: colors.warning
      },
      hover: {
        backgroundColor: palettes.warning[4],
        color: 'white',
        borderColor: palettes.warning[4]
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.warning,
        borderColor: colors.warning
      },
      outlineHover: {
        backgroundColor: colors.warning,
        color: 'white',
        borderColor: colors.warning
      }
    },
    success: {
      solid: {
        backgroundColor: colors.success,
        color: 'white',
        borderColor: colors.success
      },
      hover: {
        backgroundColor: palettes.success[4],
        color: 'white',
        borderColor: palettes.success[4]
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.success,
        borderColor: colors.success
      },
      outlineHover: {
        backgroundColor: colors.success,
        color: 'white',
        borderColor: colors.success
      }
    },
    ghost: {
      solid: {
        backgroundColor: palettes.neutral[0],
        color: palettes.neutral[4],
        borderColor: palettes.neutral[0]
      },
      hover: {
        backgroundColor: palettes.neutral[2],
        color: 'white',
        borderColor: palettes.neutral[2]
      },
      outline: {
        backgroundColor: 'transparent',
        color: palettes.neutral[3],
        borderColor: palettes.neutral[1] + '50'
      },
      outlineHover: {
        backgroundColor: palettes.neutral[0],
        color: palettes.neutral[5],
        borderColor: palettes.neutral[2]
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