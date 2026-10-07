import React from "react";

export const ValueStatement: React.FC = () => {
  return (
    <section className="bg-[#FFFCFB] px-5 pt-10 md:px-6 md:pt-16">
      <div className="mx-auto flex w-full max-w-[816px] flex-col items-center gap-4 text-center md:gap-6">
        <h2
          className="w-full font-heading text-[32px] font-medium leading-[35px] tracking-[-1.28px] text-[#1F3125] md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          Where Mountain Life Slows Down
        </h2>
        <p className="w-full max-w-[350px] font-body text-[16px] font-normal leading-6 tracking-[-0.32px] text-[#6D6057] md:max-w-none md:text-[20px] md:leading-8 md:tracking-[-0.4px]">
          Roamstead is a growing collection of places to stay in Heber Valley and the surrounding mountains. Each property is shaped by its setting, designed to feel intentional, welcoming, and easy to return to.
        </p>
      </div>
      <div className="h-5 md:h-6" />
    </section>
  );
};
