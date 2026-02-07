import React from 'react';
import { Container, Section } from '../layout/Container';
import { Button } from '../ui/Button';

export const CommunityCTA: React.FC = () => {
  return (
    <Section background="subtle">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo/Icon */}
          <div className="mb-6 flex flex-col items-center gap-2">
            <img 
              src="/roamstead-collective-logo.svg" 
              alt="Roamstead" 
              className="h-12 w-auto"
            />
            <p className="text-sm text-text-muted tracking-[0.2em] uppercase">
              C O L L E C T I V E
            </p>
          </div>

          <h2 className="text-h3 text-text-primary mb-4">
            A new community is forming
          </h2>
          <p className="text-lg text-text-secondary mb-6">
            Roamstead Collective is for the 4-Seasoners. The ones who know that familiarity beats novelty. That the best places are the ones you return to. If that sounds like you, you're already part of it.
          </p>

          <Button variant="primary" href="/collective">
            Join the Waitlist
          </Button>
        </div>
      </Container>
    </Section>
  );
};
