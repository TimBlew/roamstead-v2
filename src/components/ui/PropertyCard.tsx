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
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  image,
  location,
  name,
  sleeps,
  bedrooms,
  baths,
  href,
}) => {
  const facts = [
    sleeps ? "Sleeps " + sleeps : null,
    bedrooms ? bedrooms + " " + (bedrooms === 1 ? "Bedroom" : "Bedrooms") : null,
    baths ? baths + " " + (baths === 1 ? "Bath" : "Baths") : null,
  ].filter(Boolean).join(" · ");

  return (
    <article className="flex w-[76vw] max-w-[292px] shrink-0 snap-start flex-col md:w-auto md:max-w-none md:items-start">
      <a href={href} className="relative h-[190px] w-full shrink-0 overflow-hidden rounded-[16px] md:aspect-[4/3] md:h-auto md:rounded-[18px]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 78vw"
          className="object-cover"
        />
      </a>

      <div className="mt-3 flex w-full flex-col items-start md:mt-4 md:gap-1.5">
        <p className="font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#8F7E73] md:w-full md:text-[16px] md:leading-6 md:tracking-[-0.32px] md:text-[#6D6057]">
          {location.replace(", Utah", "")}
        </p>
        <h3
          className="mt-0.5 font-heading text-[28px] font-medium leading-[32px] tracking-[-1.12px] text-[#1F3125] md:mt-0 md:w-full md:text-[34px] md:leading-[38px] md:tracking-[-1.36px] md:text-[#1F3125]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          <a href={href}>{name}</a>
        </h3>

        <p className="mt-1.5 font-body text-[13px] font-normal leading-5 tracking-[-0.26px] text-[#6D6057] md:hidden">
          {facts}
        </p>

        <div className="hidden w-full font-body text-[15px] font-normal leading-[22px] tracking-[-0.3px] text-[#6D6057] md:block">
          {sleeps ? <p>Sleeps {sleeps}</p> : null}
          {bedrooms ? <p>{bedrooms} {bedrooms === 1 ? "Bedroom" : "Bedrooms"}</p> : null}
          {baths ? <p>{baths} {baths === 1 ? "Bath" : "Baths"}</p> : null}
        </div>

        <a
          href={href}
          className="mt-2 inline-flex items-center font-body text-[14px] font-medium leading-5 tracking-[-0.28px] text-[#4A6E57] md:mt-2 md:text-[14px] md:leading-5 md:tracking-[-0.28px]"
        >
          Check availability
        </a>
      </div>
    </article>
  );
};
