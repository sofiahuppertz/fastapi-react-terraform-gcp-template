import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { injectCSSVariables } from './theme/cssVariables';

// Inject CSS variables from colors.ts (single source of truth)
injectCSSVariables();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
