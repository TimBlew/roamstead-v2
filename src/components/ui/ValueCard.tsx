import Image from "next/image";
import React from "react";

interface ValueCardProps {
  image: string;
  title: string;
  description: string;
}

export const ValueCard: React.FC<ValueCardProps> = ({ image, title, description }) => {
  return (
    <article className="flex h-[452px] flex-col items-start justify-end gap-4 rounded-4 md:h-[460px]">
      <div className="relative h-[320px] w-full shrink-0 overflow-hidden rounded-3">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <h3
          className="w-full font-heading text-[28px] font-medium leading-[36px] tracking-[-1.12px] text-[#1F3125] md:text-[36px] md:leading-[44px] md:tracking-[-1.44px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          {title}
        </h3>
        <p className="w-full font-body text-[16px] font-normal leading-6 tracking-[-0.32px] text-[#6D6057]">
          {description}
        </p>
      </div>
    </article>
  );
};
