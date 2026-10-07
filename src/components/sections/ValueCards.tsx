import React from "react";
import { Container, Section } from "../layout/Container";
import { ValueCard } from "../ui/ValueCard";

export const ValueCards: React.FC = () => {
  const values = [
    { image: "/images/community-first.jpg", title: "Made for gathering", description: "Homes with room for the table, the fire, the gear, and the people who make the trip worth taking." },
    { image: "/images/four-season.jpg", title: "Built for all four seasons", description: "Winter powder, summer trails, shoulder-season quiet, and the slower days in between all belong here." },
    { image: "/images/local-nature.jpg", title: "Connected to the valley", description: "Each stay is rooted in Heber Valley and Park City, close to the places people actually come here to experience." },
  ];

  return (
    <Section background="canvas">
      <Container maxWidth="figma">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-5">
          {values.map((value) => <ValueCard key={value.title} {...value} />)}
        </div>
      </Container>
    </Section>
  );
};
