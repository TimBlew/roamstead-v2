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
      <div className="px-5 py-6 md:hidden">
        <div className="h-[42px] w-[141px] overflow-hidden">
          <img src="/roamstead-logo-light.svg" alt="Roamstead" className="block h-full w-full max-w-none" />
        </div>

        <p className="mt-2 max-w-[250px] font-body text-[13px] font-normal leading-5 tracking-[-0.26px] text-[#F4EFEC]">
          Modern mountain hospitality across Heber Valley and Park City.
        </p>

        <div className="mt-4 grid grid-cols-[0.8fr_1.2fr] gap-5 border-t border-white/20 pt-4">
          <div>
            <p className="font-body text-[14px] font-medium leading-5 tracking-[-0.28px] text-[#FBF8F7]">Explore</p>
            <div className="mt-2 space-y-1">
              <a href="/properties" className="block text-[14px] leading-5 text-[#FFFCFB]">Properties</a>
              <a href="/about" className="block text-[14px] leading-5 text-[#FFFCFB]">About</a>
              <a href="/properties" className="block text-[14px] leading-5 text-[#FFFCFB]">Book Direct</a>
            </div>
          </div>
          <div>
            <p className="font-body text-[14px] font-medium leading-5 tracking-[-0.28px] text-[#FBF8F7]">Contact</p>
            <div className="mt-2.5 space-y-1.5">
              <a href="mailto:chris@roamstead-co.com" className="block whitespace-nowrap text-[11px] leading-5 tracking-[-0.22px] text-[#FFFCFB]">
                chris@roamstead-co.com
              </a>
              <a href="tel:+14352435670" className="block text-[14px] leading-5 text-[#FFFCFB]">
                (435) 243-5670
              </a>
            </div>
          </div>
        </div>

        <p className="mt-4 border-t border-white/20 pt-3 font-body text-[12px] font-normal leading-5 tracking-[-0.24px] text-[#F4EFEC]">
          © Roamstead Collective 2026. All rights reserved.
        </p>
      </div>

      <div className="hidden w-full flex-col gap-10 px-6 py-8 md:flex">
        <div className="flex w-full flex-col gap-4 lg:grid lg:grid-cols-[608px_192px_193px_192px] lg:gap-4">
          <div className="flex w-full flex-col items-center gap-2 lg:items-start">
            <div className="h-[64px] w-[215px] overflow-hidden lg:h-[80px] lg:w-[269px]">
              <img src="/roamstead-logo-light.svg" alt="Roamstead" className="block h-full w-full max-w-none" />
            </div>
            <p className="w-full text-center font-body text-[18px] font-medium leading-[28px] tracking-[-0.36px] text-[#FBF8F7] lg:text-left">
              Roamstead Collective
            </p>
            <p className="w-full font-body text-[14px] font-normal leading-[18px] tracking-[-0.28px] text-[#FFFCFB] lg:text-[16px] lg:leading-[24px] lg:tracking-[-0.32px]">
              Modern mountain hospitality for travelers who value community, adventure, and authentic experiences.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 lg:contents">
            <div className="flex w-full flex-col items-start gap-2">
              <p className="w-full font-body text-[18px] font-medium leading-[28px] tracking-[-0.36px] text-[#FBF8F7]">Properties</p>
              {propertyLinks.map(([label, href]) => (
                <a key={href} href={href} className={linkClass}>{label}</a>
              ))}
            </div>
            <div className="flex w-full flex-col items-start gap-2">
              <p className="w-full font-body text-[18px] font-medium leading-[28px] tracking-[-0.36px] text-[#FBF8F7]">Company</p>
              <a href="/about" className={linkClass}>About</a>
            </div>
            <div className="col-span-2 flex w-full flex-col items-start gap-2 lg:col-auto">
              <p className="w-full font-body text-[18px] font-medium leading-[28px] tracking-[-0.36px] text-[#E8F5EC] lg:text-[#FBF8F7]">Contact</p>
              <a href="mailto:chris@roamstead-co.com" className={linkClass}>chris@roamstead-co.com</a>
              <a href="tel:+14352435670" className={linkClass}>(435) 243-5670</a>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[#E7DFDB]" />
        <p className="font-body text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-[#F4EFEC]">
          © Copyright Roamstead Collective 2026. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
