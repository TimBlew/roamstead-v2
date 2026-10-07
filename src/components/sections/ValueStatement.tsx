import React from "react";
import { Container } from "../layout/Container";

export const ValueStatement: React.FC = () => {
  return (
    <section className="bg-bg-canvas pb-8 pt-20 md:pb-10 md:pt-24">
      <Container maxWidth="figma">
        <div className="mx-auto max-w-[920px] text-center">
          <h2 className="font-heading text-h2 font-medium tracking-display text-text-primary">
            Where Mountain Life Slows Down
          </h2>
          <p className="mx-auto mt-5 max-w-[860px] text-base leading-7 tracking-body text-text-secondary md:text-lg md:leading-8">
            Roamstead is a growing collection of places to stay in Heber Valley and the surrounding mountains. Each property is shaped by its setting, designed to feel intentional, welcoming, and easy to return to.
          </p>
        </div>
      </Container>
    </section>
  );
};
