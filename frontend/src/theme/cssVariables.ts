/**
 * CSS Variables Injection
 * Injects color palette from colors.ts as CSS custom properties
 * This ensures colors.ts is the single source of truth
 */

import { palettes } from './colors';

/**
 * Injects all color palettes as CSS custom properties on :root
 * Call this once at app startup (in main.tsx)
 */
export function injectCSSVariables(): void {
  const root = document.documentElement;

  // Inject all palette colors as CSS variables
  Object.entries(palettes).forEach(([paletteName, shades]) => {
    Object.entries(shades).forEach(([shade, color]) => {
      root.style.setProperty(`--${paletteName}-${shade}`, color);
    });
  });
}
