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
  ctaLabel?: string;
}

export const PrimaryProperty: React.FC<PrimaryPropertyProps> = ({
  image,
  location,
  name,
  description,
  badge,
  href,
  external = false,
  ctaLabel = "Check availability",
}) => {
  return (
    <article className="flex w-full flex-col gap-2 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-end md:gap-6 md:rounded-[12px] md:border md:border-[#E1D7D1] md:bg-[#FBF8F7] md:p-4">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="relative h-[185px] w-full shrink-0 overflow-hidden rounded-[18px] md:h-[500px] md:rounded-[8px] md:border md:border-[#D8CCC4]"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover object-[center_46%]"
        />
      </a>

      <div className="flex min-w-0 flex-1 flex-col items-start md:gap-2">
        <p className="font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#8F7E73] md:w-full md:text-[16px] md:leading-6 md:tracking-[-0.32px] md:text-[#6D6057]">
          {location.replace(", Utah", "")}
        </p>
        <h3
          className="mt-0.5 font-heading text-[27px] font-medium leading-[32px] tracking-[-1.08px] text-[#1F3125] md:mt-0 md:w-full md:text-[44px] md:leading-[48px] md:tracking-[-1.76px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          <a href={href}>{name}</a>
        </h3>
        <p className="mt-1 font-body text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-[#6D6057] md:mt-0 md:w-full md:text-[18px] md:leading-7 md:tracking-[-0.36px]">
          {description}
        </p>
        {badge ? (
          <p className="mt-1 font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#291D16] md:mt-0 md:w-full md:text-[20px] md:leading-8 md:tracking-[-0.4px]">
            {badge}
          </p>
        ) : null}
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-2 inline-flex h-7 items-center justify-center rounded-[8px] bg-[#4A6E57] px-3.5 font-body text-[12px] font-medium leading-none tracking-[-0.22px] text-[#FFFCFB] shadow-[0_2px_8px_rgba(74,110,87,0.08)] transition-colors hover:bg-[#3C6049] md:mt-0 md:h-9 md:w-auto md:rounded-none md:px-5 md:py-0 md:text-[14px] md:leading-5 md:tracking-[-0.32px]"
        >
          {ctaLabel}
        </a>
      </div>
    </article>
  );
};
