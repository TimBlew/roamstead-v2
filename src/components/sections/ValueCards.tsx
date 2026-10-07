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
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 md:grid md:grid-cols-3 md:items-start md:gap-8">
        {values.map((value) => (
          <ValueCard key={value.title} {...value} />
        ))}
      </div>

      <div className="mx-auto mt-3 w-full max-w-[1440px] md:mt-8">
        <a
          href="/properties"
          className="inline-flex min-h-9 items-center justify-center rounded-[12px] bg-[#4A6E57] px-4 py-1.5 font-body text-[13px] shadow-[0_8px_20px_rgba(74,110,87,0.16)] font-medium leading-6 tracking-[-0.3px] text-[#FFFCFB] transition-colors hover:bg-[#3C6049] md:mx-auto md:flex md:h-[60px] md:min-w-[196px] md:w-fit md:rounded-none md:px-8 md:text-[16px] md:tracking-[-0.32px]"
        >
          Check availability
        </a>
      </div>
    </section>
  );
};
