import Image from "next/image";
import React from "react";

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-11 border-b border-[#E1D7D1] bg-[#F4EFEC] md:h-12">
      <div className="grid h-full grid-cols-[1fr_auto_auto] md:flex md:items-stretch md:justify-end">
        <a
          href="/"
          className="flex min-w-0 items-center px-4 py-2"
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
            width={22}
            height={22}
            className="h-[22px] w-[22px] sm:hidden"
            priority
          />
        </a>

        <a
          href="/properties"
          className="flex items-center justify-center px-3 font-body text-[14px] font-medium leading-5 tracking-[-0.28px] text-[#4A6E57] sm:hidden"
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
          className="flex items-center justify-center bg-[#4A6E57] px-4 py-2 font-body text-[14px] font-medium leading-5 tracking-[-0.28px] text-[#FFFCFB] transition-colors hover:bg-[#3C6049] md:px-6 md:text-[16px] md:leading-6 md:tracking-[-0.32px]"
        >
          Book Direct
        </a>
      </div>
    </nav>
  );
};
