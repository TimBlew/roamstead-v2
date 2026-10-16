import React from "react";
import Image from "next/image";

interface PropertyCardProps {
  image: string;
  location: string;
  name: string;
  sleeps?: number;
  bedrooms?: number;
  baths?: number;
  href: string;
  detailHref?: string;
  eyebrow?: string;
  hook?: string;
  featureHighlight?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  image,
  location,
  name,
  sleeps,
  bedrooms,
  baths,
  href,
  detailHref,
  hook,
  featureHighlight,
}) => {
  const facts = [
    sleeps ? "Sleeps " + sleeps : null,
    bedrooms ? bedrooms + " " + (bedrooms === 1 ? "Bedroom" : "Bedrooms") : (!bedrooms ? "Studio" : null),
    baths ? baths + " " + (baths === 1 ? "Bath" : "Baths") : null,
  ].filter(Boolean).join(" · ");

  return (
    <article className="group flex h-auto w-[calc(100vw-64px)] max-w-[390px] shrink-0 snap-start flex-col self-stretch md:w-auto md:max-w-none md:gap-0">
      <a
        href={detailHref || href}
        className="relative h-[194px] w-full shrink-0 overflow-hidden rounded-[12px] border border-[#DDD4CD] shadow-[0_5px_18px_rgba(31,49,37,0.09)] transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#9BB1A1] hover:shadow-[0_12px_26px_rgba(31,49,37,0.14)] active:scale-[0.995] md:aspect-[1.9] md:h-auto md:rounded-[8px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57]"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 46vw, (min-width: 768px) 50vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />
      </a>

      <div className="mt-3 flex w-full flex-1 flex-col items-start md:mt-4">
        <p className="font-body text-[13px] font-medium leading-5 text-[#82766F] md:text-[14px]">
          {location.replace(", Utah", "")}
        </p>
        <h3
          className="mt-0.5 font-heading text-[27px] font-medium leading-[1.12] tracking-[-1.1px] text-[#1F3125] md:text-[36px] md:tracking-[-1.3px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          <a href={detailHref || href} className="transition-colors group-hover:text-[#4A6E57] hover:text-[#4A6E57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57]">{name}</a>
        </h3>
        {hook ? (
          <p className="mt-1.5 min-h-[40px] font-body text-[14px] leading-[1.4] text-[#6D6057] md:min-h-0 md:text-[16px]">
            {hook}
          </p>
        ) : null}
        <p className="mb-[20px] mt-2 font-body text-[13px] leading-5 text-[#6D6057] md:mb-0 md:mt-3 md:text-[14px]">
          {featureHighlight ?? facts}
        </p>
        <a
          href={href}
          className="group/cta mb-[2px] ml-[12px] mt-auto inline-flex h-[44px] w-[220px] max-w-[calc(100%-12px)] items-center justify-center gap-[10px] whitespace-nowrap rounded-[8px] border border-[#D8CCC4] bg-[#FFFCFB] px-[20px] font-body text-[14px] font-semibold text-[#253329] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_5px_rgba(9,22,16,0.06),0_8px_20px_rgba(9,22,16,0.09)] transition-[transform,box-shadow,background-color,border-color] duration-300 hover:-translate-y-[2px] hover:border-[#B6C5B9] hover:bg-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_5px_12px_rgba(9,22,16,0.09),0_12px_26px_rgba(9,22,16,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] active:translate-y-0 md:mb-0 md:ml-0 md:mt-4 md:max-w-full"
        >
          <span>Check dates</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-[16px] w-[16px] shrink-0 text-[#4A6E57] transition-transform duration-300 group-hover/cta:translate-x-[3px]">
            <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </article>
  );
};
