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
    <section className="bg-[#FFFCFB] px-6 pb-16">
      <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-3">
        {values.map((value) => (
          <ValueCard key={value.title} {...value} />
        ))}
      </div>

      <div className="mt-6">
        <a
          href="/properties"
          className="flex h-10 w-full items-center justify-center bg-[#4A6E57] px-6 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#FFFCFB] transition-colors hover:bg-[#3C6049] md:mx-auto md:w-fit"
        >
          Check availability
        </a>
      </div>
    </section>
  );
};
