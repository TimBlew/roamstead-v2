import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  href?: string;
  external?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  href,
  external = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex min-h-10 items-center justify-center rounded-2 px-4 py-2 font-body text-sm font-medium tracking-body transition-all duration-200 cursor-pointer no-underline";

  const variantStyles = {
    primary:
      "bg-button-primary-bg text-button-primary-text hover:bg-button-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-default",
    secondary:
      "border border-border-default bg-bg-canvas text-button-secondary-text hover:bg-bg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-default",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={combinedClassName} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
        {children}
      </a>
    );
  }

  return <button className={combinedClassName} {...props}>{children}</button>;
};
