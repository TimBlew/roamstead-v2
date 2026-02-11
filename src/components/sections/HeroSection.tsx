import React from 'react';
import { Hero } from '../ui/Hero';

export const HeroSection: React.FC = () => {
  return (
    <Hero
      backgroundImage="/images/hero-mountain-optimized.jpg"
      headline="Modern mountain hospitality"
      description="Roamstead is a growing collection of places to stay in Heber Valley and the surrounding mountains. Each one is shaped by its setting and designed for the way people actually live while traveling."
      ctaText="Book your stay"
      ctaHref="/properties"
    />
  );
};