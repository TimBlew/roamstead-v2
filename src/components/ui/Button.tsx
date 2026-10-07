import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  href?: string;
  external?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  href,
  external = false,
  className = '',
  ...props
}) => {
  // Figma button: 16px x 8px padding, p-md-bold, square corners
  const baseStyles =
    'inline-flex items-center justify-center px-2 py-1 font-body font-medium text-md tracking-body transition-colors duration-200 cursor-pointer no-underline';

  const variantStyles = {
    primary: 'bg-button-primary-bg text-button-primary-text hover:bg-button-primary-hover',
    secondary: 'bg-bg-canvas text-button-secondary-text border border-border-strong hover:bg-bg-subtle',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
