import React from 'react';
import './styles.css';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', className = '', children, ...props },
    ref
  ) => {
    const variantClass = variant === 'outline' ? 'ui-btn-outline' : 'ui-btn-primary';
    const sizeClass = `ui-btn-${size}`;

    return (
      <button
        ref={ref}
        className={`ui-btn ${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
