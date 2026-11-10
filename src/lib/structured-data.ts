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
    // Google requires occupancy.value. Granary's published 4 matches a king plus a sofa
    // bed for two. Hygge's visible Sleeps 10 was confirmed as the occupancy on Nov 10, 2026.
    if (property.slug === "granary" || property.slug === "hygge-house") occupancyValue.value = occupancy;
    accommodation.occupancy = occupancyValue;
  }
  if (bedrooms) accommodation.numberOfBedrooms = bedrooms;
  if (bathrooms) accommodation.numberOfBathroomsTotal = bathrooms;
  if (property.slug === "hygge-house") applyHyggeAccommodation(accommodation);

  const rental: Record<string, unknown> = {
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
  // Earliest check-in and latest check-out. The 23:00 end of the arrival window
  // has no VacationRental property, so it is not encoded.
  if (property.slug === "hygge-house") {
    rental.checkinTime = "15:00:00";
    rental.checkoutTime = "10:00:00";
  }
  return rental;
}

function feature(name: string, value: boolean | string) {
  return { "@type": "LocationFeatureSpecification", name, value };
}

function applyHyggeAccommodation(accommodation: Record<string, unknown>) {
  accommodation.petsAllowed = true;
  accommodation.bed = [
    { "@type": "BedDetails", numberOfBeds: 1, typeOfBed: "King" },
    { "@type": "BedDetails", numberOfBeds: 1, typeOfBed: "Queen" },
    { "@type": "BedDetails", numberOfBeds: 1, typeOfBed: "Queen" },
    { "@type": "BedDetails", numberOfBeds: 1, typeOfBed: "Single" },
    { "@type": "BedDetails", numberOfBeds: 1, typeOfBed: "Sofa" },
  ];
  accommodation.amenityFeature = [
    feature("wifi", true),
    feature("ac", true),
    feature("kitchen", true),
    feature("gymFitnessEquipment", true),
    feature("fireplace", true),
    feature("washerDryer", true),
    feature("heating", true),
    feature("parkingType", "Free"),
    feature("balcony", true),
    feature("outdoorGrill", true),
    feature("tv", true),
  ];
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
    ...(place.planning ? { dateModified: place.planning.reviewedOn } : {}),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: itemListElement.length,
      itemListElement,
    },
  };
}
