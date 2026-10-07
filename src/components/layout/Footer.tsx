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

  return (
    <footer className="bg-bg-second-surface text-text-dark-primary">
      <div className="container-figma py-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 lg:grid-cols-[608px_192px_192px_192px] lg:gap-4">
          <div className="flex flex-col items-start gap-2 md:col-span-2 lg:col-span-1">
            <img
              src="/roamstead-logo-light.svg"
              alt="Roamstead"
              className="block h-auto w-[240px] sm:w-[270px] md:-ml-2 md:w-[300px]"
            />

            <p className="text-[16px] font-medium leading-[24px] tracking-[-0.32px] text-text-dark-primary">
              Roamstead Collective
            </p>

            <p className="max-w-[520px] text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-text-dark-secondary">
              Modern mountain hospitality for travelers who value community, adventure, and authentic experiences.
            </p>
          </div>

          <div className="self-stretch">
            <h4 className="text-[18px] font-medium leading-[28px] tracking-[-0.36px] text-text-dark-primary">
              Properties
            </h4>
            <ul className="mt-4 space-y-4">
              {propertyLinks.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-text-dark-secondary transition-colors hover:text-text-dark-primary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="self-stretch">
            <h4 className="text-[18px] font-medium leading-[28px] tracking-[-0.36px] text-text-dark-primary">
              Company
            </h4>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="/about"
                  className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-text-dark-secondary transition-colors hover:text-text-dark-primary"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          <div className="self-stretch">
            <h4 className="text-[18px] font-medium leading-[28px] tracking-[-0.36px] text-text-dark-primary">
              Contact
            </h4>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="mailto:chris@roamstead-co.com"
                  className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-text-dark-secondary transition-colors hover:text-text-dark-primary"
                >
                  chris@roamstead-co.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+14352435670"
                  className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-text-dark-secondary transition-colors hover:text-text-dark-primary"
                >
                  (435) 243-5670
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-border-subtle" />

        <p className="mt-6 text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-text-dark-muted">
          © Copyright Roamstead Collective 2026. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
