import Image from "next/image";
import React from "react";

interface ValueCardProps {
  image: string;
  title: string;
  description: string;
}

export const ValueCard: React.FC<ValueCardProps> = ({ image, title, description }) => {
  return (
    <article className="flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3 bg-bg-surface">
        <Image src={image} alt={title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
      </div>
      <div className="pt-5">
        <h3 className="font-heading text-[28px] font-medium leading-[1.1] tracking-display text-text-primary md:text-[30px]">{title}</h3>
        <p className="mt-3 text-sm leading-6 tracking-body text-text-secondary">{description}</p>
      </div>
    </article>
  );
};
