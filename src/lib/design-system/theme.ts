
import { designTokens } from './tokens';

// Theme configuration
export const theme = {
  light: {
    colors: {
      background: designTokens.colors.neutral[50],
      foreground: designTokens.colors.neutral[900],
      card: '#ffffff',
      cardForeground: designTokens.colors.neutral[900],
      popover: '#ffffff',
      popoverForeground: designTokens.colors.neutral[900],
      primary: designTokens.colors.primary[500],
      primaryForeground: '#ffffff',
      secondary: designTokens.colors.neutral[100],
      secondaryForeground: designTokens.colors.neutral[900],
      muted: designTokens.colors.neutral[100],
      mutedForeground: designTokens.colors.neutral[500],
      accent: designTokens.colors.neutral[100],
      accentForeground: designTokens.colors.neutral[900],
      destructive: designTokens.colors.error[500],
      destructiveForeground: '#ffffff',
      border: designTokens.colors.neutral[200],
      input: designTokens.colors.neutral[200],
      ring: designTokens.colors.primary[500],
    },
  },
  dark: {
    colors: {
      background: designTokens.colors.neutral[900],
      foreground: designTokens.colors.neutral[50],
      card: designTokens.colors.neutral[800],
      cardForeground: designTokens.colors.neutral[50],
      popover: designTokens.colors.neutral[800],
      popoverForeground: designTokens.colors.neutral[50],
      primary: designTokens.colors.primary[400],
      primaryForeground: designTokens.colors.neutral[900],
      secondary: designTokens.colors.neutral[800],
      secondaryForeground: designTokens.colors.neutral[50],
      muted: designTokens.colors.neutral[800],
      mutedForeground: designTokens.colors.neutral[400],
      accent: designTokens.colors.neutral[800],
      accentForeground: designTokens.colors.neutral[50],
      destructive: designTokens.colors.error[600],
      destructiveForeground: '#ffffff',
      border: designTokens.colors.neutral[700],
      input: designTokens.colors.neutral[700],
      ring: designTokens.colors.primary[400],
    },
  },
} as const;

export type Theme = typeof theme;
export type ThemeMode = keyof Theme;
