import React from "react";

const senatorUrl = "https://hebersenator.com/?utm_source=roamstead-co&utm_medium=referral&utm_campaign=footer";
const propertyLinks = [
  ["Hygge House", "/properties/hygge-house"],
  ["Granary", "/properties/granary"],
  ["The Lowell", "/properties/lowell"],
  ["Powder Room", "/properties/powder-room"],
  ["The Heber Senator", senatorUrl],
];

export const Footer: React.FC = () => (
  <footer className="bg-[#382F29] px-5 pb-7 pt-8 font-body text-[#FFFCFB] md:px-10 md:py-14">
    <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-5 gap-y-7 md:grid-cols-[2fr_1fr_1fr] md:gap-12">
      <div className="col-span-2 md:col-span-1">
        <img src="/roamstead-logo-light.svg" alt="Roamstead" className="h-auto w-[142px] md:w-[160px]" />
        <p className="mt-2.5 max-w-[350px] text-[13px] leading-5 md:mt-4 md:text-[15px] md:leading-6 text-[#F4EFEC]">Homes across the Wasatch Back, run by people who live here.</p>
      </div>
      <div>
        <h2 className="mb-2 text-[14px] font-medium md:mb-3 md:text-[15px]">Our stays</h2>
        <div className="grid gap-2.5 md:gap-2">
          {propertyLinks.map(([name, href]) => {
            const external = href.startsWith("https");
            return (
              <a key={href} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group inline-flex w-fit items-center gap-1 text-[12.5px] leading-5 md:items-baseline md:gap-1.5 md:text-[13px] text-[#F4EFEC] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                <span className="group-hover:underline">{name}</span>
                {external && <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5 shrink-0 opacity-70 md:h-3 md:w-3 transition-[transform,opacity] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"><path d="M4.5 11.5 11 5M6 5h5v5" /></svg>}
              </a>
            );
          })}
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-[14px] font-medium md:mb-3 md:text-[15px]">Explore</h2>
        <div className="grid gap-2.5 text-[12.5px] leading-5 md:gap-2 md:text-[13px]">
          <a href="/properties" className="hover:underline">Properties</a>
          <a href="/book" className="hover:underline">Book direct</a>
          <a href="mailto:chris@roamstead-co.com" className="break-words hover:underline">chris@roamstead-co.com</a>
          <a href="tel:+14352435670" className="hover:underline">(435) 243-5670</a>
        </div>
      </div>
    </div>
    <p className="mx-auto mt-7 max-w-[1440px] border-t border-white/20 pt-4 text-[11px] leading-5 md:mt-10 md:pt-5 md:text-[12px] text-[#F4EFEC]">© Roamstead Collective 2026. All rights reserved.</p>
  </footer>
);
