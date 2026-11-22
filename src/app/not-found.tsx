import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center text-center">
      <h1 className="mr-5 border-r border-current/30 pr-[23px] text-2xl font-medium leading-[49px]">404</h1>
      <h2 className="text-sm font-normal leading-[49px]">This page could not be found.</h2>
    </div>
  );
}
