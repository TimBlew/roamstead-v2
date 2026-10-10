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
  <footer className="bg-[#382F29] px-5 py-10 font-body text-[#FFFCFB] md:px-10 md:py-14">
    <div className="mx-auto grid max-w-[1440px] gap-9 md:grid-cols-[2fr_1fr_1fr] md:gap-12">
      <div>
        <img src="/roamstead-logo-light.svg" alt="Roamstead" className="h-auto w-[160px]" />
        <p className="mt-4 max-w-[350px] text-[15px] leading-6 text-[#F4EFEC]">Homes across the Wasatch Back, run by people who live here.</p>
      </div>
      <div>
        <h2 className="mb-3 text-[15px] font-medium">Our stays</h2>
        <div className="grid gap-2">
          {propertyLinks.map(([name, href]) => {
            const external = href.startsWith("https");
            return (
              <a key={href} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group inline-flex w-fit items-baseline gap-1.5 text-[13px] text-[#F4EFEC] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                <span className="group-hover:underline">{name}</span>
                {external && <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 shrink-0 opacity-70 transition-[transform,opacity] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"><path d="M4.5 11.5 11 5M6 5h5v5" /></svg>}
              </a>
            );
          })}
        </div>
      </div>
      <div>
        <h2 className="mb-3 text-[15px] font-medium">Explore</h2>
        <div className="grid gap-2 text-[13px]">
          <a href="/properties" className="hover:underline">Properties</a>
          <a href="/book" className="hover:underline">Book direct</a>
          <a href="mailto:chris@roamstead-co.com" className="break-all hover:underline">chris@roamstead-co.com</a>
          <a href="tel:+14352435670" className="hover:underline">(435) 243-5670</a>
        </div>
      </div>
    </div>
    <p className="mx-auto mt-10 max-w-[1440px] border-t border-white/20 pt-5 text-[12px] text-[#F4EFEC]">© Roamstead Collective 2026. All rights reserved.</p>
  </footer>
);
