import React from 'react';
import { Button } from './Button';

interface HeroProps {
  backgroundImage: string;
  headline: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

export const Hero: React.FC<HeroProps> = ({
  backgroundImage,
  headline,
  description,
  ctaText,
  ctaHref,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative w-full max-h-[600px] overflow-hidden">
        {/* Background Image - Constrained height, full width */}
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-auto block object-cover"
          style={{ maxHeight: '600px', objectFit: 'cover' }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content - Centered and positioned higher */}
        <div className="absolute inset-0 flex items-start justify-center pt-20">
          <div className="text-center max-w-xl mx-auto px-4">
            <h1 className="text-h2 font-heading font-medium text-text-dark-primary mb-4 leading-tight antialiased">
              {headline}
            </h1>
            <p className="text-md font-body font-normal text-text-dark-secondary mb-6 antialiased">
              {description}
            </p>
            <a 
              href={ctaHref}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium bg-white text-text-primary hover:bg-bg-subtle transition-colors"
            >
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};