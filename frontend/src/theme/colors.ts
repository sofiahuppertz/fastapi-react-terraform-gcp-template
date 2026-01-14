/**
 * Blue Teal Color Palette
 * A modern palette combining blues, teals, and grays for a professional look
 */

// Full color palettes for detailed styling
export const palettes = {
  // Primary blue palette
  primary: {
    0: '#E4F3FF',
    1: '#90D5FF',
    2: '#00B2EB',
    3: '#008AB7',
    4: '#006486',
    5: '#004158',
    6: '#00202E',
  },
  // Secondary teal palette
  secondary: {
    0: '#E9F2F9',
    1: '#B6D5EC',
    2: '#77B1D4',
    3: '#5C8AA6',
    4: '#42657A',
    5: '#2A4251',
    6: '#14222B',
  },
  // Neutral grey palette
  neutral: {
    0: '#F0F1F1',
    1: '#CACDCF',
    2: '#A2A6A9',
    3: '#7E8183',
    4: '#5B5D5F',
    5: '#3A3C3D',
    6: '#1C1D1E',
  },
  // Status colors
  danger: {
    0: '#FFE6E6',
    1: '#FF9999',
    2: '#FF4D4D',
    3: '#E60000',
    4: '#B30000',
    5: '#800000',
    6: '#4D0000',
  },
  success: {
    0: '#E6F7E6',
    1: '#99E699',
    2: '#4DD94D',
    3: '#00CC00',
    4: '#009900',
    5: '#006600',
    6: '#003300',
  },
  warning: {
    0: '#FFF2E6',
    1: '#FFCC99',
    2: '#FF994D',
    3: '#FF6600',
    4: '#CC5200',
    5: '#993D00',
    6: '#662900',
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