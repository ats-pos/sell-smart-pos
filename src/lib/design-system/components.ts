
import { cva } from 'class-variance-authority';

// Component variants using design tokens
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 hover:shadow-lg active:scale-95 touch-manipulation',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg',
        destructive: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg',
        outline: 'border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/30',
        secondary: 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20',
        ghost: 'text-white hover:bg-white/10 hover:text-white',
        link: 'text-blue-300 underline-offset-4 hover:underline hover:text-white',
      },
      size: {
        default: 'h-10 px-4 py-2 min-h-[44px]',
        sm: 'h-9 rounded-lg px-3 min-h-[40px]',
        lg: 'h-11 rounded-xl px-8 min-h-[48px]',
        icon: 'h-10 w-10 min-h-[44px] min-w-[44px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const cardVariants = cva(
  'rounded-2xl border bg-card text-card-foreground shadow-lg backdrop-blur-sm transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-white/10 border-white/20 hover:shadow-xl hover:-translate-y-1',
        glass: 'bg-white/5 border-white/10 backdrop-blur-xl',
        solid: 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const inputVariants = cva(
  'flex w-full rounded-xl border px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 touch-manipulation min-h-[44px]',
  {
    variants: {
      variant: {
        default: 'border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/15 hover:border-white/30 focus-visible:bg-white/20 focus-visible:border-white/40',
        outline: 'border-gray-300 bg-white text-gray-900 focus-visible:border-blue-500',
        ghost: 'border-transparent bg-transparent text-white focus-visible:border-white/40',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
