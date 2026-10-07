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
    <section className="relative flex min-h-[455px] w-full items-start justify-center overflow-hidden px-5 text-center md:h-[752px] md:px-6">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/24 to-black/12 md:from-black/60 md:via-black/20 md:to-transparent" />
      <div className="absolute inset-x-0 top-[24%] h-[58%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.28),transparent_72%)] md:hidden" />

      <div className="relative z-10 flex w-full max-w-[1000px] flex-col items-center pt-9 md:pt-[76px]">
        <h1
          className="w-full max-w-[330px] font-heading text-[40px] font-medium leading-[41px] tracking-[-1.6px] text-[#E8F5EC] [text-shadow:0_2px_18px_rgba(0,0,0,0.35)] sm:max-w-none md:text-[88px] md:leading-[96px] md:tracking-[-3.52px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          {headline}
        </h1>

        <p className="mt-4 w-full max-w-[346px] font-body text-[15px] font-normal leading-[23px] tracking-[-0.3px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.42)] sm:max-w-[560px] md:mt-6 md:max-w-none md:text-[20px] md:leading-8 md:tracking-[-0.4px] md:text-[#E8F5EC]">
          {description}
        </p>

        <a
          href={ctaHref}
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-2 border border-white/70 bg-white/95 px-5 py-2 font-body text-[14px] font-medium leading-5 tracking-[-0.28px] text-[#291D16] shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-colors hover:bg-white md:mt-8 md:h-[56px] md:min-w-[188px] md:rounded-none md:border-[#D8CCC4] md:bg-[#FEFDFC] md:px-6 md:text-[16px] md:leading-6 md:tracking-[-0.32px]"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
};
