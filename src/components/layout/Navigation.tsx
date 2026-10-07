import Image from "next/image";
import React from "react";

const links = [
  { label: "Locations", href: "/properties" },
  { label: "About", href: "/about" },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-12 border-b border-[#E1D7D1] bg-[#F4EFEC]">
      <div className="flex h-full items-stretch justify-end">
        <a
          href="/"
          className="flex h-12 min-w-0 flex-1 items-center px-4 py-2"
          aria-label="Roamstead home"
        >
          <Image
            src="/roamstead-logo.svg"
            alt="Roamstead"
            width={123}
            height={24}
            className="hidden h-6 w-[123px] sm:block"
            priority
          />
          <Image
            src="/favicon.svg"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 sm:hidden"
            priority
          />
        </a>

        <div className="hidden items-stretch sm:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center justify-center px-4 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#4A6E57] transition-colors hover:text-[#3C6049]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="/properties"
          className="flex items-center justify-center bg-[#4A6E57] px-6 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#FFFCFB] transition-colors hover:bg-[#3C6049]"
        >
          Book Direct
        </a>
      </div>
    </nav>
  );
};
