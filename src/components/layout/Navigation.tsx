'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-canvas border-b border-border-subtle">
      <div className="relative h-12 w-full">
        {/* Full width row with consistent edge padding */}
        <div className="h-12 w-full flex items-center pl-6 pr-0">
          {/* Logo (now truly near left edge) */}
          <a href="/" className="flex items-center">
            <img src="/roamstead-logo.svg" alt="Roamstead" className="h-5 w-auto" />
          </a>

          {/* Center links aligned to the hero grid */}
          <div className="hidden md:flex items-center gap-8 ml-auto mr-[220px]">
            <a href="/properties" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Properties
            </a>
            <a href="/about" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              About
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden ml-auto p-2 -mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* CTA pinned to viewport right */}
        <a
          href="/book"
          className="hidden md:flex absolute right-0 top-0 h-12 px-6 items-center justify-center text-sm font-medium bg-button-primary-bg text-button-primary-text hover:bg-button-primary-hover transition-colors"
        >
          Book Now
        </a>

      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-bg-canvas border-t border-border-subtle">
          <div className="px-6 py-4">
            <div className="flex flex-col gap-4">
              <a href="/properties" className="text-md text-text-secondary hover:text-text-primary transition-colors py-2">
                Properties
              </a>
              <a href="/about" className="text-md text-text-secondary hover:text-text-primary transition-colors py-2">
                About
              </a>
              <Button variant="primary" href="/book" className="w-full">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
