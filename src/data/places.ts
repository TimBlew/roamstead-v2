import type { Metadata } from "next";
import type { Property } from "@/data/properties";
import { socialImage } from "@/lib/site";

export type PlaceSlug = "midway" | "park-city";

export interface PlaceStay {
  slug: string;
  summary: string;
  image: { src: string; alt: string };
}

export interface Place {
  slug: PlaceSlug;
  path: "/midway" | "/park-city";
  seo: { title: string; description: string };
  eyebrow: string;
  title: string;
  deck: string;
  lede: string;
  hero: {
    src: string;
    alt: string;
    className: string;
    caption: string;
  };
  essay: [string, string];
  staysHeading: string;
  staysIntro: string;
  stays: [PlaceStay, PlaceStay];
  otherSlug: PlaceSlug;
  other: { title: string; body: string; cta: string };
}

// Prose stays inside facts already published on the property pages.
export const places: Record<PlaceSlug, Place> = {
  midway: {
    slug: "midway",
    path: "/midway",
    seo: {
      title: "Midway stays | Roamstead Collective",
      description:
        "Two homes in Midway, Utah. Hygge House sleeps ten, with a private sauna and a garage for bikes, skis, and boards. Granary is a one-bedroom condo, walkable to town.",
    },
    eyebrow: "Utah",
    title: "Midway",
    deck: "The valley, mountains in view.",
    lede: "Two homes here. A house among the trees, and a ground-floor condo you can walk from into town.",
    hero: {
      src: "/images/book-direct-sunset.png",
      alt: "Hygge House surrounded by trees beneath the mountains and warm sunset sky in Midway, Utah",
      className: "object-cover object-[68%_center]",
      caption: "Hygge House, Midway",
    },
    essay: [
      "Hygge House sits among the trees, with the valley out past the deck and mountain air off it. The upstairs queen bedroom looks out at the mountains. Granary is the smaller stay, a ground-floor condo with those mountains in view from inside, and Midway's restaurants and shops within walking distance.",
      "They are sized for different weeks. Hygge House sleeps ten: an island for eight, a private four-person sauna, a fenced yard, and a garage that takes bikes, skis, boards, and a gym. Granary sleeps four, with a gas fireplace and a full kitchen, when the group is smaller.",
    ],
    staysHeading: "Hygge House and Granary.",
    staysIntro: "A house for a full group. A condo for a quieter week.",
    stays: [
      {
        slug: "hygge-house",
        summary:
          "The office is set up for a longer stay. The day can end in the yard, with a four-person sauna, a five-chair fire pit, and the grill on the deck. Pets are allowed.",
        image: {
          src: "/images/hygge-house/kitchen.jpg",
          alt: "Open kitchen with a large butcher-block island and stools",
        },
      },
      {
        slug: "granary",
        summary:
          "A king bed, a pull-out couch, and a gas fireplace when you come in. The kitchen has a Keurig, a dishwasher, and a table for four. One covered parking spot comes with the condo.",
        image: {
          src: "/images/granary/fireplace.jpg",
          alt: "Living room seating around the gas fireplace",
        },
      },
    ],
    otherSlug: "park-city",
    other: {
      title: "Park City",
      body: "The Lowell and Powder Room, at the base of Park City Mountain.",
      cta: "See Park City",
    },
  },
  "park-city": {
    slug: "park-city",
    path: "/park-city",
    seo: {
      title: "Park City stays | Roamstead Collective",
      description:
        "The Lowell and Powder Room sit at the base of Park City Mountain Resort. A two-bedroom about thirty steps from the snow, and a studio in the same building.",
    },
    eyebrow: "Utah",
    title: "Park City",
    deck: "At the base of the mountain.",
    lede: "Two stays at Park City Mountain Resort. A condo about thirty steps from the snow, and a studio in the same building.",
    hero: {
      src: "/images/lowell/exterior.jpg",
      alt: "The Lowell building at the base of Park City Mountain Resort",
      className: "object-cover object-[center_78%] lg:object-[center_46%]",
      caption: "The Lowell, Park City Mountain",
    },
    essay: [
      "The Lowell and Powder Room both sit at the resort base. From The Lowell, it is about thirty steps to the snow. Powder Room is steps from it too, in the same building, with ski storage on site.",
      "Historic Main Street is a short ride on the resort bus, typically three to five minutes. From The Lowell, Main Street is also about fifteen minutes on foot. Winter is the obvious season for these two.",
    ],
    staysHeading: "The Lowell and Powder Room.",
    staysIntro: "The Lowell for a group. Powder Room for a smaller stay.",
    stays: [
      {
        slug: "lowell",
        summary:
          "A full kitchen, a steam shower, and a dining table that seats about ten. The building has a heated pool, a hot tub, ski storage, and an on-site rental and tuning shop.",
        image: {
          src: "/images/lowell/dining.jpg",
          alt: "Large dining table beside floor-to-ceiling windows",
        },
      },
      {
        slug: "powder-room",
        summary:
          "A king bed, a futon, and a kitchenette with a microwave, mini fridge, coffee maker, and kettle. The outdoor pool, hot tub, and fitness center are in the building. In winter, guests get equipment discounts and nightly ski storage through Park City Sport.",
        image: {
          src: "/images/powder-room/bedroom.jpg",
          alt: "Powder Room studio bedroom and seating",
        },
      },
    ],
    otherSlug: "midway",
    other: {
      title: "Midway",
      body: "Hygge House and Granary, in the valley with the mountains in view.",
      cta: "See Midway",
    },
  },
};

export const placePaths = [places.midway.path, places["park-city"].path] as const;

export function getPlace(slug: PlaceSlug): Place {
  return places[slug];
}

export function placePathForLabel(label: string): "/midway" | "/park-city" | undefined {
  const value = label.toLowerCase();
  if (value.includes("midway")) return "/midway";
  if (value.includes("park city")) return "/park-city";
  return undefined;
}

export function placeLinkLabel(label: string): string | undefined {
  if (label.toLowerCase().includes("midway")) return "Staying in Midway";
  if (label.toLowerCase().includes("park city")) return "Staying in Park City";
  return undefined;
}

export function stayFacts(property: Property): string {
  if (property.slug === "powder-room") return "Sleeps 4 · Studio · 1 Bath";
  return property.stats
    .slice(0, 3)
    .map((stat) => (stat.label.toLowerCase() === "sleeps" ? `Sleeps ${stat.value}` : `${stat.value} ${stat.label}`))
    .join(" · ");
}

export function placeMetadata(place: Place): Metadata {
  return {
    alternates: { canonical: place.path },
    title: place.seo.title,
    description: place.seo.description,
    openGraph: {
      images: [socialImage],
      title: place.seo.title,
      description: place.seo.description,
    },
    twitter: {
      card: "summary_large_image",
      images: [socialImage],
      title: place.seo.title,
      description: place.seo.description,
    },
  };
}
