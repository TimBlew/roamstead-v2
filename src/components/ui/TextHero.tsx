import React from 'react';

interface TextHeroProps {
  title: string;
  description: string;
  tagline?: string;
}

export const TextHero: React.FC<TextHeroProps> = ({
  title,
  description,
  tagline,
}) => {
  return (
    <section className="bg-bg-canvas py-16">
      <div className="max-w-[640px] mx-auto px-6 text-center">
        <h1 className="text-h1 font-heading font-medium text-text-primary mb-6">
          {title}
        </h1>
        <p className="text-md text-text-secondary leading-relaxed mb-4">
          {description}
        </p>
        {tagline && (
          <p className="text-sm text-text-muted italic">
            {tagline}
          </p>
        )}
      </div>
    </section>
  );
};