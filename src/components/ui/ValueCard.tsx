import Image from "next/image";
import React from "react";

interface ValueCardProps {
  image: string;
  title: string;
  description: string;
}

export const ValueCard: React.FC<ValueCardProps> = ({ image, title, description }) => {
  return (
    <article className="grid grid-cols-[116px_minmax(0,1fr)] items-center gap-3 md:flex md:h-auto md:flex-col md:items-start md:justify-start md:gap-4">
      <div className="relative h-[116px] w-[116px] shrink-0 overflow-hidden rounded-[15px] md:aspect-[1.45] md:h-auto md:w-full md:rounded-3">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 768px) 33vw, 116px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        <h3
          className="font-heading text-[23px] font-medium leading-[26px] tracking-[-0.96px] text-[#1F3125] md:text-[36px] md:leading-[44px] md:tracking-[-1.44px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          {title}
        </h3>
        <p className="mt-1 font-body text-[13.5px] font-normal leading-[19px] tracking-[-0.28px] text-[#6D6057] md:mt-2 md:text-[16px] md:leading-6 md:tracking-[-0.32px]">
          {description}
        </p>
      </div>
    </article>
  );
};
