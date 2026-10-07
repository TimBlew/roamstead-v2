import Image from "next/image";
import React from "react";
import { Container } from "../layout/Container";

export const CommunityCTA: React.FC = () => {
  return (
    <section className="bg-bg-subtle py-16 md:py-20 lg:py-24">
      <Container maxWidth="figma">
        <div className="mx-auto max-w-[1040px] text-center">
          <div className="mx-auto flex w-fit flex-col items-center">
            <Image
              src="/roamstead-collective-logo.svg"
              alt="Roamstead"
              width={2320}
              height={817}
              className="h-auto w-[320px] sm:w-[390px] md:w-[470px]"
            />
            <p className="mt-1 pl-[0.42em] text-[12px] font-medium uppercase leading-none tracking-[0.52em] text-brand-default sm:text-[14px] md:text-[16px]">
              Collective
            </p>
          </div>

          <h2 className="mt-12 font-heading text-[40px] font-medium leading-[1.05] tracking-display text-text-primary sm:text-[46px] md:mt-14 md:text-[54px]">
            A new community is forming
          </h2>

          <p className="mx-auto mt-6 max-w-[940px] text-[17px] leading-8 tracking-body text-text-secondary md:text-[20px] md:leading-9">
            Roamstead Collective is for the 4-Seasoners. The ones who know that familiarity beats novelty. That the best places are the ones you return to. If that sounds like you, you’re already part of it.
          </p>

          <a
            href="mailto:chris@roamstead-co.com?subject=Roamstead%20Collective"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-2 border border-border-default bg-bg-canvas px-5 py-2.5 text-[15px] font-medium tracking-body text-text-primary transition-colors hover:bg-bg-surface"
          >
            Join the Waitlist
          </a>
        </div>
      </Container>
    </section>
  );
};
