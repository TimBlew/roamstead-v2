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
    "block w-full font-body text-[13px] font-normal leading-[19px] tracking-[-0.26px] text-[#FFFCFB] transition-colors hover:text-[#FBF8F7]";

  return (
    <footer className="w-full bg-[#382F29] font-body text-[#FFFCFB]">
      <div className="px-5 py-3 md:hidden">
        <div className="h-[34px] w-[114px] overflow-hidden">
          <img src="/roamstead-logo-light.svg" alt="Roamstead" className="block h-full w-full max-w-none" />
        </div>

        <p className="mt-1 max-w-[238px] font-body text-[11.5px] font-normal leading-[16px] tracking-[-0.23px] text-[#F4EFEC]">
          Modern mountain hospitality across Heber Valley and Park City.
        </p>

        <div className="mt-2.5 grid grid-cols-[0.8fr_1.2fr] gap-3 border-t border-white/20 pt-2.5">
          <div>
            <p className="font-body text-[13px] font-medium leading-[18px] tracking-[-0.28px] text-[#FBF8F7]">Explore</p>
            <div className="mt-1 space-y-0">
              <a href="/properties" className="block text-[12.5px] leading-[18px] text-[#FFFCFB]">Properties</a>
              <a href="/about" className="block text-[12.5px] leading-[18px] text-[#FFFCFB]">About</a>
              <a href="/properties" className="block text-[12.5px] leading-[18px] text-[#FFFCFB]">Book Direct</a>
            </div>
          </div>
          <div>
            <p className="font-body text-[13px] font-medium leading-[18px] tracking-[-0.26px] text-[#FBF8F7]">Contact</p>
            <div className="mt-1.5 space-y-0.5">
              <a href="mailto:chris@roamstead-co.com" className="block whitespace-nowrap text-[10.5px] leading-[18px] tracking-[-0.21px] text-[#FFFCFB]">
                chris@roamstead-co.com
              </a>
              <a href="tel:+14352435670" className="block text-[12.5px] leading-[18px] text-[#FFFCFB]">
                (435) 243-5670
              </a>
            </div>
          </div>
        </div>

        <p className="mt-2.5 border-t border-white/20 pt-2 font-body text-[10.5px] font-normal leading-[15px] tracking-[-0.21px] text-[#F4EFEC]">
          © Roamstead Collective 2026. All rights reserved.
        </p>
      </div>

      <div className="mx-auto hidden w-full max-w-[1440px] flex-col gap-5 px-8 py-6 md:flex lg:px-10">
        <div className="grid w-full grid-cols-[1.45fr_0.8fr_0.65fr_1fr] gap-8">
          <div className="flex w-full flex-col items-start gap-1">
            <div className="h-[54px] w-[182px] overflow-hidden">
              <img src="/roamstead-logo-light.svg" alt="Roamstead" className="block h-full w-full max-w-none" />
            </div>
            <p className="w-full font-body text-[15px] font-medium leading-[20px] tracking-[-0.3px] text-[#FBF8F7]">
              Roamstead Collective
            </p>
            <p className="max-w-[420px] font-body text-[13px] font-normal leading-[19px] tracking-[-0.26px] text-[#FFFCFB]">
              Modern mountain hospitality for travelers who value community, adventure, and authentic experiences.
            </p>
          </div>

          <div className="contents">
            <div className="flex w-full flex-col items-start gap-1">
              <p className="w-full font-body text-[15px] font-medium leading-[20px] tracking-[-0.36px] text-[#FBF8F7]">Properties</p>
              {propertyLinks.map(([label, href]) => (
                <a key={href} href={href} className={linkClass}>{label}</a>
              ))}
            </div>
            <div className="flex w-full flex-col items-start gap-1">
              <p className="w-full font-body text-[15px] font-medium leading-[20px] tracking-[-0.36px] text-[#FBF8F7]">Company</p>
              <a href="/about" className={linkClass}>About</a>
            </div>
            <div className="col-span-2 flex w-full flex-col items-start gap-2 lg:col-auto">
              <p className="w-full font-body text-[15px] font-medium leading-[20px] tracking-[-0.36px] text-[#E8F5EC] lg:text-[#FBF8F7]">Contact</p>
              <a href="mailto:chris@roamstead-co.com" className={linkClass}>chris@roamstead-co.com</a>
              <a href="tel:+14352435670" className={linkClass}>(435) 243-5670</a>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/25" />
        <p className="font-body text-[12px] font-normal leading-[18px] tracking-[-0.24px] text-[#F4EFEC]">
          © Copyright Roamstead Collective 2026. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
