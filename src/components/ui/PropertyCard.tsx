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
        <p className="mt-2 font-body text-[13px] font-normal leading-5 tracking-[-0.26px] text-[#6D6057] md:text-[16px] md:leading-7">
          {facts}
        </p>

        <a
          href={href}
          className="mt-3 inline-flex min-h-10 items-center justify-center rounded-[7px] border border-[#D8CCC4] bg-[#FEFDFC] px-5 py-2.5 font-body text-[14px] font-medium leading-5 text-[#291D16] transition-colors hover:border-[#4A6E57] hover:bg-[#F4EFEC] md:mt-4 md:min-h-11 md:text-[16px]"
        >
          Check dates
        </a>
      </div>
    </article>
  );
};
