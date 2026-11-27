import type { MetadataRoute } from "next";
import { placePaths } from "@/data/places";
import { launchIndexingEnabled, canonical } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!launchIndexingEnabled) return [];
  return ["/", "/properties", "/privacy", ...placePaths, "/book", ...["hygge-house", "granary", "lowell", "powder-room"].map(slug => `/properties/${slug}`), "/park-city/christmas-new-year", "/midway/december"]
    .map(path => ({ url: canonical(path) }));
}
