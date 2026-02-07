import React from 'react';
import { Container, Section } from '../layout/Container';

export const CommunityCTA: React.FC = () => {
  return (
    <Section background="subtle">
      <Container>
        <div className="text-center max-w-4xl mx-auto py-16">
          {/* Logo/Icon - Larger, COLLECTIVE matches width */}
          <div className="mb-10 flex flex-col items-center gap-0">
            <img 
              src="/roamstead-collective-logo.svg" 
              alt="Roamstead" 
              className="h-28 w-auto mb-2"
            />
            <p className="text-[11px] text-text-muted tracking-[0.35em] uppercase">
              COLLECTIVE
            </p>
          </div>

          <h2 className="text-h1 font-heading font-medium text-text-primary mb-6">
            A new community is forming
          </h2>
          <p className="text-base text-text-secondary mb-8 leading-normal max-w-3xl mx-auto">
            Roamstead Collective is for the 4-Seasoners. The ones who know that familiarity beats novelty. That the best places are the ones you return to. If that sounds like you, you're already part of it.
          </p>

          {/* White button */}
          <a 
            href="/collective"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-white text-text-primary border border-border-default hover:bg-bg-canvas transition-colors"
          >
            Join the Waitlist
          </a>
        </div>
      </Container>
    </Section>
  );
};