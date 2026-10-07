import React from "react";
import { PrimaryProperty } from "../ui/PrimaryProperty";
import { PropertyCard } from "../ui/PropertyCard";

interface FeaturedHomesProps {
  showAll?: boolean;
}

export const FeaturedHomes: React.FC<FeaturedHomesProps> = ({ showAll = false }) => {
  return (
    <section className="w-full bg-[#FFFCFB] px-5 py-6 md:px-8 md:py-10 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1440px] items-end justify-between gap-4">
        <h2
          className="font-heading text-[32px] font-medium leading-[35px] tracking-[-1.28px] text-[#1F3125] md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          Our featured homes
        </h2>
        <a
          href="/properties"
          className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-full border border-[#D8CCC4] bg-[#FBF8F7] px-3 py-1 font-body text-[12.5px] font-medium leading-5 tracking-[-0.25px] text-[#4A6E57] shadow-[0_4px_14px_rgba(41,29,22,0.05)] transition-all hover:bg-[#F4EFEC] hover:text-[#3C6049] md:inline-flex md:h-10 md:items-center md:justify-center md:border md:border-[#D8CCC4] md:bg-[#FEFDFC] md:px-4 md:py-2 md:text-[16px] md:leading-6 md:tracking-[-0.32px] md:text-[#291D16] md:hover:bg-[#F4EFEC]"
        >
          View all
        </a>
      </div>

      <div className="mx-auto mt-5 w-full max-w-[1440px] md:mt-7">
        <PrimaryProperty
          image="/images/senator-main.jpg"
          location="Heber City"
          name="The Heber Senator"
          description="A restored 1902 home three blocks from Main Street, with 10 rooms and suites and cooked-to-order breakfast. Rated 9.8 out of 10 by guests."
          badge="Historic 10-room bed and breakfast"
          href="/properties/senator"
        />
      </div>

      <div className="mx-auto mt-5 flex w-full max-w-[1440px] snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-6 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3">
        <PropertyCard image="/images/hygge-house.jpg" location="Midway" name="Hygge House" sleeps={10} bedrooms={4} baths={3} href="/properties/hygge-house" />
        <PropertyCard image="/images/granary.jpg" location="Midway" name="Granary" sleeps={4} bedrooms={1} baths={1} href="/properties/granary" />
        <PropertyCard image="/images/daystar.jpg" location="Deer Valley, Park City" name="Daystar" sleeps={12} bedrooms={6} baths={6} href="/properties/daystar" />
        <PropertyCard image="/images/lowell/exterior.jpg" location="Park City" name="The Lowell" sleeps={8} bedrooms={2} baths={2} href="/properties/lowell" />
        <PropertyCard image="/images/powder-room/resort-base.jpg" location="Park City" name="Powder Room" sleeps={4} baths={1} href="/properties/powder-room" />
      </div>
    </section>
  );
};
