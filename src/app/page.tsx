import { HeroSection } from "@/components/sections/HeroSection";
import { ValueStatement } from "@/components/sections/ValueStatement";
import { ValueCards } from "@/components/sections/ValueCards";
import { FeaturedHomes } from "@/components/sections/FeaturedHomes";
import { CommunityCTA } from "@/components/sections/CommunityCTA";

import { client } from "@/sanity/client";
import { testQuery } from "@/sanity/queries";

export default async function Home() {
  const data = await client.fetch(testQuery);

  return (
    <>
    
      <HeroSection />
      <ValueStatement />
      <ValueCards />
      <FeaturedHomes />
      <CommunityCTA />
    </>
  );
}
