"use client";

import copy from "@/data/admin-copy.json";

import React, { useState } from "react";
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
    <section className="w-full bg-[#FFFCFB] px-4 pb-6 pt-5 md:px-6 md:py-12">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 md:justify-start md:gap-8">
        <h2
          className="max-w-[230px] font-heading text-[29px] font-medium leading-[1.08] tracking-[-1.24px] text-[#1F3125] md:max-w-none md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          {copy.homepage.featuredHeading}
        </h2>
        <a
          href="/properties"
          className="inline-flex h-[44px] shrink-0 items-center justify-center rounded-[8px] border border-[#D8CCC4] bg-[#FFFCFB] px-[16px] font-body text-[12px] font-semibold leading-none tracking-[-0.2px] text-[#253329] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_5px_rgba(9,22,16,0.06),0_8px_20px_rgba(9,22,16,0.09)] transition-[transform,box-shadow,background-color,border-color] duration-300 hover:-translate-y-[2px] hover:border-[#B6C5B9] hover:bg-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_5px_12px_rgba(9,22,16,0.09),0_12px_26px_rgba(9,22,16,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] active:translate-y-0 md:h-10 md:px-4 md:text-[16px] md:leading-6 md:tracking-[-0.32px]"
        >
          View all stays
        </a>
      </div>

      <div className="mx-auto mt-4 w-full max-w-[1440px] md:mt-8">
        <div onScroll={handleCarouselScroll} className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-7 md:overflow-visible md:px-0 lg:grid-cols-2">
          <PropertyCard image="https://d2ol7oe51mr4n9.cloudfront.net/user_3JhtTKjJmo2R3mPhsBJElt2FRYV/8d444f85-ede6-407c-ae17-93e38999bdff.jpg" location="Midway" name={copy.homepage.cards["hygge-house"].name} featureHighlight={copy.homepage.cards["hygge-house"].highlight} sleeps={10} bedrooms={4} baths={3} href="/properties/hygge-house#availability" detailHref="/properties/hygge-house" hook={copy.hooks["hygge-house"]} />
          <PropertyCard image="/images/granary.jpg" location="Midway" name={copy.homepage.cards["granary"].name} featureHighlight={copy.homepage.cards["granary"].highlight} sleeps={4} bedrooms={1} baths={1} href="/properties/granary#availability" detailHref="/properties/granary" hook={copy.hooks["granary"]} />
          <PropertyCard image="/images/lowell/exterior.jpg" location="Park City" name={copy.homepage.cards["lowell"].name} featureHighlight={copy.homepage.cards["lowell"].highlight} sleeps={8} bedrooms={2} baths={2} href="/properties/lowell#availability" detailHref="/properties/lowell" hook={copy.hooks["lowell"]} />
          <PropertyCard image="/images/powder-room/bedroom.jpg" location="Park City" name={copy.homepage.cards["powder-room"].name} featureHighlight={copy.homepage.cards["powder-room"].highlight} sleeps={4} baths={1} href="/properties/powder-room#availability" detailHref="/properties/powder-room" hook={copy.hooks["powder-room"]} />
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 md:hidden" aria-label="Swipe to view more properties">
          {[0, 1, 2, 3].map((index) => (
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
