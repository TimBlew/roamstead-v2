import React from 'react';
import { Container, Section } from '../layout/Container';

export const ValueStatement: React.FC = () => {
  return (
    <Section background="canvas">
      <Container>
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-h2 font-heading font-medium text-text-primary mb-4">
            Where Mountain Life Slows Down
          </h2>
          <p className="text-md text-text-secondary leading-relaxed">
            Roamstead is a growing collection of places to stay in Heber Valley and the surrounding mountains. Each property is shaped by its setting — designed to feel intentional, welcoming, and easy to return to.
          </p>
        </div>
      </Container>
    </Section>
  );
};