import React from "react";
import { Container } from "../layout/Container";

export const CommunityCTA: React.FC = () => {
  return (
    <section className="bg-bg-subtle py-20 md:py-24">
      <Container maxWidth="figma">
        <div className="mx-auto max-w-[980px] text-center">
          <div className="flex flex-col items-center">
            <img
              src="/roamstead-collective-logo.svg"
              alt="Roamstead Collective"
              className="h-28 w-auto md:h-32"
            />
            <p className="mt-1 text-[14px] uppercase tracking-[0.45em] text-brand-default md:text-[16px]">
              Collective
            </p>
          </div>

          <h2 className="mt-8 font-heading text-[40px] font-medium leading-[1.05] tracking-display text-text-primary md:text-[52px]">
            A new community is forming
          </h2>

          <p className="mx-auto mt-5 max-w-[840px] text-lg leading-8 tracking-body text-text-secondary md:text-[20px] md:leading-8">
            Roamstead Collective is for the 4-Seasoners. The ones who know that familiarity beats novelty. That the best places are the ones you return to. If that sounds like you, you’re already part of it.
          </p>

          <a
            href="mailto:chris@roamstead-co.com?subject=Roamstead%20Collective"
            className="mt-8 inline-flex min-h-10 items-center justify-center rounded-2 border border-border-default bg-bg-canvas px-5 py-2 text-sm font-medium tracking-body text-text-primary transition-colors hover:bg-bg-surface"
          >
            Join the Waitlist
          </a>
        </div>
      </Container>
    </section>
  );
};
