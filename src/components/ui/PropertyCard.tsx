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
  image, location, name, sleeps, bedrooms, baths, href, eyebrow,
}) => {
  const facts = [
    sleeps ? `Sleeps ${sleeps}` : null,
    bedrooms ? `${bedrooms} ${bedrooms === 1 ? "bedroom" : "bedrooms"}` : null,
    baths ? `${baths} ${baths === 1 ? "bath" : "baths"}` : null,
  ].filter(Boolean);

  return (
    <article className="group flex h-full flex-col">
      <a href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3 bg-bg-surface">
          <Image src={image} alt={name} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]" />
        </div>
      </a>
      <div className="flex flex-1 flex-col pt-5">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">{location}</p>
        <h3 className="mt-2 font-heading text-[32px] font-medium leading-[1.05] tracking-display text-text-primary md:text-[36px]">
          <a href={href} className="transition-colors hover:text-brand-default">{name}</a>
        </h3>
        {eyebrow && <p className="mt-3 max-w-[34ch] text-sm leading-6 tracking-body text-text-secondary">{eyebrow}</p>}
        {facts.length > 0 && <p className="mt-4 text-sm tracking-body text-text-muted">{facts.join(" · ")}</p>}
        <a href={href} className="mt-5 inline-flex items-center gap-2 self-start text-sm font-medium tracking-body text-brand-default transition-colors hover:text-brand-hover">
          Explore the stay <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
};
