import React from "react";
import Image from "next/image";
import { Button } from "./Button";

interface HeroProps {
  backgroundImage: string;
  headline: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

export const Hero: React.FC<HeroProps> = ({
  backgroundImage,
  headline,
  description,
  ctaText,
  ctaHref,
}) => {
  return (
    <section className="relative min-h-[680px] w-full overflow-hidden md:min-h-[760px] lg:min-h-[820px]">
      <Image src={backgroundImage} alt="" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/45" />

      <div className="container-figma relative z-10 flex min-h-[680px] items-end pb-12 pt-24 md:min-h-[760px] md:pb-16 lg:min-h-[820px] lg:pb-20">
        <div className="max-w-[760px]">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-white/85 md:text-sm">
            Heber Valley · Park City · Deer Valley
          </p>
          <h1 className="max-w-[720px] font-heading text-[48px] font-medium leading-[0.98] tracking-display text-white sm:text-[58px] md:text-[68px] lg:text-[76px]">
            {headline}
          </h1>
          <p className="mt-5 max-w-[650px] text-base leading-7 tracking-body text-white/90 md:text-lg md:leading-8">{description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={ctaHref} variant="secondary" className="border-white/70 bg-white text-text-primary hover:bg-bg-subtle">{ctaText}</Button>
            <a href="#stays" className="inline-flex min-h-10 items-center justify-center rounded-2 border border-white/45 px-4 py-2 text-sm font-medium tracking-body text-white transition-colors hover:bg-white/10">
              Explore the stays
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
