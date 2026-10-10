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
}) => {
  const facts = [
    sleeps ? "Sleeps " + sleeps : null,
    bedrooms ? bedrooms + " " + (bedrooms === 1 ? "Bedroom" : "Bedrooms") : (name === "Powder Room" ? "Studio" : null),
    baths ? baths + " " + (baths === 1 ? "Bath" : "Baths") : null,
  ].filter(Boolean).join(" · ");

  return (
    <article className="flex w-[76vw] max-w-[292px] shrink-0 snap-start flex-col md:w-auto md:max-w-none md:gap-0">
      <a
        href={detailHref || href}
        className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-[16px] md:aspect-[1.9] md:h-auto md:rounded-[8px] md:border md:border-[#D8CCC4]"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 46vw, (min-width: 768px) 50vw, 78vw"
          className="object-cover"
        />
      </a>

      <div className="mt-4 flex w-full flex-col items-start md:mt-4">
        <p className="font-body text-[13px] font-medium leading-5 text-[#82766F] md:text-[14px]">
          {location.replace(", Utah", "")}
        </p>
        <h3
          className="mt-1 font-heading text-[28px] font-medium leading-[1.12] tracking-[-1.1px] text-[#1F3125] md:text-[36px] md:tracking-[-1.3px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          <a href={detailHref || href}>{name}</a>
        </h3>
        {hook ? (
          <p className="mt-2 font-body text-[15px] leading-[1.5] text-[#6D6057] md:text-[16px]">
            {hook}
          </p>
        ) : null}
        <p className="mt-3 font-body text-[13px] leading-5 text-[#6D6057] md:mt-3 md:text-[14px]">
          {facts}
        </p>
        <a
          href={href}
          className="mt-4 inline-flex h-11 w-auto min-w-[144px] items-center justify-center whitespace-nowrap rounded-[7px] border border-[#CFC5BD] bg-[#FEFDFC] px-6 font-body text-[14px] font-medium text-[#1F3125] transition-colors hover:border-[#4A6E57] hover:bg-[#F4EFEC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] md:mt-4"
        >
          Check dates
        </a>
      </div>
    </article>
  );
};
