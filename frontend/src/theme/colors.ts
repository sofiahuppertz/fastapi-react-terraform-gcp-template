/**
 * Pink & Teal Color Palette
 * A vibrant palette with pink, teal, and natural tones
 */

// Full color palettes for detailed styling
export const palettes = {
  // Primary pink palette
  primary: {
      0: '#D7F9E6',
      1: '#92E4BA',
      2: '#78BA97',
      3: '#5B9176',
      4: '#428B56',
      5: '#2A4738',
      6: '#14251C',
  },
  // Secondary teal palette
  secondary: {
      0: '#FAEEF0',
      1: '#EFC5CF',
      2: '#E491A8',
      3: '#DB537E',
      4: '#A23B5C',
      5: '#6C253C',
      6: '#3B101E',
  },

  // Neutral gray palette
  neutral: {
    0: '#F1F0F1',
    1: '#D2CFCF',
    2: '#AEA7A8',
    3: '#8C8082',
    4: '#675D5F',
    5: '#433D3D',
    6: '#221E1F',
  },
  // Status colors - danger (pink-based)
  danger: {
    0: '#FDD0D0', // Lightest danger (backgrounds, subtle alerts)
    1: '#FB9899',
    2: '#FA5053',
    3: '#D0161E', // Classic danger red (errors, main alerts)
    4: '#910C11',
    5: '#560406',
    6:'#2C0102',
  },
  // Status colors - success (green)
  success: {
    0: '#D5FADF', // Lightest success (success backgrounds, highlights)
    1: '#80DC9D',
    2: '#66B27E',
    3: '#4E8960', // Main success green (icons, text, alerts)
    4: '#366344',
    5: '#213F2A',
    6: '#0D1E12',
  },
  // Status colors - warning (mauve)
  warning: {
    0: '#FEEEDB', // Lightest warning (backgrounds, subtle highlights)
    1: '#FECD7A',
    2: '#DAA520', // Standard warning yellow (alerts, icons)
    3: '#AB8117',
    4: '#7F5F0E',
    5: '#553E06',
    6: '#2F2102',
  },
} as const;

// Primary colors (shade 3 - main brand colors)
export const colors = {
  primary: palettes.primary[3],
  secondary: palettes.secondary[3],
  danger: palettes.danger[3],
  success: palettes.success[3],
  warning: palettes.warning[3],
} as const;

// Text colors
export const text = {
  primary: palettes.neutral[6],
  secondary: palettes.neutral[5],
  subtle: palettes.neutral[3],
  inverse: '#FFFFFF',
} as const;

// Background colors (lightest shades)
export const background = {
  primary: palettes.primary[0],
  secondary: palettes.secondary[0],
  neutral: palettes.neutral[0],
  page: '#FFFFFF',
} as const;

// Border colors (light shades)
export const border = {
  primary: palettes.primary[1],
  secondary: palettes.secondary[1],
  neutral: palettes.neutral[1],
} as const;