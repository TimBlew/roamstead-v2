import React from 'react';

interface PropertyCardProps {
  image: string;
  location: string;
  name: string;
  sleeps?: number;
  bedrooms?: number;
  baths?: number;
  href: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  image,
  location,
  name,
  sleeps,
  bedrooms,
  baths,
  href,
}) => {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* Image - Rounded */}
      <div className="w-full h-56 overflow-hidden rounded-2">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs text-text-primary mb-1 uppercase tracking-wide">{location}</p>
        <h3 className="text-h3 font-heading font-medium mb-3" style={{ color: '#4a6e57' }}>{name}</h3>

        {/* Property Details */}
        {(sleeps || bedrooms || baths) && (
          <div className="text-sm text-text-muted mb-4 space-y-0.5">
            {sleeps && <p>Sleeps {sleeps}</p>}
            {bedrooms && <p>{bedrooms} Bedrooms</p>}
            {baths && <p>{baths} Baths</p>}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto">
          <a 
            href={href}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-white text-text-primary border border-border-default hover:bg-bg-canvas transition-colors"
          >
            Check availability
          </a>
        </div>
      </div>
    </div>
  );
};