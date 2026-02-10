import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'default' | 'wide' | 'full';
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '',
  maxWidth = 'default'
}) => {
  const maxWidthStyles = {
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-2 md:px-3 lg:px-4 ${maxWidthStyles[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'canvas' | 'subtle' | 'surface' | 'second-surface';
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  className = '',
  background = 'canvas'
}) => {
  const backgroundStyles = {
    canvas: 'bg-bg-canvas',
    subtle: 'bg-bg-subtle',
    surface: 'bg-bg-surface',
    'second-surface': 'bg-bg-second-surface',
  };

  return (
    <section className={`py-8 ${backgroundStyles[background]} ${className}`}>
      {children}
    </section>
  );
};