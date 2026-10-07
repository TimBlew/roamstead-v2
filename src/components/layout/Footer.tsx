import Image from "next/image";
import React from "react";

export const Footer: React.FC = () => {
  const propertyLinks = [
    ["Hygge House", "/properties/hygge-house"],
    ["Granary", "/properties/granary"],
    ["Daystar", "/properties/daystar"],
    ["The Lowell", "/properties/lowell"],
    ["Powder Room", "/properties/powder-room"],
    ["The Senator", "/properties/senator"],
  ];

  return (
    <footer className="bg-bg-second-surface text-text-dark-primary">
      <div className="container-figma py-14 md:py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_0.6fr_0.75fr] lg:gap-16">
          <div className="max-w-[520px] md:col-span-2 lg:col-span-1">
            <Image
              src="/roamstead-logo-light.svg"
              alt="Roamstead"
              width={300}
              height={56}
              className="h-auto w-[210px] md:w-[230px]"
            />

            <p className="mt-6 max-w-[470px] text-[15px] leading-7 tracking-body text-text-dark-secondary/85 md:text-base">
              Modern mountain hospitality across Heber Valley and Park City, built around thoughtful stays and reasons to return.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-dark-muted">
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
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-dark-muted">
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

            <div className="mt-8">
              <a
                href="/properties"
                className="inline-flex min-h-10 items-center justify-center rounded-2 border border-white/25 px-4 py-2 text-sm font-medium tracking-body text-text-dark-primary transition-colors hover:bg-white/10"
              >
                Book Direct
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/15 pt-6 text-[12px] tracking-body text-text-dark-muted md:mt-16 md:flex-row md:items-center md:justify-between">
          <p>© Roamstead Collective 2026. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="/about" className="transition-colors hover:text-text-dark-primary">
              About
            </a>
            <a href="/properties" className="transition-colors hover:text-text-dark-primary">
              Locations
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
