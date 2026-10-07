import React from "react";
import { Hero } from "../ui/Hero";

export const HeroSection: React.FC = () => {
  return (
    <Hero
      backgroundImage="/images/hero-mountain-optimized.jpg"
      headline="Modern mountain hospitality"
      description="Thoughtful homes across Heber Valley and Park City, made for ski weekends, slow mornings, long stays, and the kind of trips you want to repeat."
      ctaText="Find your stay"
      ctaHref="/properties"
    />
  );
};
