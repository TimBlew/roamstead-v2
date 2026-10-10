import React from "react";
import Image from "next/image";

interface HeroProps {
  backgroundImage: string;
  headline: string;
  description: string;
  headlineLines?: string[];
  descriptionLines?: string[];
  ctaText: string;
  ctaHref: string;
  mobileSupplement?: string;
}

export const Hero: React.FC<HeroProps> = ({
  backgroundImage,
  headline,
  description,
  headlineLines,
  descriptionLines,
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

      <div className="relative z-10 flex w-full max-w-[1180px] flex-col items-center pt-9 md:pt-[86px]">
        <h1
          className="w-full max-w-[350px] font-heading text-[39px] font-medium leading-[1.12] tracking-[-1.6px] text-[#E8F5EC] [text-shadow:0_2px_18px_rgba(0,0,0,0.35)] sm:max-w-none sm:text-[clamp(45px,5.2vw,78px)] md:leading-[1.13] md:tracking-[-0.045em]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          {headlineLines ? headlineLines.map((line) => <span key={line} className="block sm:whitespace-nowrap">{line}</span>) : headline}
        </h1>

        <p className="mt-5 w-full max-w-[335px] font-body text-[14.5px] font-normal leading-[1.55] tracking-[-0.3px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.42)] sm:max-w-[850px] md:mt-7 md:max-w-[1100px] md:text-[19px] md:leading-[1.6] md:tracking-[-0.3px] md:text-[#E8F5EC]">
          {descriptionLines ? descriptionLines.map((line) => <span key={line} className="block">{line}</span>) : description}
        </p>

        <a
          href={ctaHref}
          className="mt-3 inline-flex h-8 min-w-[126px] items-center justify-center rounded-[8px] border border-white bg-[#FFFCFB] px-4 font-body text-[12px] font-medium leading-none tracking-[-0.2px] text-[#291D16] shadow-[0_5px_16px_rgba(0,0,0,0.16)] transition-all hover:-translate-y-px hover:bg-white md:mt-8 md:h-[56px] md:min-w-[188px] md:rounded-none md:border-[#D8CCC4] md:bg-[#FEFDFC] md:px-6 md:text-[16px] md:leading-6 md:tracking-[-0.32px]"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
};
