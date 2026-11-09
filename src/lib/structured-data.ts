import type { Place } from "@/data/places";
import { getProperty, type Property } from "@/data/properties";
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
  if (occupancy) {
    const occupancyValue: Record<string, unknown> = { "@type": "QuantitativeValue", maxValue: occupancy };
    // Google requires occupancy.value. Granary's published count of 4 matches a king
    // plus a sofa bed for two more guests. Hygge's advertised 10 does not match the
    // listed beds, so its value stays unset. Other homes are unchanged here.
    if (property.slug === "granary") occupancyValue.value = occupancy;
    accommodation.occupancy = occupancyValue;
  }
  if (bedrooms) accommodation.numberOfBedrooms = bedrooms;
  if (bathrooms) accommodation.numberOfBathroomsTotal = bathrooms;

  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "@id": `${url}#vacation-rental`,
    identifier: property.slug,
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

export function midwayCollectionJsonLd(place: Place) {
  if (place.slug !== "midway" || !place.comparison) return null;

  const itemListElement = place.comparison.stays.map((stay, index) => {
    const property = getProperty(stay.slug);
    const url = canonical(`/properties/${stay.slug}`);
    return {
      "@type": "ListItem",
      position: index + 1,
      name: property?.hero.title ?? stay.slug,
      url,
      item: { "@id": `${url}#vacation-rental` },
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonical(place.path)}#collection`,
    name: place.comparison.heading,
    url: canonical(place.path),
    description: place.comparison.intro,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: itemListElement.length,
      itemListElement,
    },
  };
}
