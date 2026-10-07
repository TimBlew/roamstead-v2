import React from "react";
import { Container, Section } from "../layout/Container";
import { PrimaryProperty } from "../ui/PrimaryProperty";
import { PropertyCard } from "../ui/PropertyCard";

interface FeaturedHomesProps { showAll?: boolean; }

export const FeaturedHomes: React.FC<FeaturedHomesProps> = ({ showAll = false }) => {
  return (
    <Section background="canvas">
      <div id="stays" className="-mt-20 pt-20" />
      <Container maxWidth="figma">
        <div className="mb-9 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-brand-default">Find your fit</p>
            <h2 className="mt-3 max-w-[760px] font-heading text-h2 font-medium tracking-display text-text-primary">A different kind of stay for every mountain trip</h2>
          </div>
          <a href="/properties" className="text-sm font-medium tracking-body text-brand-default hover:text-brand-hover">View all properties →</a>
        </div>

        <PrimaryProperty
          image="/images/hygge-house.jpg"
          location="Midway, Utah"
          name="Hygge House"
          description="A four-bedroom mountain home with a private sauna, gym, dedicated workspaces, fenced yard, and room to settle in. Built for family trips, longer stays, and days that mix work with the outdoors."
          badge="Best for families · longer stays · remote work · pets"
          href="/properties/hygge-house"
        />

        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          <PropertyCard image="/images/daystar.jpg" location="Deer Valley, Park City" name="Daystar" sleeps={12} bedrooms={6} baths={6} eyebrow="Large-group mountain living with a hot tub, sauna, indoor sport court, and room for everyone." href="/properties/daystar" />
          <PropertyCard image="/images/lowell/exterior.jpg" location="Park City Mountain" name="The Lowell" sleeps={8} bedrooms={2} baths={2} eyebrow="About thirty steps from the snow, with a pool, hot tub, steam shower, and effortless resort access." href="/properties/lowell" />
          <PropertyCard image="/images/granary.jpg" location="Midway, Utah" name="Granary" sleeps={4} bedrooms={1} baths={1} eyebrow="A smaller Midway stay with mountain views, a gas fireplace, and restaurants and shops within walking distance." href="/properties/granary" />
          {showAll && (
            <>
              <PropertyCard image="/images/powder-room/resort-base.jpg" location="Park City Mountain" name="Powder Room" sleeps={4} baths={1} eyebrow="A simple ski-base studio for couples and small groups who want the mountain right outside." href="/properties/powder-room" />
              <PropertyCard image="/images/senator-main.jpg" location="Heber City, Utah" name="The Heber Senator" eyebrow="Prefer a historic B&B? Stay in a restored 1902 home with ten individually designed rooms." href="/properties/senator" />
            </>
          )}
        </div>

        {!showAll && (
          <div className="mt-12 rounded-4 border border-border-subtle bg-bg-subtle px-6 py-7 md:flex md:items-center md:justify-between md:px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">Prefer a historic B&B?</p>
              <h3 className="mt-2 font-heading text-[30px] font-medium tracking-display text-text-primary">Meet The Heber Senator</h3>
              <p className="mt-2 max-w-[620px] text-sm leading-6 tracking-body text-text-secondary">Ten rooms in a restored 1902 home in Heber City, with its own booking experience.</p>
            </div>
            <a href="/properties/senator" className="mt-5 inline-flex text-sm font-medium tracking-body text-brand-default md:mt-0">Explore the Senator →</a>
          </div>
        )}
      </Container>
    </Section>
  );
};
