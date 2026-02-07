import React from 'react';
import { Container } from './Container';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bg-second-surface text-text-dark-primary py-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="mb-4">
              <img 
                src="/roamstead-logo-light.svg" 
                alt="Roamstead" 
                className="h-8 w-auto mb-2"
              />
            </div>
            <p className="text-md text-text-dark-secondary mb-2 font-bold">
              Roamstead Collective
            </p>
            <p className="text-sm text-text-dark-muted max-w-xs">
              Modern mountain hospitality for travelers who value community, adventure, and authentic experiences.
            </p>
          </div>

          {/* Properties */}
          <div>
            <h4 className="text-lg font-bold mb-4">Properties</h4>
            <ul className="space-y-2">
              <li>
                <a href="/properties/granary" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  Granary
                </a>
              </li>
              <li>
                <a href="/properties/daystar" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  Daystar
                </a>
              </li>
              <li>
                <a href="/properties/lowell" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  The Lowell
                </a>
              </li>
              <li>
                <a href="/properties/hygge-house" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  Hygge House
                </a>
              </li>
              <li>
                <a href="/properties/powder-room" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  Powder Room
                </a>
              </li>
              <li>
                <a href="/properties/senator" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  The Senator
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/mission" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  Mission
                </a>
              </li>
              <li>
                <a href="/careers" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="/ventures" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  Roamstead Ventures
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:name@roamstead-co.com" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  name@roamstead-co.com
                </a>
              </li>
              <li>
                <a href="tel:+15551234567" className="text-sm text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-text-dark-disabled/20 pt-6">
          <p className="text-xs text-text-dark-muted">
            © Copyright Roamstead Collective 2026. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};
