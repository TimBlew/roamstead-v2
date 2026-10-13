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
  <footer className="bg-[#382F29] px-5 pb-[24px] pt-[44px] font-body text-[#FFFCFB] md:px-[48px] md:pb-[28px] md:pt-[56px]">
    <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-x-[24px] gap-y-[36px] md:grid-cols-[minmax(0,1.45fr)_minmax(0,0.8fr)_minmax(0,0.85fr)] md:gap-x-[64px]">
      <div className="col-span-2 md:col-span-1">
        <img src="/roamstead-logo-light.svg" alt="Roamstead" className="h-auto w-[150px] md:w-[170px]" />
        <p className="mt-[18px] max-w-[340px] text-[14px] leading-[1.6] text-[#F4EFEC] md:mt-[20px] md:text-[15px]">
          Homes across the Wasatch Back,<span className="hidden md:inline"><br /></span>{" "}run by people who live here.
        </p>
      </div>
      <nav aria-label="Property links">
        <h2 className="mb-[16px] text-[14px] font-semibold tracking-[0.01em] md:mb-[18px]">Our stays</h2>
        <div className="flex flex-col items-start gap-[11px]">
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
      <div className="min-w-0">
        <nav aria-label="Explore">
          <h2 className="mb-[16px] text-[14px] font-semibold tracking-[0.01em] md:mb-[18px]">Explore</h2>
          <div className="flex flex-col items-start gap-[11px]">
            <a href="/properties" className="text-[13px] leading-[1.45] hover:underline md:text-[14px]">Properties</a>
            <a href="/book" className="text-[13px] leading-[1.45] hover:underline md:text-[14px]">Book direct</a>
          </div>
        </nav>
        <div className="mt-[26px] border-t border-white/20 pt-[19px]">
          <h2 className="mb-[14px] text-[14px] font-semibold tracking-[0.01em]">Get in touch</h2>
          <div className="flex flex-col items-start gap-[11px]">
            <a href="mailto:chris@roamstead-co.com" className="break-words text-[13px] leading-[1.45] text-[#F4EFEC] hover:underline md:text-[14px]">chris@roamstead-co.com</a>
            <a href="tel:+14352435670" className="text-[13px] leading-[1.45] text-[#F4EFEC] hover:underline md:text-[14px]">(435) 243-5670</a>
          </div>
        </div>
      </div>
    </div>
    <div className="mx-auto mt-[40px] max-w-[1320px] border-t border-white/20 pt-[20px] md:mt-[44px] md:pt-[20px]">
      <p className="text-[12px] leading-[1.5] text-[#F4EFEC]/80">© Roamstead Collective 2026. All rights reserved.</p>
    </div>
  </footer>
);
