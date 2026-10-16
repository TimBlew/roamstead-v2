import copy from "@/data/admin-copy.json";
import React from "react";
import { Hero } from "../ui/Hero";

export const HeroSection: React.FC = () => {
  return (
    <Hero
      backgroundImage="/images/hero-mountain-optimized.jpg"
      headline={copy.homepage.headline.join(" ")}
      headlineLines={copy.homepage.headline}
      description={copy.homepage.description.join(" ")}
      descriptionLines={copy.homepage.description}
      mobileSupplement=""
      ctaText="Book direct"
      ctaHref="/book"
    />
  );
};
