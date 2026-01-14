import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { LIST_ITEM_STYLES } from './listItemStyles';

interface ItemAvatarProps {
  imageUrl?: string | null;
  icon?: IconDefinition;
  initial?: string;
  altText?: string;
}

/**
 * Reusable avatar component for list items (shows image, icon, or initial)
 */
export const ItemAvatar: React.FC<ItemAvatarProps> = ({
  imageUrl,
  icon,
  initial,
  altText = ''
}) => {
  return (
    <div 
      className={`${LIST_ITEM_STYLES.avatarSize} rounded-full border ${LIST_ITEM_STYLES.iconMargin} flex items-center overflow-hidden flex-shrink-0`}
      style={{ 
        borderColor: LIST_ITEM_STYLES.borderColor,
        backgroundColor: LIST_ITEM_STYLES.avatarBackground
      }}
    >
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={altText} 
          className="w-full h-full object-cover"
        />
      ) : icon ? (
        <FontAwesomeIcon 
          icon={icon} 
          className="h-5 w-5 mx-auto" 
          style={{ color: LIST_ITEM_STYLES.iconColor }}
        />
      ) : (
        <span 
          className="text-sm font-semibold mx-auto"
          style={{ color: LIST_ITEM_STYLES.iconColor }}
        >
          {initial || '?'}
        </span>
      )}
    </div>
  );
};

