import Image from "next/image";
import React from "react";

export const Navigation: React.FC = () => {
  return (
    <nav className="site-nav">
      <div className="site-nav__inner">
        <a href="/" className="site-nav__brand" aria-label="Roamstead home">
          <Image
            src="/roamstead-logo.svg"
            alt="Roamstead"
            width={123}
            height={24}
            className="site-nav__logo"
            priority
          />
        </a>

        <a href="/properties" className="site-nav__action site-nav__action--properties">
          Properties
        </a>

        <div className="site-nav__desktop-links">
          <a href="/properties">Properties</a>
        </div>

        <a href="/book" className="site-nav__action site-nav__action--book">
          Book direct
        </a>
      </div>
    </nav>
  );
};
