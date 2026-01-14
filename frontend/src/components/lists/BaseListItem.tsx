import React, { useState } from 'react';
import { palettes } from '@/theme/irisGarden';

interface BaseListItemProps {
  leftContent: React.ReactNode;
  middleContent: React.ReactNode;
  rightContent: React.ReactNode;
  toDelete?: boolean;
  // deleteHandler?: make delete handler here.
  isSelected?: boolean;
  isHighlighted?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onHoverChange?: (hovered: boolean) => void;
  onClick?: () => void;
}

const BaseListItem: React.FC<BaseListItemProps> = ({
  leftContent,
  middleContent,
  rightContent,
  toDelete = false,
  isSelected = false,
  isHighlighted = false,
  className = '',
  style = {},
  onHoverChange,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
  };

  // Determine base colors based on state
  const getBaseStyles = (): React.CSSProperties => {
    if (toDelete) {
      return {
        backgroundColor: palettes.danger.danger2 + '50',
        borderColor: palettes.danger.danger2 + '50',
      };
    }
    
    if (isHighlighted) {
      return {
        backgroundColor: palettes.lilac.lilac3 + '50',
        borderColor: palettes.lilac.lilac3,
      };
    }

    if (isSelected) {
      return {
        backgroundColor: palettes.sage.sage1 + '50',
        borderColor: palettes.sage.sage1,
      };
    }
    // Default state
    return {
      backgroundColor: palettes.grey.grey0 + '20',
      borderColor: palettes.grey.grey0 + '20',
    };
  };

  // Determine hover colors (only apply if not selected/highlighted)
  const getHoverStyles = (): React.CSSProperties => {
    if (toDelete || isHighlighted) {
      return {}; // Don't change on hover if already selected/highlighted
    }
    
    if (isHovered) {
      return {
        backgroundColor: palettes.lilac.lilac0 + '50',
        borderColor: palettes.lilac.lilac1,
      };
    }
    
    return {};
  };

  // Essential layout classes are always applied
  const essentialClasses = "flex items-center";
  // Default styling classes (used when no custom className is provided)
  const defaultStylingClasses = "p-1 rounded-full border mb-2 shadow-sm transition-all duration-200 hover:shadow-md";
  const finalClassName = className 
    ? `${essentialClasses} ${className}` 
    : `${essentialClasses} ${defaultStylingClasses}`;

  // Merge default styles with custom styles (custom takes precedence)
  const mergedStyle: React.CSSProperties = {
    minHeight: '64px',
    paddingRight: '16px',
    ...getBaseStyles(),
    ...getHoverStyles(),
    ...style, // Custom style overrides everything
  };

  return (
    <div 
      data-list-item
      className={finalClassName}
      style={{
        ...mergedStyle,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Left Section: Name, Icon/Image, Tags - Fixed width for alignment */}
      <div className="flex items-center justify-start" style={{ width: '520px', minWidth: '520px' }}>
        {leftContent}
      </div>

      {/* Middle Section: Quantities - Single Row, flex-grow */}
      <div className="flex-1 flex items-center justify-start gap-4">
        {middleContent}
      </div>

      {/* Right Section: Action Buttons - Always reserves space, Fixed width */}
      <div 
        className="flex items-center justify-end gap-2 transition-opacity duration-200"
        style={{ 
          opacity: isHovered ? 1 : 0,
          width: '120px',
          minWidth: '120px'
        }}
      >
        {rightContent}
      </div>
    </div>
  );
};

export default BaseListItem;

