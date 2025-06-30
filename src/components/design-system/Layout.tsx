
import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface ContainerProps extends LayoutProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

interface StackProps extends LayoutProps {
  direction?: 'row' | 'column';
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

interface GridProps extends LayoutProps {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  responsive?: boolean;
}

// Container Component
export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className, 
  size = 'lg' 
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </div>
  );
};

// Stack Component (Flexbox)
export const Stack: React.FC<StackProps> = ({
  children,
  className,
  direction = 'column',
  gap = 4,
  align = 'stretch',
  justify = 'start',
}) => {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';
  const gapClass = `gap-${gap}`;
  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }[align];
  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }[justify];

  return (
    <div className={cn('flex', directionClass, gapClass, alignClass, justifyClass, className)}>
      {children}
    </div>
  );
};

// Grid Component
export const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = 1,
  gap = 4,
  responsive = true,
}) => {
  const colsClass = `grid-cols-${cols}`;
  const gapClass = `gap-${gap}`;
  const responsiveClass = responsive ? 'sm:grid-cols-2 lg:grid-cols-3' : '';

  return (
    <div className={cn('grid', colsClass, gapClass, responsiveClass, className)}>
      {children}
    </div>
  );
};

// Section Component
export const Section: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <section className={cn('py-12 sm:py-16 lg:py-20', className)}>
      {children}
    </section>
  );
};
