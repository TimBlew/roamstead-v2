import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  href,
  className = '',
  style = {},
  ...props 
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    px-6 py-3
    font-body font-medium
    text-md
    transition-colors duration-200
    cursor-pointer
    no-underline
  `;

  const variantStyles = {
    primary: `
      hover:opacity-90
      active:opacity-80
    `,
    secondary: `
      border-2
      hover:opacity-90
    `,
  };

  // Use button-specific color tokens
  const primaryStyle = variant === 'primary' ? {
    backgroundColor: 'var(--color-button-primary-bg)',
    color: 'var(--color-button-primary-text)',
    borderRadius: '6px', // Slightly rounded, not too much
    ...style
  } : {
    backgroundColor: 'var(--color-button-secondary-bg)',
    color: 'var(--color-button-secondary-text)',
    borderColor: 'var(--color-border-strong)',
    borderRadius: '6px',
    ...style
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={combinedClassName} style={primaryStyle}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} style={primaryStyle} {...props}>
      {children}
    </button>
  );
};
