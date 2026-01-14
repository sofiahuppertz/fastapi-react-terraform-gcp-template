import { palettes } from '@/theme/colors';

/**
 * Shared styling constants for list items (Resources and Molecules)
 */
export const LIST_ITEM_STYLES = {
  // Icon sizes
  iconSize: 'h-3 w-3',
  iconSizeSmall: 'h-3 w-3',
  avatarSize: 'w-14 h-14',

  // Colors
  iconColor: palettes.primary[0],
  borderColor: 'transparent',
  avatarBackground: palettes.primary[0] + '50',
  
  // Typography
  fontSize: 'text-base',
  fontWeight: 'font-medium',
  
  // Spacing
  iconMargin: 'mr-3',
  
  // Input styles
  inputClass: 'w-24 px-3 py-2 text-base font-bold border rounded-lg',
  
  // Button styles
  buttonSize: 'p-2 h-8 w-8',
  buttonClass: 'rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center relative z-10',
} as const;

/**
 * Get icon color style object
 */
export const getIconColorStyle = () => ({
  color: LIST_ITEM_STYLES.iconColor
});

