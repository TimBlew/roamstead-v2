import React from "react";
import { Container, Section } from "../layout/Container";

export const CommunityCTA: React.FC = () => {
  return (
    <Section background="subtle">
      <Container maxWidth="figma">
        <div className="mx-auto max-w-[920px] text-center">
          <img src="/roamstead-collective-logo.svg" alt="Roamstead Collective" className="mx-auto h-24 w-auto md:h-28" />
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.22em] text-brand-default">Roamstead Collective</p>
          <h2 className="mt-6 font-heading text-[40px] font-medium leading-[1.05] tracking-display text-text-primary md:text-[52px]">The best places are the ones you return to</h2>
          <p className="mx-auto mt-5 max-w-[720px] text-base leading-7 tracking-body text-text-secondary md:text-lg md:leading-8">
            The Collective is taking shape around people who come back for another season, another trail, another weekend in the valley. Join the list and we’ll keep you close to what comes next.
          </p>
          <a href="mailto:chris@roamstead-co.com?subject=Roamstead%20Collective" className="mt-7 inline-flex min-h-10 items-center justify-center rounded-2 border border-border-default bg-bg-canvas px-4 py-2 text-sm font-medium tracking-body text-text-primary transition-colors hover:bg-bg-surface">
            Join the Collective
          </a>
        </div>
      </Container>
    </Section>
  );
};
