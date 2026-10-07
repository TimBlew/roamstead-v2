import React from "react";
import { Container } from "../layout/Container";
import { PrimaryProperty } from "../ui/PrimaryProperty";
import { PropertyCard } from "../ui/PropertyCard";

interface FeaturedHomesProps {
  showAll?: boolean;
}

export const FeaturedHomes: React.FC<FeaturedHomesProps> = ({ showAll = false }) => {
  return (
    <section className="bg-bg-canvas py-20 md:py-24">
      <Container maxWidth="figma">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-center md:justify-between">
          <h2 className="font-heading text-h2 font-medium tracking-display text-text-primary">
            Our featured homes
          </h2>
          <a
            href="/properties"
            className="inline-flex min-h-10 items-center justify-center self-start rounded-2 border border-border-default bg-bg-canvas px-4 py-2 text-sm font-medium tracking-body text-text-primary transition-colors hover:bg-bg-subtle"
          >
            View All Properties
          </a>
        </div>

        <div className="mb-10 md:mb-12">
          <PrimaryProperty
            image="/images/senator-main.jpg"
            location="Heber City, Utah"
            name="The Heber Senator"
            description="A restored 1902 home three blocks from Main Street, with 10 rooms and suites and cooked-to-order breakfast. Rated 9.8 out of 10 by guests."
            badge="Historic 10-room bed and breakfast"
            href="/properties/senator"
          />
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          <PropertyCard
            image="/images/hygge-house.jpg"
            location="Midway, Utah"
            name="Hygge House"
            sleeps={10}
            bedrooms={4}
            baths={3}
            href="/properties/hygge-house"
          />
          <PropertyCard
            image="/images/granary.jpg"
            location="Midway, Utah"
            name="Granary"
            sleeps={4}
            bedrooms={1}
            baths={1}
            href="/properties/granary"
          />
          <PropertyCard
            image="/images/daystar.jpg"
            location="Deer Valley, Park City"
            name="Daystar"
            sleeps={12}
            bedrooms={6}
            baths={6}
            href="/properties/daystar"
          />
          {showAll && (
            <>
              <PropertyCard
                image="/images/lowell/exterior.jpg"
                location="Park City, Utah"
                name="The Lowell"
                sleeps={8}
                bedrooms={2}
                baths={2}
                href="/properties/lowell"
              />
              <PropertyCard
                image="/images/powder-room/resort-base.jpg"
                location="Park City, Utah"
                name="Powder Room"
                sleeps={4}
                baths={1}
                href="/properties/powder-room"
              />
            </>
          )}
        </div>
      </Container>
    </section>
  );
};
