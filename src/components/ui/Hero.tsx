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
    <section className="relative flex min-h-[400px] w-full items-start justify-center overflow-hidden px-5 text-center md:h-[752px] md:px-6">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-[center_38%] md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/24 to-black/12 md:from-black/60 md:via-black/20 md:to-transparent" />
      <div className="absolute inset-x-0 top-[24%] h-[58%] bg-[radial-gradient(ellipse_at_center,rgba(12,22,18,0.39)_0%,rgba(12,22,18,0.15)_48%,transparent_78%)] md:hidden" />

      <div className="relative z-10 flex w-full max-w-[1180px] flex-col items-center pt-[24px] md:pt-[86px]">
        <h1
          className="w-full max-w-[350px] font-heading text-[39px] font-medium leading-[1.12] tracking-[-1.6px] text-[#F2F7F1] [text-shadow:0_2px_3px_rgba(8,20,15,0.25),0_7px_26px_rgba(8,20,15,0.55)] sm:max-w-none sm:text-[clamp(45px,5.2vw,78px)] md:leading-[1.13] md:tracking-[-0.045em]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          {headlineLines ? headlineLines.map((line) => <span key={line} className="block sm:whitespace-nowrap">{line}</span>) : headline}
        </h1>

        <p className="relative mt-[16px] w-full max-w-[365px] px-[2px] font-body text-[14px] font-medium leading-[1.58] tracking-[-0.18px] text-[#F8FAF5] [text-shadow:0_1px_2px_rgba(9,19,15,0.65),0_3px_12px_rgba(9,19,15,0.62),0_0_22px_rgba(232,247,238,0.20)] sm:max-w-[850px] md:mt-7 md:max-w-[900px] md:text-[19px] md:font-normal md:leading-[1.58] md:tracking-[-0.25px]">
          {descriptionLines ? descriptionLines.map((line, index) => <span key={line} className={`block ${index > 0 ? "mt-[10px] md:mt-0" : ""}`}>{line}</span>) : description}
        </p>

        <a
          href={ctaHref}
          className="mt-[20px] inline-flex h-[48px] min-w-[154px] items-center justify-center rounded-[8px] border border-white/80 bg-[#FFFCFB] px-[28px] font-body text-[15px] font-semibold leading-none tracking-[-0.25px] text-[#253329] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_5px_rgba(9,22,16,0.12),0_12px_30px_rgba(9,22,16,0.24)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-[2px] hover:bg-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_5px_12px_rgba(9,22,16,0.15),0_16px_34px_rgba(9,22,16,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-0 md:mt-8 md:h-[52px] md:min-w-[176px] md:px-[30px] md:text-[16px]"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
};
