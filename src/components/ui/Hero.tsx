import React from "react";
import Image from "next/image";

interface HeroProps {
  backgroundImage: string;
  headline: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  mobileSupplement?: string;
}

export const Hero: React.FC<HeroProps> = ({
  backgroundImage,
  headline,
  description,
  ctaText,
  ctaHref,
  mobileSupplement,
}) => {
  return (
    <section className="relative flex h-[600px] w-full flex-col items-center overflow-hidden px-6 text-center md:h-[752px]">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />

      <div className="relative z-10 flex w-full max-w-[1040px] flex-col items-center pt-[52px] md:pt-[54px]">
      <h1
        className="w-full max-w-[820px] font-heading text-[48px] font-medium leading-[50px] tracking-[-1.92px] text-[#E8F5EC] md:text-[72px] md:leading-[72px] md:tracking-[-2.88px]"
        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
      >
        {headline}
      </h1>

      <p className="mt-7 w-full max-w-[1000px] font-body text-[18px] font-normal leading-7 tracking-[-0.36px] text-[#E8F5EC] md:mt-8 md:text-[20px] md:leading-8 md:tracking-[-0.4px]">
        {description}
        {mobileSupplement ? (
          <span className="md:hidden">
            <br />
            {mobileSupplement}
          </span>
        ) : null}
      </p>

      <a
        href={ctaHref}
        className="mt-8 inline-flex h-[60px] min-w-[196px] items-center justify-center border border-[#D8CCC4] bg-[#FEFDFC] px-8 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#291D16] transition-colors hover:bg-[#F4EFEC] md:mt-9"
      >
        {ctaText}
      </a>
      </div>
    </section>
  );
};
