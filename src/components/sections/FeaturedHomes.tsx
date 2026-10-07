import React from "react";
import { PrimaryProperty } from "../ui/PrimaryProperty";
import { PropertyCard } from "../ui/PropertyCard";

interface FeaturedHomesProps {
  showAll?: boolean;
}

export const FeaturedHomes: React.FC<FeaturedHomesProps> = ({ showAll = false }) => {
  return (
    <section className="flex w-full flex-col items-start gap-10 bg-[#FFFCFB] px-6 py-16">
      <div className="flex w-full items-center gap-6">
        <h2
          className="font-heading text-[48px] font-medium leading-[54px] tracking-[-1.92px] text-[#1F3125]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          Our featured homes
        </h2>
        <a
          href="/properties"
          className="inline-flex h-10 items-center justify-center border border-[#D8CCC4] bg-[#FEFDFC] px-4 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#291D16] transition-colors hover:bg-[#F4EFEC]"
        >
          View All Properties
        </a>
      </div>

      <PrimaryProperty
        image="/images/senator-main.jpg"
        location="Heber City"
        name="The Heber Senator"
        description="A restored 1902 home three blocks from Main Street, with 10 rooms and suites and cooked-to-order breakfast. Rated 9.8 out of 10 by guests."
        badge="Historic 10-room bed and breakfast"
        href="/properties/senator"
      />

      <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        <PropertyCard image="/images/hygge-house.jpg" location="Midway" name="Hygge House" sleeps={10} bedrooms={4} baths={3} href="/properties/hygge-house" />
        <PropertyCard image="/images/granary.jpg" location="Midway" name="Granary" sleeps={4} bedrooms={1} baths={1} href="/properties/granary" />
        <PropertyCard image="/images/daystar.jpg" location="Deer Valley, Park City" name="Daystar" sleeps={12} bedrooms={6} baths={6} href="/properties/daystar" />
        {showAll ? (
          <>
            <PropertyCard image="/images/lowell/exterior.jpg" location="Park City" name="The Lowell" sleeps={8} bedrooms={2} baths={2} href="/properties/lowell" />
            <PropertyCard image="/images/powder-room/resort-base.jpg" location="Park City" name="Powder Room" sleeps={4} baths={1} href="/properties/powder-room" />
          </>
        ) : null}
      </div>
    </section>
  );
};
