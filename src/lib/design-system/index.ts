
// Design System Exports
export { designTokens } from './tokens';
export { theme } from './theme';
export { buttonVariants, cardVariants, inputVariants } from './components';
export type { DesignTokens } from './tokens';
export type { Theme, ThemeMode } from './theme';

// Utility functions for design system
export const getColorValue = (path: string) => {
  const keys = path.split('.');
  let value: any = designTokens.colors;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value;
};

export const getSpacingValue = (key: keyof typeof designTokens.spacing) => {
  return designTokens.spacing[key];
};

export const getFontSize = (key: keyof typeof designTokens.typography.fontSize) => {
  return designTokens.typography.fontSize[key];
};
