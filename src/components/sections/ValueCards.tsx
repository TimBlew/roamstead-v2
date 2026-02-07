import React from 'react';
import { Container, Section } from '../layout/Container';
import { ValueCard } from '../ui/ValueCard';
import { Button } from '../ui/Button';

export const ValueCards: React.FC = () => {
  const values = [
    {
      image: '/images/community-first.jpg',
      title: 'Community first',
      description: 'We design spaces that encourage gathering — around a table, a fire, or a shared plan for tomorrow. The best days leave room for people.',
    },
    {
      image: '/images/four-season.jpg',
      title: 'Four-season living',
      description: "We're here for winter powder and summer singletracks. Mud season. Quiet weeks. Full parking lots and empty trails. The whole year matters.",
    },
    {
      image: '/images/local-nature.jpg',
      title: 'Local by nature',
      description: 'Roamstead stays are shaped by their surroundings and the people who live there. We pay attention to the rhythms of the valley, not outside expectations.',
    },
  ];

  return (
    <Section background="subtle">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {values.map((value, index) => (
            <ValueCard
              key={index}
              image={value.image}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="primary" href="/properties">
            Check availability
          </Button>
        </div>
      </Container>
    </Section>
  );
};
