import React from "react";
import Image from "next/image";
import { Button } from "./Button";

interface PrimaryPropertyProps {
  image: string;
  location: string;
  name: string;
  description: string;
  badge?: string;
  href: string;
  external?: boolean;
}

export const PrimaryProperty: React.FC<PrimaryPropertyProps> = ({
  image, location, name, description, badge, href, external = false,
}) => {
  return (
    <article className="grid overflow-hidden rounded-4 bg-bg-subtle lg:grid-cols-[1.35fr_0.65fr]">
      <div className="relative min-h-[340px] md:min-h-[480px]">
        <Image src={image} alt={name} fill sizes="(min-width: 1024px) 65vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">{location}</p>
          <h3 className="mt-3 font-heading text-[40px] font-medium leading-[1.02] tracking-display text-text-primary md:text-[48px]">{name}</h3>
          <p className="mt-5 text-base leading-7 tracking-body text-text-secondary">{description}</p>
          {badge && <p className="mt-5 text-sm font-medium tracking-body text-brand-default">{badge}</p>}
        </div>
        <div className="mt-8"><Button href={href} external={external}>Explore the stay</Button></div>
      </div>
    </article>
  );
};
