import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { text } from '@/theme/irisGarden';
import { LIST_ITEM_STYLES, getIconColorStyle } from './listItemStyles';

interface QuantityDisplayProps {
  icon: IconDefinition;
  value: string | number;
  iconColor?: string;
  valueColor?: string;
  badge?: React.ReactNode;
  className?: string;
  minWidth?: string;
}

/**
 * Reusable component to display a quantity with an icon
 */
export const QuantityDisplay: React.FC<QuantityDisplayProps> = ({
  icon,
  value,
  iconColor,
  valueColor = text.primary,
  badge,
  className = '',
  minWidth = '120px'
}) => {
  return (
    <div className={`flex items-center justify-start ${className}`} style={{ minWidth }}>
      <FontAwesomeIcon 
        icon={icon} 
        className={`${LIST_ITEM_STYLES.iconSize} ${LIST_ITEM_STYLES.iconMargin}`}
        style={iconColor ? { color: iconColor } : getIconColorStyle()}
      />
      <span 
        className={`${LIST_ITEM_STYLES.fontSize} ${LIST_ITEM_STYLES.fontWeight}`}
        style={{ color: valueColor }}
      >
        {value}
      </span>
      {badge && <span className="ml-2">{badge}</span>}
    </div>
  );
};

