import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bg-second-surface text-text-dark-primary">
      {/* Figma container: 1280 width + 24px side padding */}
      <div className="container-figma py-8">
        {/* Responsive grid:
            - mobile: 1 column
            - tablet: 2 columns (breathes better)
            - desktop (lg+): exact Figma fixed columns + 16px gaps
        */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 lg:gap-4 lg:grid-cols-[minmax(0,608px)_192px_192px_192px]">
          {/* Brand */}
          <div className="flex flex-col items-start gap-2 md:col-span-2 lg:col-span-1">
            <img
              src="/roamstead-logo-light.svg"
              alt="Roamstead"
              className="block w-[240px] sm:w-[270px] md:w-[300px] h-auto md:-ml-2"
            />

            <p className="text-[16px] leading-[24px] font-medium tracking-[-0.32px] text-text-dark-primary">
              Roamstead Collective
            </p>

            <p className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary max-w-[520px]">
              Modern mountain hospitality for travelers who value community, adventure, and authentic experiences.
            </p>
          </div>

          {/* Properties */}
          <div className="self-stretch">
            <h4 className="text-[18px] leading-[28px] font-medium tracking-[-0.36px] text-text-dark-primary">
              Properties
            </h4>
            <ul className="mt-4 space-y-4">
              <li><a href="/properties/granary" className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary hover:text-text-dark-primary transition-colors">Granary</a></li>
              <li><a href="/properties/daystar" className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary hover:text-text-dark-primary transition-colors">Daystar</a></li>
              <li><a href="/properties/lowell" className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary hover:text-text-dark-primary transition-colors">The Lowell</a></li>
              <li><a href="/properties/hygge-house" className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary hover:text-text-dark-primary transition-colors">Hygge House</a></li>
              <li><a href="/properties/powder-room" className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary hover:text-text-dark-primary transition-colors">Powder Room</a></li>
              <li><a href="/properties/senator" className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary hover:text-text-dark-primary transition-colors">The Senator</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[18px] leading-[28px] font-medium tracking-[-0.36px] text-text-dark-primary">
              Company
            </h4>
            <ul className="mt-4 space-y-4">
              <li><a href="/about" className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary hover:text-text-dark-primary transition-colors">About</a></li>
              <li><a href="/mission" className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary hover:text-text-dark-primary transition-colors">Mission</a></li>
              <li><a href="/careers" className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary hover:text-text-dark-primary transition-colors">Careers</a></li>
              <li><a href="/ventures" className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary hover:text-text-dark-primary transition-colors">Roamstead Ventures</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[18px] leading-[28px] font-medium tracking-[-0.36px] text-text-dark-primary">
              Contact
            </h4>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="mailto:name@roamstead-co.com" className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  chirs@roamstead-co.com
                </a>
              </li>
              <li>
                <a href="tel:+15551234567" className="text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-secondary hover:text-text-dark-primary transition-colors">
                  (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 h-px w-full bg-border-subtle" />

        {/* Copyright */}
        <p className="mt-6 text-[16px] leading-[24px] font-normal tracking-[-0.32px] text-text-dark-muted">
          © Copyright Roamstead Collective 2026. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
