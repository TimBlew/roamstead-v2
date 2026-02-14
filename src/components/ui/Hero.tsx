import React from "react";
import Image from "next/image";

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
    <section className="relative w-full overflow-hidden h-[75vh] min-h-[520px] max-h-[820px]">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/15" />

      {/* content */}
      <div className="relative z-10 h-full">
        <div className="container-figma h-full flex flex-col items-center justify-start pt-16 md:pt-20">
          <div className="text-center max-w-[760px] mx-auto">

            {/* Headline */}
            <h1
              className="
                font-heading
                font-medium
                text-[44px]
                md:text-[72px]
                leading-[48px]
                md:leading-[72px]
                tracking-[-0.04em]
                text-text-dark-primary
                antialiased
              "
            >
              {headline}
            </h1>

            {/* Body */}
            <p
              className="
                mt-6
                text-[14px]
                md:text-[16px]
                leading-[20px]
                md:leading-[24px]
                text-text-dark-secondary
                antialiased
              "
            >
              {description}
            </p>

            {/* CTA — Exact Figma Hug */}
            <a
              href={ctaHref}
              className="
              mt-5
              inline-flex
              items-center
              justify-center
              bg-white
              text-text-primary
              border
              border-border-default
              text-[14px]
              leading-[20px]
              font-medium
              tracking-[-0.02em]
              px-3
              py-1.5
              hover:bg-bg-subtle
              transition-colors
            "
            >
              {ctaText}
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};
