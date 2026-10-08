"use client";

import React, { useState } from "react";
import { PrimaryProperty } from "../ui/PrimaryProperty";
import { PropertyCard } from "../ui/PropertyCard";

interface FeaturedHomesProps {
  showAll?: boolean;
}

export const FeaturedHomes: React.FC<FeaturedHomesProps> = ({ showAll = false }) => {
  const [activeProperty, setActiveProperty] = useState(0);

  const handleCarouselScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    const containerLeft = container.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    children.forEach((child, index) => {
      const distance = Math.abs(child.getBoundingClientRect().left - containerLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveProperty(closestIndex);
  };

  return (
    <section className="w-full bg-[#FFFCFB] px-5 py-5 md:px-6 md:py-16">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 md:justify-start md:gap-8">
        <h2
          className="max-w-[190px] font-heading text-[31px] font-medium leading-[33px] tracking-[-1.24px] text-[#1F3125] md:max-w-none md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          Our featured homes
        </h2>
        <a
          href="/properties"
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-[8px] border border-[#D8CCC4] bg-[#FEFDFC] px-3 font-body text-[11.5px] font-medium leading-none tracking-[-0.2px] text-[#291D16] shadow-[0_2px_8px_rgba(41,29,22,0.035)] transition-colors hover:bg-[#F4EFEC] md:h-10 md:rounded-none md:px-4 md:text-[16px] md:leading-6 md:tracking-[-0.32px]"
        >
          View All Properties
        </a>
      </div>

      <div className="mx-auto mt-5 w-full max-w-[1440px] md:mt-10">
        <PrimaryProperty
          image="/images/senator-main.jpg"
          location="Heber City"
          name="The Heber Senator"
          description="A historic bed & breakfast shaped by the pace of Heber Valley and the mountains that surround it."
          badge="Winner of 2024 and 2025 Best of State"
          href="/properties/senator"
          ctaLabel="Explore the stay"
        />
      </div>

      <div className="mx-auto mt-6 w-full max-w-[1440px] md:mt-10">
        <div onScroll={handleCarouselScroll} className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-3">
          <PropertyCard image="https://d2ol7oe51mr4n9.cloudfront.net/user_3JhtTKjJmo2R3mPhsBJElt2FRYV/8d444f85-ede6-407c-ae17-93e38999bdff.jpg" location="Midway" name="Hygge House" sleeps={10} bedrooms={4} baths={3} href="/properties/hygge-house" />
          <PropertyCard image="/images/granary.jpg" location="Midway" name="Granary" sleeps={4} bedrooms={1} baths={1} href="/properties/granary" />
          <PropertyCard image="/images/daystar.jpg" location="Deer Valley, Park City" name="Daystar" sleeps={12} bedrooms={6} baths={6} href="/properties/daystar" />
          <PropertyCard image="/images/lowell/exterior.jpg" location="Park City" name="The Lowell" sleeps={8} bedrooms={2} baths={2} href="/properties/lowell" />
          <PropertyCard image="/images/powder-room/resort-base.jpg" location="Park City" name="Powder Room" sleeps={4} baths={1} href="/properties/powder-room" />
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 md:hidden" aria-label="Swipe to view more properties">
          {[0, 1, 2, 3, 4].map((index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all duration-200 ${activeProperty === index ? "w-4 bg-[#4A6E57]" : "w-1.5 bg-[#D8CCC4]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
