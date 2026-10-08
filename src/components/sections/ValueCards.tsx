import React from "react";
import { ValueCard } from "../ui/ValueCard";

export const ValueCards: React.FC = () => {
  const values = [
    {
      image: "/images/community-first.jpg",
      title: "Community first",
      description:
        "We design spaces that encourage gathering: around a table, a fire, or a shared plan for tomorrow. The best stays leave room for people.",
    },
    {
      image: "/images/four-season.jpg",
      title: "Four-season living",
      description:
        "We’re here for winter powder and summer singletrack. Mud season. Quiet weeks. Full parking lots and empty trails. The whole year matters.",
    },
    {
      image: "/images/local-nature.jpg",
      title: "Local by nature",
      description:
        "Roamstead stays are shaped by their surroundings and the people who live there. We pay attention to the rhythms of the valley, not outside expectations.",
    },
  ];

  return (
    <section className="bg-[#FFFCFB] px-4 pb-4 md:px-6 md:pb-16">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 md:grid md:grid-cols-3 md:items-start md:gap-4">
        {values.map((value) => (
          <ValueCard key={value.title} {...value} />
        ))}
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-[1440px] justify-center md:mt-6">
        <a
          href="/properties"
          className="inline-flex h-9 min-w-[164px] items-center justify-center rounded-[10px] bg-[#4A6E57] px-4 font-body text-[12.5px] font-medium leading-5 tracking-[-0.25px] text-[#FFFCFB] shadow-[0_7px_18px_rgba(74,110,87,0.16)] transition-all hover:-translate-y-px hover:bg-[#3C6049] md:mx-auto md:flex md:h-10 md:min-w-[168px] md:w-fit md:rounded-none md:px-6 md:py-2 md:text-[16px] md:leading-6 md:tracking-[-0.32px] md:shadow-none"
        >
          Check availability
        </a>
      </div>
    </section>
  );
};
