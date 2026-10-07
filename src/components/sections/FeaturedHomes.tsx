import React from 'react';
import { Container, Section } from '../layout/Container';
import { PrimaryProperty } from '../ui/PrimaryProperty';
import { PropertyCard } from '../ui/PropertyCard';

interface FeaturedHomesProps {
  // Properties page lists every home; the home page keeps the featured three
  showAll?: boolean;
}

export const FeaturedHomes: React.FC<FeaturedHomesProps> = ({ showAll = false }) => {
  return (
    <Section background="canvas">
      <Container>
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-h2 font-heading font-medium text-text-primary">Our featured homes</h2>
          <a 
            href="/properties" 
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-white text-text-primary border border-border-default hover:bg-bg-subtle transition-colors"
          >
            View All Properties
          </a>
        </div>

        {/* Primary Featured Property */}
        <div className="mb-6">
          <PrimaryProperty
            image="/images/senator-main.jpg"
            location="Heber City, UT"
            name="The Heber Senator"
            description="A restored 1902 home three blocks from Main Street, with 10 rooms and suites and cooked to order breakfast. Rated 9.8 out of 10 by guests."
            badge="Winner of 2024 and 2025 Best of State"
            href="/properties/senator"
          />
        </div>

        {/* Secondary Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PropertyCard
            image="/images/hygge-house.jpg"
            location="Midway, UT"
            name="Hygge House"
            sleeps={10}
            bedrooms={4}
            baths={3}
            href="/properties/hygge-house"
          />
          <PropertyCard
            image="/images/granary.jpg"
            location="Midway, UT"
            name="Granary"
            sleeps={4}
            bedrooms={1}
            baths={1}
            href="/properties/granary"
          />
          <PropertyCard
            image="/images/daystar.jpg"
            location="Deer Valley, Park City, UT"
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
                location="Park City, UT"
                name="The Lowell"
                sleeps={8}
                bedrooms={2}
                baths={2}
                href="/properties/lowell"
              />
              <PropertyCard
                image="/images/powder-room/resort-base.jpg"
                location="Park City, UT"
                name="Powder Room"
                sleeps={4}
                baths={1}
                href="/properties/powder-room"
              />
            </>
          )}
        </div>
      </Container>
    </Section>
  );
};