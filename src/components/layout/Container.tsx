import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "default" | "wide" | "full" | "figma";
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  maxWidth = "default",
}) => {
  const maxWidthStyles = {
    default: "max-w-[1280px] px-5 sm:px-6 lg:px-8",
    wide: "max-w-[1440px] px-5 sm:px-6 lg:px-8",
    full: "max-w-full px-5 sm:px-6 lg:px-8",
    figma: "max-w-[1280px] px-5 sm:px-6 lg:px-8",
  };

  return <div className={`mx-auto w-full ${maxWidthStyles[maxWidth]} ${className}`}>{children}</div>;
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: "canvas" | "subtle" | "surface" | "second-surface";
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  background = "canvas",
}) => {
  const backgroundStyles = {
    canvas: "bg-bg-canvas",
    subtle: "bg-bg-subtle",
    surface: "bg-bg-surface",
    "second-surface": "bg-bg-second-surface",
  };

  return (
    <section className={`py-16 md:py-24 lg:py-28 ${backgroundStyles[background]} ${className}`}>
      {children}
    </section>
  );
};
