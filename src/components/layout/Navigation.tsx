'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-canvas backdrop-blur-sm border-b border-border-subtle">
      <div className="max-w-[7xl] mx-auto px-0">
        <div className="flex items-center justify-between h-12 px-2 md:px-3 lg:px-4">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img 
              src="/roamstead-logo.svg" 
              alt="Roamstead" 
              className="h-5 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/properties" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Properties
            </a>
            <a href="/about" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              About
            </a>
            <a 
              href="/book"
              className="inline-flex items-center justify-center px-4 h-12 -my-3 text-sm font-medium bg-button-primary-bg text-button-primary-text hover:bg-button-primary-hover transition-colors"
            >
              Book Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-text-primary"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-subtle px-2 md:px-3 lg:px-4">
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
        )}
      </div>
    </nav>
  );
};