import React from "react";
import Image from "next/image";

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
  image,
  location,
  name,
  description,
  badge,
  href,
  external = false,
}) => {
  return (
    <article className="flex w-full flex-col items-start justify-end gap-6 rounded-3 bg-[#FBF8F7] p-3 md:h-[532px] md:flex-row md:items-end md:border md:border-[#E1D7D1] md:p-4">
      <div className="relative h-[340px] w-full shrink-0 overflow-hidden rounded-2 border border-[#D8CCC4] md:h-[500px] md:w-[66.23%]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <p className="w-full font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#6D6057]">
          {location.replace(", Utah", "")}
        </p>
        <h3
          className="w-full font-heading text-[36px] font-medium leading-[40px] tracking-[-1.44px] text-[#1F3125] md:text-[44px] md:leading-[48px] md:tracking-[-1.76px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          {name}
        </h3>
        <p className="w-full font-body text-[18px] font-normal leading-7 tracking-[-0.36px] text-[#6D6057]">
          {description}
        </p>
        {badge ? (
          <p className="w-full font-body text-[20px] font-medium leading-8 tracking-[-0.4px] text-[#291D16]">
            {badge}
          </p>
        ) : null}
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="flex h-10 w-full items-center justify-center bg-[#4A6E57] px-6 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#FFFCFB] transition-colors hover:bg-[#3C6049] md:w-fit"
        >
          Explore the stay
        </a>
      </div>
    </article>
  );
};
