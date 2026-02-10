import React from "react";
import { Container, Section } from "../layout/Container";

export const CommunityCTA: React.FC = () => {
  return (
    <Section background="subtle">
      <Container>
        <div className="text-center max-w-5xl mx-auto py-20 md:py-24">
        
         {/* Logo + COLLECTIVE */}
       <div className="mb-10 md:mb-12 flex flex-col items-center">
        <div className="inline-flex flex-col items-center">
          <img
            src="/roamstead-collective-logo.svg"
            alt="Roamstead"
            className="h-32 md:h-36 w-auto mb-0"
          />

          <p
            className="uppercase leading-none -mt-1 text-[#4a6e57] text-[17px] md:text-[32px]"
            style={{
              width: "100%",
              textAlign: "center",
              letterSpacing: "0.60em",
            }}
          >
            COLLECTIVE
          </p>
        </div>
      </div>


          {/* Headline: slightly smaller so it stays on one line like the design */}
          <h2 className="font-heading font-medium text-text-primary leading-tight mb-6 text-[44px] md:text-[56px]">
            A new community is forming
          </h2>

          {/* Body copy: larger, more readable, like the template */}
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[22px] md:text-[24px] text-text-muted leading-[1.6] mb-10">
              Roamstead Collective is for the 4-Seasoners. The ones who know that familiarity beats novelty.
              That the best places are the ones you return to. If that sounds like you, you're already part of it.
            </p>
          </div>

          <a
            href="/collective"
            className="
              inline-flex
              items-center
              justify-center
              px-5
              py-2
              text-[15px]
              font-medium
              bg-white
              text-text-primary
              border
              border-border-default
              hover:bg-bg-canvas
              transition-colors
            "
          >
            Join the Waitlist
          </a>
        </div>
      </Container>
    </Section>
  );
};
