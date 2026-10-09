import React from "react";
import { ValueCard } from "../ui/ValueCard";

export const ValueCards: React.FC = () => {
  const values = [
    {
      image: "/images/community-first.jpg",
      title: "Gather round",
      description:
        "A table for everyone, a fire to sit around, and a plan for tomorrow. The best trips leave room for people.",
    },
    {
      image: "/images/four-season.jpg",
      title: "Four seasons, no off-season",
      description:
        "Winter powder. Summer singletrack. Fall color. Even mud season, and we mean that. Every week up here is a good one.",
    },
    {
      image: "/images/local-nature.jpg",
      title: "Local by nature",
      description:
        "We send you to the bakery, the bike shop, and the river outfitter down the road. The valley's best parts are run by our neighbors.",
    },
  ];

  return (
    <section className="bg-[#FFFCFB] px-4 pb-4 md:px-6 md:pb-12">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 md:grid md:grid-cols-3 md:items-stretch md:gap-4">
        {values.map((value) => (
          <ValueCard key={value.title} {...value} />
        ))}
      </div>

      <div className="mx-auto mt-5 flex w-full max-w-[1440px] justify-center md:mt-6">
        <a
          href="/properties"
          className="inline-flex h-9 min-w-[164px] items-center justify-center rounded-[10px] bg-[#4A6E57] px-4 font-body text-[12.5px] font-medium leading-5 tracking-[-0.25px] text-[#FFFCFB] shadow-[0_7px_18px_rgba(74,110,87,0.16)] transition-all hover:-translate-y-px hover:bg-[#3C6049] md:mx-auto md:flex md:h-10 md:min-w-[168px] md:w-fit md:rounded-none md:px-6 md:py-2 md:text-[16px] md:leading-6 md:tracking-[-0.32px] md:shadow-none"
        >
          Find your stay
        </a>
      </div>
    </section>
  );
};
