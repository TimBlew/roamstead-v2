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
      {/* Image */}
      <div className="mb-4 overflow-hidden rounded-3">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Content */}
      <div>
        <h3 className="text-h4 text-text-primary mb-2">
          {title}
        </h3>
        <p className="text-md text-text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
};
