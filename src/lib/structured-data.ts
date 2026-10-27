import type { Property } from "@/data/properties";
import { canonical } from "@/lib/site";

// Public, indexable property pages that get VacationRental JSON-LD (mirrors sitemap.ts).
export const vacationRentalSlugs = ["hygge-house", "granary", "lowell", "powder-room"] as const;

function statNumber(property: Property, labels: string[]): number | undefined {
  const stat = property.stats.find((item) => labels.includes(item.label.toLowerCase()));
  if (!stat || !/^\d+$/.test(stat.value)) return undefined;
  return Number(stat.value);
}

export function vacationRentalJsonLd(property: Property) {
  if (!(vacationRentalSlugs as readonly string[]).includes(property.slug)) return null;

  const [locality] = property.hero.locationLabel.replace(/,\s*Utah$/, "").split(",").map((part) => part.trim()).slice(-1);
  const url = canonical(`/properties/${property.slug}`);
  const images = [property.hero.image.src, ...property.stories.map((story) => story.image.src)]
    .map((src) => (src.startsWith("http") ? src : canonical(src)))
    .filter((src, index, all) => all.indexOf(src) === index);

  const occupancy = statNumber(property, ["sleeps"]);
  const bedrooms = statNumber(property, ["bedroom", "bedrooms"]);
  const bathrooms = statNumber(property, ["bath", "baths"]);

  const accommodation: Record<string, unknown> = { "@type": "Accommodation", name: property.hero.title };
  if (occupancy) accommodation.occupancy = { "@type": "QuantitativeValue", maxValue: occupancy };
  if (bedrooms) accommodation.numberOfBedrooms = bedrooms;
  if (bathrooms) accommodation.numberOfBathroomsTotal = bathrooms;

  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "@id": `${url}#vacation-rental`,
    name: property.hero.title,
    url,
    description: property.seo.description,
    image: images,
    address: {
      "@type": "PostalAddress",
      addressLocality: locality,
      addressRegion: "UT",
      addressCountry: "US",
    },
    containsPlace: accommodation,
    brand: { "@type": "Brand", name: "Roamstead Collective" },
  };
}

export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
