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
}) => {
  return (
    <section className="relative flex min-h-[510px] w-full items-start justify-center overflow-hidden px-5 text-center md:h-[752px] md:px-6">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/52 via-black/20 to-black/10 md:from-black/60 md:to-transparent" />

      <div className="relative z-10 flex w-full max-w-[1000px] flex-col items-center pt-12 md:pt-[76px]">
        <h1
          className="w-full max-w-[330px] font-heading text-[42px] font-medium leading-[43px] tracking-[-1.68px] text-[#E8F5EC] sm:max-w-none md:text-[88px] md:leading-[96px] md:tracking-[-3.52px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          {headline}
        </h1>

        <p className="mt-5 w-full max-w-[340px] font-body text-[16px] font-normal leading-6 tracking-[-0.32px] text-[#E8F5EC] sm:max-w-[560px] md:mt-6 md:max-w-none md:text-[20px] md:leading-8 md:tracking-[-0.4px]">
          {description}
        </p>

        <a
          href={ctaHref}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2 border border-white/60 bg-white/95 px-5 py-2.5 font-body text-[15px] font-medium leading-6 tracking-[-0.3px] text-[#291D16] shadow-sm transition-colors hover:bg-white md:mt-8 md:h-[56px] md:min-w-[188px] md:rounded-none md:border-[#D8CCC4] md:bg-[#FEFDFC] md:px-6 md:text-[16px] md:tracking-[-0.32px]"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
};
