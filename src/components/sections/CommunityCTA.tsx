import React from "react";

export const CommunityCTA: React.FC = () => {
  return (
    <section className="flex w-full flex-col items-center bg-[#F4EFEC] px-5 py-7 text-center md:gap-4 md:px-6 md:py-16">
      <div className="flex w-full max-w-[816px] flex-col items-center gap-1.5 md:gap-2">
        <div className="h-[44px] w-[148px] overflow-hidden md:h-[80px] md:w-[269px]">
          <img
            src="/roamstead-collective-logo.svg"
            alt="Roamstead"
            className="block h-full w-full max-w-none"
          />
        </div>

        <p
          className="w-full text-center font-heading text-[13px] font-medium leading-none tracking-[10px] text-[#4A6E57] md:text-[20px] md:tracking-[18px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          COLLECTIVE
        </p>
      </div>

      <h2
        className="mt-4 w-full max-w-[816px] font-heading text-[32px] font-medium leading-[35px] tracking-[-1.28px] text-[#291D16] md:mt-0 md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
      >
        A new community is forming
      </h2>

      <p className="mt-3 w-full max-w-[350px] font-body text-[16px] font-normal leading-6 tracking-[-0.32px] text-[#6D6057] md:mt-0 md:max-w-[816px] md:text-[20px] md:leading-[32px] md:tracking-[-0.4px]">
        Roamstead Collective is for the 4-Seasoners. The ones who know that familiarity beats novelty. That the best places are the ones you return to. If that sounds like you, you’re already part of it.
      </p>

      <a
        href="mailto:chris@roamstead-co.com?subject=Roamstead%20Collective"
        className="mt-4 inline-flex min-h-10 items-center justify-center rounded-2 border border-[#D8CCC4] bg-[#FEFDFC] px-5 py-2.5 font-body text-[15px] font-medium leading-6 tracking-[-0.3px] text-[#291D16] transition-colors hover:bg-white md:mt-0 md:h-10 md:w-fit md:rounded-none md:px-4 md:py-2 md:text-[16px] md:tracking-[-0.32px]"
      >
        Join the Waitlist
      </a>
    </section>
  );
};
