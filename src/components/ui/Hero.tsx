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
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="container-figma relative z-10 flex min-h-[680px] items-start justify-center pt-14 text-center md:min-h-[760px] md:pt-16 lg:min-h-[820px] lg:pt-18">
        <div className="mx-auto max-w-[900px]">
          <h1 className="font-heading text-[48px] font-medium leading-[1.02] tracking-display text-white sm:text-[58px] md:text-[68px] lg:text-[76px]">
            {headline}
          </h1>
          <p className="mx-auto mt-7 max-w-[760px] text-base leading-7 tracking-body text-white/95 md:text-[18px] md:leading-8">
            {description}
          </p>
          <div className="mt-7">
            <Button
              href={ctaHref}
              variant="secondary"
              className="border-white bg-white text-text-primary hover:bg-bg-subtle"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
