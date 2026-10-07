import React from "react";

export const CommunityCTA: React.FC = () => {
  return (
    <section className="flex w-full flex-col items-center gap-4 bg-[#F4EFEC] px-6 py-16 text-center">
      <div className="flex w-full max-w-[816px] flex-col items-center gap-2">
        <div className="h-[80px] w-[269px] overflow-hidden">
          <img
            src="/roamstead-collective-logo.svg"
            alt="Roamstead"
            className="block h-full w-full max-w-none scale-x-[1.185]"
          />
        </div>

        <p
          className="w-full font-heading text-[20px] font-medium leading-none tracking-[18px] text-[#4A6E57]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          COLLECTIVE
        </p>
      </div>

      <h2
        className="w-full max-w-[816px] font-heading text-[48px] font-medium leading-[54px] tracking-[-1.92px] text-[#291D16]"
        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
      >
        A new community is forming
      </h2>

      <p className="w-full max-w-[816px] font-body text-[20px] font-normal leading-[32px] tracking-[-0.4px] text-[#6D6057]">
        Roamstead Collective is for the 4-Seasoners. The ones who know that familiarity beats novelty. That the best places are the ones you return to. If that sounds like you, you’re already part of it.
      </p>

      <a
        href="mailto:chris@roamstead-co.com?subject=Roamstead%20Collective"
        className="inline-flex items-center justify-center border border-[#D8CCC4] bg-[#FEFDFC] px-4 py-2 font-body text-[16px] font-medium leading-[24px] tracking-[-0.32px] text-[#291D16] transition-colors hover:bg-[#F4EFEC]"
      >
        Join the Waitlist
      </a>
    </section>
  );
};
