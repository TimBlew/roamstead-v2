import Image from "next/image";
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
      <div className="container-figma py-12 md:py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.45fr_0.55fr_0.55fr_0.7fr] lg:gap-12">
          <div className="max-w-[560px] md:col-span-2 lg:col-span-1">
            <Image
              src="/roamstead-logo-light.svg"
              alt="Roamstead"
              width={300}
              height={56}
              className="h-auto w-[250px] md:w-[280px]"
            />
            <p className="mt-2 text-[15px] font-medium tracking-body text-text-dark-primary">
              Roamstead Collective
            </p>
            <p className="mt-5 max-w-[560px] text-[15px] leading-7 tracking-body text-text-dark-secondary">
              Modern mountain hospitality for travelers who value community, adventure, and authentic experiences.
            </p>
          </div>

          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-text-dark-primary">
              Properties
            </p>
            <ul className="mt-5 space-y-3">
              {propertyLinks.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-[15px] tracking-body text-text-dark-secondary transition-colors hover:text-text-dark-primary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-text-dark-primary">
              Company
            </p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="/about"
                  className="text-[15px] tracking-body text-text-dark-secondary transition-colors hover:text-text-dark-primary"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-text-dark-primary">
              Contact
            </p>
            <div className="mt-5 space-y-3">
              <a
                href="mailto:chris@roamstead-co.com"
                className="block text-[15px] tracking-body text-text-dark-secondary transition-colors hover:text-text-dark-primary"
              >
                chris@roamstead-co.com
              </a>
              <a
                href="tel:+14352435670"
                className="block text-[15px] tracking-body text-text-dark-secondary transition-colors hover:text-text-dark-primary"
              >
                (435) 243-5670
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/35 pt-6 md:mt-14">
          <p className="text-[12px] tracking-body text-text-dark-secondary">
            © Copyright Roamstead Collective 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
