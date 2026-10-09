import { HeroSection } from "@/components/sections/HeroSection";
import { ValueStatement } from "@/components/sections/ValueStatement";
import { ValueCards } from "@/components/sections/ValueCards";
import { FeaturedHomes } from "@/components/sections/FeaturedHomes";
import { SenatorBand } from '@/components/sections/SenatorBand';
import { CommunityCTA } from "@/components/sections/CommunityCTA";

export const metadata = {
  title: "Roamstead Collective | Wasatch Back stays in Heber Valley & Park City",
  description: "Homes across Utah's Wasatch Back, from Heber Valley to Park City. Ski, ride, float, then settle in. Book direct with Roamstead Collective.",
  openGraph: { title: "Roamstead Collective | Wasatch Back stays in Heber Valley & Park City", description: "Homes across Utah's Wasatch Back, from Heber Valley to Park City. Ski, ride, float, then settle in. Book direct with Roamstead Collective." },
  twitter: { title: "Roamstead Collective | Wasatch Back stays in Heber Valley & Park City", description: "Homes across Utah's Wasatch Back, from Heber Valley to Park City. Ski, ride, float, then settle in. Book direct with Roamstead Collective." },
};

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
