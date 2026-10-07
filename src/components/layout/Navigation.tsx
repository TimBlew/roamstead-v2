import Image from "next/image";
import React from "react";

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-12 border-b border-[#E1D7D1] bg-[#F4EFEC]">
      <div className="grid h-full grid-cols-[1fr_108px_108px] items-center gap-1 px-1.5 sm:flex sm:items-stretch sm:justify-end sm:gap-0 sm:px-0">
        <a
          href="/"
          className="flex min-w-0 items-center pl-1 pr-2 sm:px-3"
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
          className="flex h-8 items-center justify-center rounded-[8px] border border-[#E1D7D1] bg-[#FBF8F7] px-2 font-body text-[12.5px] font-medium leading-none tracking-[-0.2px] text-[#4A6E57] shadow-[0_2px_8px_rgba(41,29,22,0.04)] transition-colors hover:bg-[#F4EFEC] sm:hidden"
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
          className="flex h-8 whitespace-nowrap items-center justify-center rounded-[8px] bg-[#4A6E57] px-2 font-body text-[12.5px] font-medium leading-none tracking-[-0.2px] text-[#FFFCFB] shadow-[0_3px_10px_rgba(74,110,87,0.12)] transition-colors hover:bg-[#3C6049] sm:h-full sm:rounded-none sm:border-l sm:border-[#3C6049]/25 sm:px-6 sm:text-[16px] sm:leading-6 sm:tracking-[-0.32px]"
        >
          Book Direct
        </a>
      </div>
    </nav>
  );
};
