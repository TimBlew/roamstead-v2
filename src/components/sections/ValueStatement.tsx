import copy from "@/data/admin-copy.json";
import React from "react";

export const ValueStatement: React.FC = () => {
  return (
    <section className="bg-[#FFFCFB] px-4 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto flex w-full max-w-[816px] flex-col items-center gap-2.5 text-center md:gap-4">
        <h2
          className="w-full font-heading text-[29px] font-medium leading-[32px] tracking-[-1.28px] text-[#1F3125] md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          {copy.homepage.intro.title}
        </h2>
        <p className="w-full max-w-[386px] font-body text-[14.5px] font-normal leading-[21px] tracking-[-0.32px] text-[#6D6057] md:max-w-none md:text-[20px] md:leading-8 md:tracking-[-0.4px]">
          {copy.homepage.intro.body}
        </p>
      </div>
      <div className="h-4 md:h-5" />
    </section>
  );
};
