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
  hook,
}) => {
  const facts = [
    sleeps ? "Sleeps " + sleeps : null,
    bedrooms ? bedrooms + " " + (bedrooms === 1 ? "Bedroom" : "Bedrooms") : (name === "Powder Room" ? "Studio" : null),
    baths ? baths + " " + (baths === 1 ? "Bath" : "Baths") : null,
  ].filter(Boolean).join(" · ");

  return (
    <article className="flex w-[76vw] max-w-[292px] shrink-0 snap-start flex-col md:w-auto md:max-w-none md:gap-6">
      <a
        href={href}
        className="relative h-[190px] w-full shrink-0 overflow-hidden rounded-[16px] md:h-[256px] md:rounded-[8px] md:border md:border-[#D8CCC4]"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 78vw"
          className="object-cover"
        />
      </a>

      <div className="mt-3 flex w-full flex-col items-start md:mt-0 md:gap-2">
        <p className="font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#8F7E73] md:text-[16px] md:leading-6 md:tracking-[-0.32px] md:text-[#6D6057]">
          {location.replace(", Utah", "")}
        </p>

        <h3
          className="mt-0.5 font-heading text-[28px] font-medium leading-[32px] tracking-[-1.12px] text-[#1F3125] md:mt-0 md:text-[44px] md:leading-[48px] md:tracking-[-1.76px] md:text-[#4A6E57]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          <a href={href}>{name}</a>
        </h3>

        {hook ? <p className="mt-2 font-body text-[14px] leading-5 text-[#6D6057]">{hook}</p> : null}
        <p className="mt-1.5 font-body text-[13px] font-normal leading-5 tracking-[-0.26px] text-[#6D6057] md:hidden">
          {facts}
        </p>

        <div className="hidden w-full items-end justify-between gap-6 md:flex">
          <div className="font-body text-[18px] font-normal leading-7 tracking-[-0.36px] text-[#6D6057]">
            {sleeps ? <p>Sleeps {sleeps}</p> : null}
            {bedrooms ? <p>{bedrooms} {bedrooms === 1 ? "Bedroom" : "Bedrooms"}</p> : name === "Powder Room" ? <p>Studio</p> : null}
            {baths ? <p>{baths} {baths === 1 ? "Bath" : "Baths"}</p> : null}
          </div>

          <a
            href={href}
            className="inline-flex shrink-0 items-center justify-center border border-[#D8CCC4] bg-[#FEFDFC] px-4 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#291D16] transition-colors hover:bg-[#F4EFEC]"
          >
            Check dates
          </a>
        </div>

        <a
          href={href}
          className="mt-2 inline-flex items-center font-body text-[14px] font-medium leading-5 tracking-[-0.28px] text-[#4A6E57] md:hidden"
        >
          Check dates
        </a>
      </div>
    </article>
  );
};
