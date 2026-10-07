import React from 'react';

const links = [
  { label: 'Locations', href: '/properties' },
  { label: 'About', href: '/about' },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-12 flex items-stretch bg-bg-surface border-b border-border-default">
      {/* Logo */}
      <a href="/" className="flex flex-1 items-center px-2">
        {/* Mobile icon */}
        <img src="/favicon.svg" alt="Roamstead" className="h-6 w-auto md:hidden" />
        {/* Desktop inline logo */}
        <img src="/roamstead-logo.svg" alt="Roamstead" className="hidden md:block h-6 w-auto" />
      </a>

      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="flex items-center px-2 text-md font-medium tracking-body text-brand-default hover:text-brand-hover transition-colors"
        >
          {link.label}
        </a>
      ))}

      <a
        href="/properties"
        className="flex items-center px-3 text-md font-medium tracking-body bg-button-primary-bg text-button-primary-text hover:bg-button-primary-hover transition-colors"
      >
        Book Direct
      </a>
    </nav>
  );
};
