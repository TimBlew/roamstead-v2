import React from "react";

interface TextHeroProps {
  title: string;
  description: string;
  tagline?: string;
  label?: string;
}

export const TextHero: React.FC<TextHeroProps> = ({
  title,
  description,
  tagline,
  label = "Our Properties",
}) => {
  return (
    <section className="flex w-full flex-col items-center gap-6 bg-[#FFFCFB] px-6 py-16 text-center">
      <div className="inline-flex h-[34px] items-center justify-center border border-[#D8CCC4] px-6 py-2">
        <p className="font-body text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-[#1F3125]">
          {label}
        </p>
      </div>

      <h1
        className="w-full max-w-[720px] font-heading text-[72px] font-medium leading-[72px] tracking-[-2.88px] text-[#1F3125]"
        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
      >
        {title}
      </h1>

      <div className="w-full max-w-[720px] font-body text-[20px] font-normal leading-8 tracking-[-0.4px] text-[#6D6057]">
        <p>{description}</p>
        {tagline ? (
          <>
            <div className="h-8" />
            <p>{tagline}</p>
          </>
        ) : null}
      </div>
    </section>
  );
};
