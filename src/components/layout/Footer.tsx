import React from "react";
import { DM_Sans, DM_Serif_Display } from "next/font/google";

const creditSans = DM_Sans({ subsets: ["latin"], weight: ["400"], display: "swap" });
const creditSerif = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], display: "swap" });

const senatorUrl = "https://hebersenator.com/?utm_source=roamstead-co&utm_medium=referral&utm_campaign=footer";
const propertyLinks = [
  ["Hygge House", "/properties/hygge-house"],
  ["Granary", "/properties/granary"],
  ["The Lowell", "/properties/lowell"],
  ["Powder Room", "/properties/powder-room"],
  ["The Heber Senator", senatorUrl],
];

export const Footer: React.FC = () => (
  <footer className="bg-[#382F29] px-5 pb-[20px] pt-[32px] font-body text-[#FFFCFB] md:px-[48px] md:pb-[22px] md:pt-[34px]">
    <div className="mx-auto grid max-w-[1320px] grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] gap-x-[26px] gap-y-[26px] md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)_minmax(0,0.75fr)_minmax(0,1.05fr)] md:gap-x-[32px] lg:gap-x-[42px]">
      <div className="col-span-2 md:col-span-1">
        <img src="/roamstead-logo-light.svg" alt="Roamstead" className="h-auto w-[142px] md:w-[170px]" />
        <p className="mt-[12px] max-w-[315px] text-[14px] leading-[1.55] text-[#F4EFEC] md:mt-[14px] md:text-[15px]">
          Homes across the Wasatch Back,<span className="hidden md:inline"><br /></span>{" "}run by people who live here.
        </p>
      </div>
      <nav aria-label="Property links">
        <h2 className="mb-[12px] text-[14px] font-semibold tracking-[0.01em] md:mb-[18px]">Our stays</h2>
        <div className="flex flex-col items-start gap-[8px] md:gap-[11px]">
          {propertyLinks.map(([name, href]) => {
            const external = href.startsWith("https");
            return (
              <a key={href} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group inline-flex items-center gap-[6px] text-[13px] leading-[1.45] text-[#F4EFEC] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:text-[14px]">
                <span className="group-hover:underline">{name}</span>
                {external && <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" className="h-[10px] w-[10px] shrink-0 opacity-65"><path d="M4.5 11.5 11 5M6 5h5v5" /></svg>}
              </a>
            );
          })}
        </div>
      </nav>
      <div className="min-w-0 flex flex-col gap-[24px] md:block">
        <nav aria-label="Explore">
          <h2 className="mb-[12px] text-[14px] font-semibold tracking-[0.01em] md:mb-[18px]">Explore</h2>
          <div className="flex flex-col items-start gap-[8px] md:gap-[11px]">
            <a href="/properties" className="text-[13px] leading-[1.45] hover:underline md:text-[14px]">Properties</a>
            <a href="/book" className="text-[13px] leading-[1.45] hover:underline md:text-[14px]">Book direct</a>
          </div>
        </nav>
        <div className="md:hidden">
          <h2 className="mb-[12px] text-[14px] font-semibold tracking-[0.01em] md:mb-[18px]">Get in touch</h2>
          <div className="flex flex-col items-start gap-[8px] md:gap-[11px]">
            <a href="mailto:chris@roamstead-co.com" className="break-words text-[13px] leading-[1.45] text-[#F4EFEC] hover:underline md:text-[14px]">chris@roamstead-co.com</a>
            <a href="tel:+14352435670" className="text-[13px] leading-[1.45] text-[#F4EFEC] hover:underline md:text-[14px]">(435) 243-5670</a>
          </div>
        </div>
      </div>
      <div className="hidden min-w-0 md:block">
        <div className="hidden md:block">
          <h2 className="mb-[12px] text-[14px] font-semibold tracking-[0.01em] md:mb-[18px]">Get in touch</h2>
          <div className="flex flex-col items-start gap-[8px] md:gap-[11px]">
            <a href="mailto:chris@roamstead-co.com" className="break-words text-[13px] leading-[1.45] text-[#F4EFEC] hover:underline md:text-[14px]">chris@roamstead-co.com</a>
            <a href="tel:+14352435670" className="text-[13px] leading-[1.45] text-[#F4EFEC] hover:underline md:text-[14px]">(435) 243-5670</a>
          </div>
        </div>
      </div>
    </div>
    <div className="mx-auto mt-[22px] max-w-[1320px] border-t border-white/20 pt-[16px] md:mt-[28px] md:pt-[14px]">
      <div className="flex flex-col gap-[8px] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-[12px] leading-[1.5] text-[#F4EFEC]/80">© Roamstead Collective 2026. All rights reserved.</p>
        <a href="https://castlehead.ai" target="_blank" rel="noopener noreferrer" aria-label="Site powered by Castlehead" className="group mx-auto mt-[8px] inline-flex w-fit items-baseline justify-center gap-[5px] whitespace-nowrap text-[12px] sm:mx-0 sm:mt-0 leading-[1.5] text-[#F4EFEC]/65 transition-colors hover:text-[#FFFCFB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:text-[13px]"><span className={`${creditSans.className} font-normal`}>Site powered by</span><span className={`${creditSerif.className} text-[13px] font-normal tracking-normal text-[#FFFCFB] md:text-[15px]`}>Castlehead<span className="text-[#00D4FF]">.</span></span></a>
      </div>
    </div>
  </footer>
);
