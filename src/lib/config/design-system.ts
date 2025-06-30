
import { designTokens } from '@/lib/design-system';

// Design system configuration
export const designSystemConfig = {
  // Component defaults
  components: {
    button: {
      defaultSize: 'default' as const,
      defaultVariant: 'default' as const,
    },
    input: {
      defaultVariant: 'default' as const,
    },
    card: {
      defaultVariant: 'default' as const,
      defaultSize: 'default' as const,
    },
  },
  
  // Animation settings
  animations: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // Responsive breakpoints
  breakpoints: designTokens.breakpoints,
  
  // Accessibility settings
  a11y: {
    minTouchTarget: 44, // minimum touch target size in pixels
    focusRingWidth: 2,
    animationDuration: designTokens.zIndex,
  },
} as const;

export type DesignSystemConfig = typeof designSystemConfig;
