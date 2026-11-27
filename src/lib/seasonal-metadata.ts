import type { Metadata } from "next";
import type { SeasonalPageData } from "@/data/seasonal-pages";
import { canonical } from "@/lib/site";

export function seasonalMetadata(page: SeasonalPageData): Metadata {
  const { title, description } = page;
  const images = [canonical(page.image)];
  return {
    title, description,
    alternates: { canonical: canonical(page.path) },
    openGraph: { title, description, url: canonical(page.path), images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
