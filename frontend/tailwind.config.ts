import type { Config } from 'tailwindcss';
import { palettes } from './src/theme/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Import all palettes from colors.ts (single source of truth)
        primary: palettes.primary,
        secondary: palettes.secondary,
        neutral: palettes.neutral,
        danger: palettes.danger,
        success: palettes.success,
        warning: palettes.warning,
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        editorial: ['Spectral', 'Georgia', 'serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
