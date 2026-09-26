import React from 'react';
import './styles.css';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, size = 'lg', className = '', ...props }, ref) => {
    const sizeClass = size !== 'lg' ? `ui-container-${size}` : '';

    return (
      <div
        ref={ref}
        className={`ui-container ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
