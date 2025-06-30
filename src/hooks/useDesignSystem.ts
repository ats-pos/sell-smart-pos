
import { useCallback } from 'react';
import { designTokens, getColorValue, getSpacingValue } from '@/lib/design-system';
import { designSystemConfig } from '@/lib/config/design-system';

// Hook for accessing design system utilities
export const useDesignSystem = () => {
  const getToken = useCallback((path: string) => {
    const keys = path.split('.');
    let value: any = designTokens;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value;
  }, []);

  const getColor = useCallback((path: string) => {
    return getColorValue(path);
  }, []);

  const getSpacing = useCallback((key: keyof typeof designTokens.spacing) => {
    return getSpacingValue(key);
  }, []);

  const getBreakpoint = useCallback((key: keyof typeof designTokens.breakpoints) => {
    return designTokens.breakpoints[key];
  }, []);

  return {
    tokens: designTokens,
    config: designSystemConfig,
    getToken,
    getColor,
    getSpacing,
    getBreakpoint,
  };
};
