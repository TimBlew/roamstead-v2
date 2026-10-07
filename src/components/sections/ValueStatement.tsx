import React from "react";
import { Container, Section } from "../layout/Container";

export const ValueStatement: React.FC = () => {
  return (
    <Section background="subtle">
      <Container maxWidth="figma">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-brand-default">The Roamstead way</p>
            <h2 className="mt-3 font-heading text-h2 font-medium tracking-display text-text-primary">Mountain stays that feel easy to return to</h2>
          </div>
          <p className="max-w-[720px] text-lg leading-8 tracking-body text-text-secondary lg:justify-self-end">
            Roamstead is a growing collection of places shaped by their setting and designed for how people actually travel: room to gather, space to slow down, and the details that make a stay feel lived in rather than staged.
          </p>
        </div>
      </Container>
    </Section>
  );
};
