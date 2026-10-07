import React from "react";

export const Footer: React.FC = () => {
  const propertyLinks = [
    ["Granary", "/properties/granary"],
    ["Daystar", "/properties/daystar"],
    ["The Lowell", "/properties/lowell"],
    ["Hygge House", "/properties/hygge-house"],
    ["Powder Room", "/properties/powder-room"],
    ["The Senator", "/properties/senator"],
  ];

  const linkClass =
    "block w-full font-body text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-[#FFFCFB] transition-colors hover:text-[#FBF8F7]";

  return (
    <footer className="w-full bg-[#382F29] font-body text-[#FFFCFB]">
      <div className="flex w-full flex-col gap-10 px-6 py-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 lg:grid-cols-[608px_192px_193px_192px] lg:gap-4">
          <div className="flex flex-col items-start gap-2 md:col-span-2 lg:col-span-1">
            <div className="h-[80px] w-[269px] overflow-hidden">
              <img
                src="/roamstead-logo-light.svg"
                alt="Roamstead"
                className="block h-full w-full max-w-none"
              />
            </div>

            <p className="w-full font-body text-[18px] font-medium leading-[28px] tracking-[-0.36px] text-[#FBF8F7]">
              Roamstead Collective
            </p>

            <p className="w-full font-body text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-[#FFFCFB]">
              Modern mountain hospitality for travelers who value community, adventure, and authentic experiences.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <p className="w-full font-body text-[18px] font-medium leading-[28px] tracking-[-0.36px] text-[#FBF8F7]">
              Properties
            </p>
            {propertyLinks.map(([label, href]) => (
              <a key={href} href={href} className={linkClass}>
                {label}
              </a>
            ))}
          </div>

          <div className="flex flex-col items-start gap-2">
            <p className="w-full font-body text-[18px] font-medium leading-[28px] tracking-[-0.36px] text-[#FBF8F7]">
              Company
            </p>
            <a href="/about" className={linkClass}>
              About
            </a>
          </div>

          <div className="flex flex-col items-start gap-2">
            <p className="w-full font-body text-[18px] font-medium leading-[28px] tracking-[-0.36px] text-[#FBF8F7]">
              Contact
            </p>
            <a href="mailto:chris@roamstead-co.com" className={linkClass}>
              chris@roamstead-co.com
            </a>
            <a href="tel:+14352435670" className={linkClass}>
              (435) 243-5670
            </a>
          </div>
        </div>

        <div className="h-px w-full bg-[#E7DFDB]" />

        <p className="whitespace-nowrap font-body text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-[#F4EFEC]">
          © Copyright Roamstead Collective 2026. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
