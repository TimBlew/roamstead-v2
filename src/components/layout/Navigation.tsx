import Image from "next/image";
import React from "react";

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-[52px] border-b border-[#E1D7D1] bg-[#F4EFEC]">
      <div className="grid h-full grid-cols-[1fr_104px_104px] items-center gap-2 px-2.5 sm:flex sm:items-stretch sm:justify-end sm:gap-0 sm:px-0">
        <a
          href="/"
          className="flex min-w-0 items-center pl-0.5 pr-2 sm:px-3"
          aria-label="Roamstead home"
        >
          <Image
            src="/roamstead-logo.svg"
            alt="Roamstead"
            width={112}
            height={22}
            className="h-[21px] w-[108px] sm:h-6 sm:w-[123px]"
            priority
          />
        </a>

        <a
          href="/properties"
          className="flex h-9 items-center justify-center rounded-[9px] border border-[#E1D7D1] bg-[#EFE9E5] px-2 font-body text-[12.5px] font-medium leading-none tracking-[-0.2px] text-[#4A6E57] shadow-[0_2px_7px_rgba(41,29,22,0.035)] transition-colors hover:bg-[#E9E1DC] sm:hidden"
        >
          Properties
        </a>

        <div className="hidden items-stretch sm:flex">
          <a
            href="/properties"
            className="flex items-center justify-center px-4 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#4A6E57] transition-colors hover:text-[#3C6049]"
          >
            Properties
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
          className="flex h-9 items-center justify-center rounded-[9px] border border-[#3C6049]/20 bg-[#4A6E57] px-2 font-body text-[12.5px] font-medium leading-none tracking-[-0.2px] text-[#FFFCFB] shadow-[0_3px_10px_rgba(74,110,87,0.1)] transition-colors hover:bg-[#3C6049] sm:h-full sm:rounded-none sm:border-y-0 sm:border-r-0 sm:px-6 sm:text-[16px] sm:leading-6 sm:tracking-[-0.32px]"
        >
          Book Direct
        </a>
      </div>
    </nav>
  );
};
