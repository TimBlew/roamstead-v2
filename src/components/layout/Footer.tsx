import Image from "next/image";
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bg-second-surface text-text-dark-primary">
      <div className="container-figma py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_200px_220px] lg:gap-10">
          <div className="md:col-span-2 lg:col-span-1">
            <Image src="/roamstead-logo-light.svg" alt="Roamstead" width={300} height={56} className="h-auto w-[240px] md:w-[280px]" />
            <p className="mt-5 max-w-[500px] text-base leading-7 tracking-body text-text-dark-secondary">
              Modern mountain hospitality across Heber Valley and Park City, built around thoughtful stays and reasons to return.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-[0.12em] text-text-dark-primary">Properties</h4>
            <ul className="mt-5 space-y-3">
              {[
                ["Hygge House", "/properties/hygge-house"],
                ["Granary", "/properties/granary"],
                ["Daystar", "/properties/daystar"],
                ["The Lowell", "/properties/lowell"],
                ["Powder Room", "/properties/powder-room"],
                ["The Senator", "/properties/senator"],
              ].map(([label, href]) => (
                <li key={href}><a href={href} className="text-sm tracking-body text-text-dark-secondary transition-colors hover:text-text-dark-primary">{label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-[0.12em] text-text-dark-primary">Contact</h4>
            <ul className="mt-5 space-y-3">
              <li><a href="mailto:chris@roamstead-co.com" className="text-sm tracking-body text-text-dark-secondary transition-colors hover:text-text-dark-primary">chris@roamstead-co.com</a></li>
              <li><a href="tel:+14352435670" className="text-sm tracking-body text-text-dark-secondary transition-colors hover:text-text-dark-primary">(435) 243-5670</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6">
          <p className="text-xs tracking-body text-text-dark-muted">© Roamstead Collective 2026. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
