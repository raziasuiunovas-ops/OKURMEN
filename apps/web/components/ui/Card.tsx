import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  variant?: 'default' | 'glass' | 'gradient';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hover = false, variant = 'default', className = '', ...props }, ref) => {
    const baseClasses = 'rounded-xl p-5 transition-all duration-300';
    
    const variantClasses = {
      default: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-sm',
      glass: 'card-glass',
      gradient: 'card-gradient',
    };
    
    const hoverClasses = hover 
      ? 'hover:-translate-y-1 hover:shadow-md cursor-pointer' 
      : '';

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

