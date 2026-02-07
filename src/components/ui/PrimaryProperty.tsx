import React from 'react';

interface PrimaryPropertyProps {
  image: string;
  location: string;
  name: string;
  description: string;
  badge?: string;
  href: string;
}

export const PrimaryProperty: React.FC<PrimaryPropertyProps> = ({
  image,
  location,
  name,
  description,
  badge,
  href,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-0 bg-white overflow-hidden max-h-[380px]">
      {/* Main Image - Rounded, fills space */}
      <div className="overflow-hidden rounded-2">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content Section - More Compact */}
      <div className="p-6 flex flex-col justify-end bg-bg-subtle">
        <p className="text-xs text-text-primary mb-1.5 uppercase tracking-wide">{location}</p>
        <h2 className="text-h3 font-heading font-medium text-text-primary mb-2.5">{name}</h2>
        <p className="text-sm text-text-secondary mb-4 leading-relaxed">{description}</p>

        {/* Badge - Plain text, not button-like */}
        {badge && (
          <p className="text-sm text-text-primary mb-4 font-medium">
            {badge}
          </p>
        )}

        {/* CTA */}
        <div>
          <a 
            href={href}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium bg-button-primary-bg text-white hover:bg-button-primary-hover transition-colors"
          >
            Check availability
          </a>
        </div>
      </div>
    </div>
  );
};