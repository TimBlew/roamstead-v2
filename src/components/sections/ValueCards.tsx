import copy from "@/data/admin-copy.json";
import React from "react";
import { ValueCard } from "../ui/ValueCard";

export const ValueCards: React.FC = () => {
  const values = [
    {
      image: "/images/community-first.jpg",
      title: copy.homepage.pillars[0].title,
      description:
        copy.homepage.pillars[0].body,
    },
    {
      image: "/images/four-season.jpg",
      title: copy.homepage.pillars[1].title,
      description:
        copy.homepage.pillars[1].body,
    },
    {
      image: "/images/local-nature.jpg",
      title: copy.homepage.pillars[2].title,
      description:
        copy.homepage.pillars[2].body,
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
