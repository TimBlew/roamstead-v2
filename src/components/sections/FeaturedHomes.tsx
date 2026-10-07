import React from "react";
import { PrimaryProperty } from "../ui/PrimaryProperty";
import { PropertyCard } from "../ui/PropertyCard";

interface FeaturedHomesProps {
  showAll?: boolean;
}

export const FeaturedHomes: React.FC<FeaturedHomesProps> = ({ showAll = false }) => {
  return (
    <section className="flex w-full flex-col items-start gap-6 bg-[#FFFCFB] px-6 py-16 md:gap-10">
      {showAll ? (
        <>
          <h2
            className="w-full font-heading text-[40px] font-medium leading-[44px] tracking-[-1.6px] text-[#1F3125] md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
            style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
          >
            Our featured homes
          </h2>

          <PrimaryProperty
            image="/images/senator-main.jpg"
            location="Heber City"
            name="The Heber Senator"
            description="A restored 1902 home three blocks from Main Street, with 10 rooms and suites and cooked-to-order breakfast. Rated 9.8 out of 10 by guests."
            badge="Historic 10-room bed and breakfast"
            href="/properties/senator"
          />

          <a
            href="/properties"
            className="flex h-10 w-full items-center justify-center border border-[#D8CCC4] bg-[#FEFDFC] px-4 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#291D16] transition-colors hover:bg-[#F4EFEC] md:hidden"
          >
            View All Properties
          </a>
        </>
      ) : (
        <div className="flex w-full flex-col items-start gap-2 md:flex-row md:items-center md:gap-6">
          <h2
            className="w-full font-heading text-[40px] font-medium leading-[44px] tracking-[-1.6px] text-[#1F3125] md:w-auto md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
            style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
          >
            Our featured homes
          </h2>
          <a
            href="/properties"
            className="inline-flex h-10 items-center justify-center py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#4A6E57] transition-colors hover:text-[#3C6049] md:border md:border-[#D8CCC4] md:bg-[#FEFDFC] md:px-4 md:text-[#291D16] md:hover:bg-[#F4EFEC]"
          >
            View All Properties
          </a>
        </div>
      )}

      {!showAll ? (
        <PrimaryProperty
          image="/images/senator-main.jpg"
          location="Heber City"
          name="The Heber Senator"
          description="A restored 1902 home three blocks from Main Street, with 10 rooms and suites and cooked-to-order breakfast. Rated 9.8 out of 10 by guests."
          badge="Historic 10-room bed and breakfast"
          href="/properties/senator"
        />
      ) : null}

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
