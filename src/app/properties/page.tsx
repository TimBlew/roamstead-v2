import { TextHero } from "@/components/ui/TextHero";
import { FeaturedHomes } from "@/components/sections/FeaturedHomes";
import { CommunityCTA } from "@/components/sections/CommunityCTA";

export default function PropertiesPage() {
  return (
    <>
      <TextHero 
        title="A collection shaped by place"
        description="Roamstead is a growing collection of places to stay across Heber Valley and nearby mountain towns. Each one is different, but all are designed with the same belief: place comes first."
        tagline="These are homes meant to be lived into — not just staged."
      />
      <FeaturedHomes />
      <CommunityCTA />
    </>
  );
}