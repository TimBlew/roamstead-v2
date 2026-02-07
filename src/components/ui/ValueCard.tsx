import React from 'react';

interface ValueCardProps {
  image: string;
  title: string;
  description: string;
}

export const ValueCard: React.FC<ValueCardProps> = ({
  image,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col">
      {/* Image - Taller */}
      <div className="mb-3 overflow-hidden rounded-3">
        <img
          src={image}
          alt={title}
          className="w-full h-72 object-cover"
        />
      </div>

      {/* Content */}
      <div>
        <h3 className="text-h4 font-heading font-medium text-text-primary mb-2">
          {title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};