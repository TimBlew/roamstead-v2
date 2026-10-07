import Image from "next/image";
import React from "react";

const links = [
  { label: "Locations", href: "/properties" },
  { label: "About", href: "/about" },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border-subtle bg-bg-canvas/95 backdrop-blur-md">
      <div className="flex h-full items-stretch">
        <a href="/" className="flex flex-1 items-center px-5 sm:px-6 lg:px-8" aria-label="Roamstead home">
          <Image src="/roamstead-logo.svg" alt="Roamstead" width={170} height={32} className="hidden h-6 w-auto sm:block" priority />
          <Image src="/favicon.svg" alt="" width={28} height={28} className="h-6 w-6 sm:hidden" priority />
        </a>

        <div className="hidden items-stretch sm:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="flex items-center px-4 text-sm font-medium tracking-body text-text-secondary transition-colors hover:text-brand-default">
              {link.label}
            </a>
          ))}
        </div>

        <a href="/properties" className="flex items-center bg-button-primary-bg px-5 text-sm font-medium tracking-body text-button-primary-text transition-colors hover:bg-button-primary-hover sm:px-6">
          Book Direct
        </a>
      </div>
    </nav>
  );
};
