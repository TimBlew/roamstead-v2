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
    <article className="flex w-full flex-col gap-2.5 md:grid md:grid-cols-[1.45fr_0.8fr] md:items-stretch md:gap-0 md:overflow-hidden md:rounded-[22px] md:border md:border-[#E1D7D1] md:bg-[#FBF8F7]">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="relative h-[185px] w-full shrink-0 overflow-hidden rounded-[18px] md:h-[360px] md:w-full md:rounded-none"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
        />
      </a>

      <div className="flex min-w-0 flex-1 flex-col items-start justify-center md:p-8 lg:p-10">
        <p className="font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#8F7E73] md:w-full md:text-[16px] md:leading-6 md:tracking-[-0.32px] md:text-[#6D6057]">
          {location.replace(", Utah", "")}
        </p>
        <h3
          className="mt-0.5 font-heading text-[27px] font-medium leading-[34px] tracking-[-1.2px] text-[#1F3125] md:w-full md:text-[44px] md:leading-[48px] md:tracking-[-1.76px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          <a href={href}>{name}</a>
        </h3>
        <p className="mt-1.5 font-body text-[14px] font-normal leading-[21px] tracking-[-0.3px] text-[#6D6057] md:w-full md:text-[18px] md:leading-7 md:tracking-[-0.36px]">
          {description}
        </p>
        {badge ? (
          <p className="mt-1.5 font-body text-[13px] font-medium leading-5 tracking-[-0.3px] text-[#291D16] md:w-full md:text-[20px] md:leading-8 md:tracking-[-0.4px]">
            {badge}
          </p>
        ) : null}
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-3 inline-flex h-9 items-center justify-center rounded-[10px] bg-[#4A6E57] px-4 font-body text-[12.5px] font-medium leading-5 tracking-[-0.28px] text-[#FFFCFB] transition-colors hover:bg-[#3C6049] md:h-10 md:w-fit md:px-5 md:text-[15px] md:leading-6 md:tracking-[-0.3px]"
        >
          See the stay
        </a>
      </div>
    </article>
  );
};
