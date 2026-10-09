import React from "react";
import { Hero } from "../ui/Hero";

export const HeroSection: React.FC = () => {
  return (
    <Hero
      backgroundImage="/images/hero-mountain-optimized.jpg"
      headline="Come up tired. Go home lighter."
      description="Roamstead Collective is a small group of homes across Utah's Wasatch Back, rooted in Heber Valley. Pick your base. The mountains do the rest."
      mobileSupplement=""
      ctaText="Book direct"
      ctaHref="/book"
    />
  );
};
