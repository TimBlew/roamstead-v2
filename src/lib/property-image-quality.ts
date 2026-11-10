const DELIVERY_QUALITY_SLUGS = new Set(["hygge-house", "granary"]);

/**
 * WebP quality for Hygge House and Granary only.
 * Measured on the Next.js optimizer against quality 100 at the widths these
 * pages already request: the Hygge hero stays at SSIM 0.981 and drops about
 * 65% in bytes at its 1536px source, and gallery photos stay near SSIM 0.98.
 * Other properties keep the fallback they already use.
 */
export function propertyImageQuality(slug: string, fallback: number): number {
  return DELIVERY_QUALITY_SLUGS.has(slug) ? 85 : fallback;
}
