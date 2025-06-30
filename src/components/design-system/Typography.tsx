
import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// Heading Component
export const Heading: React.FC<TypographyProps & {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}> = ({ 
  children, 
  className, 
  level = 1,
  as
}) => {
  const Component = as || (`h${level}` as keyof JSX.IntrinsicElements);
  
  const levelClasses = {
    1: 'text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight',
    2: 'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight',
    3: 'text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight',
    4: 'text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight',
    5: 'text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight',
    6: 'text-base sm:text-lg lg:text-xl font-semibold tracking-tight',
  };

  return (
    <Component className={cn('text-white', levelClasses[level], className)}>
      {children}
    </Component>
  );
};

// Text Component
export const Text: React.FC<TypographyProps & {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'white';
}> = ({ 
  children, 
  className,
  as = 'p',
  size = 'base',
  weight = 'normal',
  color = 'white'
}) => {
  const Component = as;
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };
  
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };
  
  const colorClasses = {
    primary: 'text-blue-400',
    secondary: 'text-purple-400',
    muted: 'text-blue-200',
    white: 'text-white',
  };

  return (
    <Component className={cn(
      sizeClasses[size],
      weightClasses[weight],
      colorClasses[color],
      className
    )}>
      {children}
    </Component>
  );
};

// Code Component
export const Code: React.FC<TypographyProps> = ({ children, className, as = 'code' }) => {
  const Component = as;
  
  return (
    <Component className={cn(
      'relative rounded bg-white/10 px-2 py-1 font-mono text-sm text-blue-200',
      className
    )}>
      {children}
    </Component>
  );
};

// Link Component
export const Link: React.FC<TypographyProps & {
  href?: string;
  external?: boolean;
}> = ({ 
  children, 
  className, 
  as = 'a',
  href,
  external = false
}) => {
  const Component = as;
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  
  return (
    <Component 
      href={href}
      className={cn(
        'text-blue-300 underline-offset-4 hover:underline hover:text-white transition-colors',
        className
      )}
      {...externalProps}
    >
      {children}
    </Component>
  );
};
