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
  return (
    <article className="flex h-[492px] flex-col items-start justify-end gap-6 md:h-[500px]">
      <a href={href} className="relative h-[256px] w-full shrink-0 overflow-hidden rounded-2 border border-[#D8CCC4]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </a>

      <div className="flex w-full flex-col items-start gap-2">
        <p className="w-full font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#6D6057]">
          {location.replace(", Utah", "")}
        </p>
        <h3
          className="w-full font-heading text-[36px] font-medium leading-[40px] tracking-[-1.44px] text-[#4A6E57] md:text-[44px] md:leading-[48px] md:tracking-[-1.76px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          <a href={href}>{name}</a>
        </h3>

        <div className="w-full font-body text-[18px] font-normal leading-7 tracking-[-0.36px] text-[#6D6057]">
          {sleeps ? <p>Sleeps {sleeps}</p> : null}
          {bedrooms ? <p>{bedrooms} {bedrooms === 1 ? "Bedroom" : "Bedrooms"}</p> : null}
          {baths ? <p>{baths} {baths === 1 ? "Bath" : "Baths"}</p> : null}
        </div>

        <a
          href={href}
          className="flex h-10 w-full items-center justify-center border border-[#D8CCC4] bg-[#FEFDFC] px-4 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#291D16] transition-colors hover:bg-[#F4EFEC] md:w-fit"
        >
          Explore the stay
        </a>
      </div>
    </article>
  );
};
