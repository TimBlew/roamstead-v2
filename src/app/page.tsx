import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedHomes } from "@/components/sections/FeaturedHomes";
import { ValueStatement } from "@/components/sections/ValueStatement";
import { ValueCards } from "@/components/sections/ValueCards";
import { CommunityCTA } from "@/components/sections/CommunityCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedHomes />
      <ValueStatement />
      <ValueCards />
      <CommunityCTA />
    </>
  );
}
