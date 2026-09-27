import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  variant?: 'default' | 'glass' | 'gradient';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hover = false, variant = 'default', className = '', ...props }, ref) => {
    const baseClasses = 'rounded-2xl p-6 transition-all duration-300';
    
    const variantClasses = {
      default: 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-soft',
      glass: 'card-glass',
      gradient: 'card-gradient',
    };
    
    const hoverClasses = hover 
      ? 'hover:-translate-y-2 hover:shadow-lg cursor-pointer' 
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

