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
    <article className="flex w-full flex-col gap-4 md:h-[532px] md:flex-row md:items-end md:gap-6 md:rounded-3 md:border md:border-[#E1D7D1] md:bg-[#FBF8F7] md:p-4">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="relative h-[230px] w-full shrink-0 overflow-hidden rounded-[18px] md:h-[500px] md:w-[66.23%] md:rounded-2 md:border md:border-[#D8CCC4]"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
        />
      </a>

      <div className="flex min-w-0 flex-1 flex-col items-start">
        <p className="font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#8F7E73] md:w-full md:text-[16px] md:leading-6 md:tracking-[-0.32px] md:text-[#6D6057]">
          {location.replace(", Utah", "")}
        </p>
        <h3
          className="mt-1 font-heading text-[30px] font-medium leading-[34px] tracking-[-1.2px] text-[#1F3125] md:w-full md:text-[44px] md:leading-[48px] md:tracking-[-1.76px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          <a href={href}>{name}</a>
        </h3>
        <p className="mt-2 font-body text-[15px] font-normal leading-6 tracking-[-0.3px] text-[#6D6057] md:w-full md:text-[18px] md:leading-7 md:tracking-[-0.36px]">
          {description}
        </p>
        {badge ? (
          <p className="mt-2 font-body text-[15px] font-medium leading-6 tracking-[-0.3px] text-[#291D16] md:w-full md:text-[20px] md:leading-8 md:tracking-[-0.4px]">
            {badge}
          </p>
        ) : null}
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-3 inline-flex min-h-10 items-center justify-center rounded-2 bg-[#4A6E57] px-4 py-2 font-body text-[14px] font-medium leading-5 tracking-[-0.28px] text-[#FFFCFB] transition-colors hover:bg-[#3C6049] md:h-10 md:w-fit md:rounded-none md:px-6 md:text-[16px] md:leading-6 md:tracking-[-0.32px]"
        >
          View property
        </a>
      </div>
    </article>
  );
};
