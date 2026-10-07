import React from "react";
import { Container } from "../layout/Container";
import { ValueCard } from "../ui/ValueCard";
import { Button } from "../ui/Button";

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
    <section className="bg-bg-canvas pb-20 pt-0 md:pb-24">
      <Container maxWidth="figma">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-5">
          {values.map((value) => (
            <ValueCard key={value.title} {...value} />
          ))}
        </div>

        <div className="mt-8 text-center md:mt-10">
          <Button variant="primary" href="/properties">
            Check availability
          </Button>
        </div>
      </Container>
    </section>
  );
};
