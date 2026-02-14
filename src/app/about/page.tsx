import { TextHero } from "@/components/ui/TextHero";
import { MissionStatement } from "@/components/sections/MissionStatement";
import { ValueCardsGrid } from "@/components/ui/ValueCardsGrid";
import { CommunityCTA } from "@/components/sections/CommunityCTA";

export default function AboutPage() {
  return (
    <>
      <TextHero 
        title="We believe mountains are better when we share them"
      />
      
      <MissionStatement 
        paragraphs={[
          "Something has been lost along the way.",
          "Places that once felt open — trails, summer camps, gathering spots — are being 'leveled up' in a race against nobody. Renovations claiming to make 'boutique resorts.' Vacation stays that erase people and create emptiness.",
          "Staying somewhere shouldn't just be about ticking a box. It should be a small but loyal act of shared care — a line that changed how you felt. Long nights around a fire where stories surfaced too fast.",
          "Roamstead was built in response to that memory. Not as a third place, but also connected instead. Not as a club — just open to the people who feel them.",
          "This is our way of giving the mountain back to the people who love them."
        ]}
      />

      <section className="bg-bg-canvas py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-h2 font-heading font-medium text-text-primary mb-12 text-center">
            What we care about
          </h2>
          <ValueCardsGrid />
        </div>
      </section>

      <MissionStatement 
        paragraphs={[
          "Roamstead is a growing collection of places to stay in Heber Valley and the surrounding mountains. Each property is shaped by its setting — designed to feel intentional, welcoming, and easy to return to."
        ]}
      />

      <CommunityCTA />
    </>
  );
}