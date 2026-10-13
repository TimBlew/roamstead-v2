import type { MetadataRoute } from "next";
import { launchIndexingEnabled, canonical } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!launchIndexingEnabled) return [];
  return ["/", "/properties", "/book", ...["hygge-house", "granary", "lowell", "powder-room"].map(slug => `/properties/${slug}`)]
    .map(path => ({ url: canonical(path) }));
}
