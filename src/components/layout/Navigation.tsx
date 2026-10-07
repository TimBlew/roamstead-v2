import Image from "next/image";
import React from "react";

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-12 border-b border-[#E1D7D1] bg-[#F4EFEC]">
      <div className="grid h-full grid-cols-[1fr_96px_118px] sm:flex sm:items-stretch sm:justify-end">
        <a
          href="/"
          className="flex min-w-0 items-center px-3"
          aria-label="Roamstead home"
        >
          <Image
            src="/roamstead-logo.svg"
            alt="Roamstead"
            width={112}
            height={22}
            className="h-[22px] w-[112px] sm:h-6 sm:w-[123px]"
            priority
          />
        </a>

        <a
          href="/properties"
          className="flex items-center justify-center font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#4A6E57] sm:hidden"
        >
          Properties
        </a>

        <div className="hidden items-stretch sm:flex">
          <a
            href="/properties"
            className="flex items-center justify-center px-4 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#4A6E57] transition-colors hover:text-[#3C6049]"
          >
            Locations
          </a>
          <a
            href="/about"
            className="flex items-center justify-center px-4 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#4A6E57] transition-colors hover:text-[#3C6049]"
          >
            About
          </a>
        </div>

        <a
          href="/properties"
          className="flex items-center justify-center bg-[#4A6E57] px-3 font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#FFFCFB] transition-colors hover:bg-[#3C6049] sm:px-6 sm:text-[16px] sm:leading-6 sm:tracking-[-0.32px]"
        >
          Book Direct
        </a>
      </div>
    </nav>
  );
};
