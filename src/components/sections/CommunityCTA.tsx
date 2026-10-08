import React from "react";

export const CommunityCTA: React.FC = () => {
  return (
    <section className="flex w-full flex-col items-center bg-[#F4EFEC] px-5 pb-7 pt-5 text-center md:gap-4 md:px-6 md:py-16">
      <div className="w-full max-w-[320px] md:max-w-[816px]">
        <div className="mx-auto w-[226px] md:w-[286px]">
          <img
            src="/roamstead-collective-logo.svg"
            alt="Roamstead"
            className="block w-full"
          />
          <div
            aria-label="Collective"
            className="mt-[-2px] flex w-full justify-between pl-[3px] pr-[1px] font-body text-[10px] font-medium uppercase leading-none tracking-[0] text-[#4A6E57] md:mt-[-1px] md:pl-[4px] md:text-[12px]"
          >
            {"COLLECTIVE".split("").map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>
        </div>
      </div>

      <h2
        className="mt-4 w-full max-w-[320px] font-heading text-[30px] font-medium leading-[32px] tracking-[-1.2px] text-[#291D16] md:mt-0 md:max-w-[816px] md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
      >
        A new community is forming
      </h2>

      <p className="mt-2 w-full max-w-[330px] font-body text-[14.5px] font-normal leading-[21px] tracking-[-0.29px] text-[#6D6057] md:mt-0 md:max-w-[816px] md:text-[20px] md:leading-[32px] md:tracking-[-0.4px]">
        Roamstead Collective is for the 4-Seasoners. The ones who know that familiarity beats novelty. That the best places are the ones you return to. If that sounds like you, you’re already part of it.
      </p>

      <a
        href="mailto:chris@roamstead-co.com?subject=Roamstead%20Collective"
        className="mt-4 inline-flex h-9 items-center justify-center rounded-[8px] border border-[#D8CCC4] bg-[#FEFDFC] px-4 font-body text-[12.5px] font-medium leading-none tracking-[-0.22px] text-[#291D16] shadow-[0_3px_10px_rgba(41,29,22,0.04)] transition-colors hover:bg-white md:mt-0 md:h-10 md:w-fit md:rounded-none md:px-4 md:py-2 md:text-[16px] md:tracking-[-0.32px]"
      >
        Join the Waitlist
      </a>
    </section>
  );
};
