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
    <section className="relative flex h-[600px] w-full flex-col items-center gap-6 overflow-hidden px-6 py-16 text-center md:h-[752px]">
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

      <h1
        className="relative z-10 w-full max-w-[720px] font-heading text-[48px] font-medium leading-[54px] tracking-[-1.92px] text-[#E8F5EC] md:text-[72px] md:leading-[72px] md:tracking-[-2.88px]"
        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
      >
        {headline}
      </h1>

      <p className="relative z-10 w-full max-w-[720px] font-body text-[18px] font-normal leading-7 tracking-[-0.36px] text-[#E8F5EC]">
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
        className="relative z-10 inline-flex h-10 items-center justify-center border border-[#D8CCC4] bg-[#FEFDFC] px-4 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#291D16] transition-colors hover:bg-[#F4EFEC]"
      >
        {ctaText}
      </a>
    </section>
  );
};
