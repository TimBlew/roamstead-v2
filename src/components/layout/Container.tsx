import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'default' | 'wide' | 'full' | 'figma';
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '',
  maxWidth = 'default'
}) => {
  const maxWidthStyles = {
    // Keep existing behavior (so nothing else breaks)
    default: 'max-w-7xl px-2 md:px-3 lg:px-4',
    wide: 'max-w-[1400px] px-2 md:px-3 lg:px-4',
    full: 'max-w-full px-2 md:px-3 lg:px-4',

    // New: Figma-locked container (1280 width + 24px padding)
    figma: 'max-w-[1280px] px-6',
  };

  return (
    <div className={`mx-auto ${maxWidthStyles[maxWidth]} ${className}`}>
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

  // KEEP your current behavior here too (so nothing else changes)
  return (
    <section className={`py-8 ${backgroundStyles[background]} ${className}`}>
      {children}
    </section>
  );
};
