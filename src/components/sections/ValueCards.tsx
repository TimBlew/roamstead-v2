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
    <section className="bg-[#FFFCFB] px-4 pb-0 md:px-6 md:pb-0">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 md:grid md:grid-cols-3 md:items-stretch md:gap-4">
        {values.map((value) => (
          <ValueCard key={value.title} {...value} />
        ))}
      </div>

    </section>
  );
};
