import { HeroSection } from "@/components/sections/HeroSection";
import { ValueStatement } from "@/components/sections/ValueStatement";
import { ValueCards } from "@/components/sections/ValueCards";
import { FeaturedHomes } from "@/components/sections/FeaturedHomes";
import { SenatorBand } from '@/components/sections/SenatorBand';
import { CommunityCTA } from "@/components/sections/CommunityCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ValueStatement />
      <ValueCards />
      <FeaturedHomes />
      <SenatorBand campaign='senator-band' />
      <CommunityCTA />
    </>
  );
}
