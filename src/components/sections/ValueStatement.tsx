import React from "react";

export const ValueStatement: React.FC = () => {
  return (
    <section className="bg-[#FFFCFB] px-6 pt-16">
      <div className="mx-auto flex w-full max-w-[816px] flex-col items-center gap-6 text-center">
        <h2
          className="w-full font-heading text-[40px] font-medium leading-[44px] tracking-[-1.6px] text-[#1F3125] md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          Where Mountain Life Slows Down
        </h2>
        <p className="w-full font-body text-[20px] font-normal leading-8 tracking-[-0.4px] text-[#6D6057]">
          Roamstead is a growing collection of places to stay in Heber Valley and the surrounding mountains. Each property is shaped by its setting, designed to feel intentional, welcoming, and easy to return to.
        </p>
      </div>
      <div className="h-6" />
    </section>
  );
};
