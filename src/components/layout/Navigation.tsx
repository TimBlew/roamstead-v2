'use client';

import React from 'react';

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-canvas border-b border-border-subtle">
      {/* Full-bleed bar */}
      <div className="relative h-12 w-full">
        {/* Left + links live in a padded row */}
        <div className="h-12 w-full flex items-center pl-0 pr-0">
          {/* Logo */}
          <a href="/" className="flex items-center">
            {/* Mobile icon */}
            <img
              src="/favicon.svg"
              alt="Roamstead"
              className="h-6 w-auto md:hidden"
            />
            {/* Desktop full logo */}
            <img
              src="/roamstead-logo.svg"
              alt="Roamstead"
              className="hidden md:block h-5 w-auto"
            />
          </a>

          {/* Desktop links — sit just left of the button */}
          <div className="hidden md:flex items-center gap-4 ml-auto pr-[160px]">
            <a
              href="/properties"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Properties
            </a>
            <a
              href="/about"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              About
            </a>
          </div>
        </div>

        {/* Book Now pinned to viewport edge (no whitespace possible) */}
        <a
          href="/book"
          className="absolute right-0 top-0 h-12 px-4 flex items-center justify-center text-sm font-medium bg-button-primary-bg text-button-primary-text hover:bg-button-primary-hover transition-colors"
        >
          Book Now
        </a>
      </div>
    </nav>
  );
};
