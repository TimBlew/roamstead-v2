import type { Metadata } from "next";
import type { Property } from "@/data/properties";
import { socialImage } from "@/lib/site";

export type PlaceSlug = "midway" | "park-city";

export interface PlaceStay {
  slug: string;
  summary: string;
  /** Replaces the property stat line when the hub should not repeat an occupancy figure. */
  facts?: string;
  image: { src: string; alt: string };
}

export interface PlaceComparisonStay {
  slug: string;
  kind: string;
  points: readonly string[];
}

export interface PlaceComparison {
  heading: string;
  intro: string;
  stays: readonly [PlaceComparisonStay, PlaceComparisonStay];
}

export interface PlacePlanningBlock {
  title: string;
  paragraphs: readonly string[];
  sourceLabel: string;
  sourceHref: string;
}

export interface PlacePlanning {
  heading: string;
  reviewed: string;
  blocks: readonly PlacePlanningBlock[];
}

export interface PlaceLodgingNote {
  heading: string;
  body: string;
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
  comparison?: PlaceComparison;
  planning?: PlacePlanning;
  lodgingNotes?: readonly PlaceLodgingNote[];
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
        "Compare Hygge House, a four-bedroom home in Midway, Utah, with an office, sauna, and laundry, and Granary, a one-bedroom condo with a kitchen and gas fireplace.",
    },
    eyebrow: "Utah",
    title: "Midway",
    deck: "The valley, mountains in view.",
    lede: "A four-bedroom home and a one-bedroom condo, both in Midway.",
    hero: {
      src: "/images/book-direct-sunset.png",
      alt: "Hygge House surrounded by trees beneath the mountains and warm sunset sky in Midway, Utah",
      className: "object-cover object-[68%_center]",
      caption: "Hygge House, Midway",
    },
    essay: [
      "Hygge House is a four-bedroom home. Granary is a one-bedroom condo. Both are in Midway, and they suit different trips.",
      "The comparison uses bedroom counts and amenities already published on each stay. Open the stay that fits, then check dates there.",
    ],
    staysHeading: "Hygge House and Granary.",
    staysIntro: "The house for more bedrooms. The condo for a smaller stay.",
    stays: [
      {
        slug: "hygge-house",
        summary:
          "Four bedrooms, a dedicated office and desks, a sauna, laundry, gear storage, and two living spaces.",
        facts: "4 bedrooms · Office and desks · Sauna",
        image: {
          src: "/images/hygge-house/kitchen.jpg",
          alt: "Open kitchen with a large butcher-block island and stools",
        },
      },
      {
        slug: "granary",
        summary:
          "One bedroom with a king bed and a sofa bed, a kitchen, laundry, and a gas fireplace.",
        facts: "1 bedroom · King and sofa bed · Gas fireplace",
        image: {
          src: "/images/granary/fireplace.jpg",
          alt: "Living room seating around the gas fireplace",
        },
      },
    ],
    comparison: {
      heading: "Two ways to stay in Midway.",
      intro:
        "Hygge House is a four-bedroom home. Granary is a one-bedroom condo. Compare the amenities, then check dates for the stay that fits.",
      stays: [
        {
          slug: "hygge-house",
          kind: "Home",
          points: [
            "Four bedrooms",
            "Dedicated office and desks",
            "Sauna",
            "Laundry, gear storage, and two living spaces",
          ],
        },
        {
          slug: "granary",
          kind: "Condo",
          points: [
            "One bedroom",
            "King bed and a sofa bed",
            "Kitchen and laundry",
            "Gas fireplace",
          ],
        },
      ],
    },
    planning: {
      heading: "Planning a Midway activity",
      reviewed: "Activity details last reviewed November 9, 2026.",
      blocks: [
        {
          title: "Soldier Hollow",
          paragraphs: [
            "Soldier Hollow Nordic Center is in Midway. The official FAQ says the center is closed until the winter season starts, and that the opening date depends on snow. Nordic skiing and tubing there are snow-dependent.",
            "That FAQ also includes an undated December 21 tubing note. The note is not a current opening date. Check the official page for operating status before you go.",
            "Tickets and activities are booked with Soldier Hollow. A stay at Hygge House or Granary does not include admission, gear, or a reserved time.",
          ],
          sourceLabel: "Soldier Hollow FAQ",
          sourceHref: "https://utaholympiclegacy.org/faq/soldier-hollow/",
        },
        {
          title: "Homestead Crater",
          paragraphs: [
            "The Crater is at Homestead in Midway. Reservations and admission are separate, and they are booked with Homestead.",
            "The official Crater page says it will be closed for renovations in April and May 2027. Neither stay includes Crater access.",
          ],
          sourceLabel: "Homestead Crater page",
          sourceHref: "https://homesteadmidwayutah.com/adventures/crater/",
        },
      ],
    },
    lodgingNotes: [
      {
        heading: "Wedding guests",
        body: "Wedding guests can book Hygge House or Granary for overnight lodging. Roamstead does not operate a wedding venue, and this page does not represent a venue partnership.",
      },
      {
        heading: "Work trips",
        body: "Hygge House has a dedicated office and desks for someone working during a stay. Granary is the one-bedroom condo. Both are overnight lodging. Meetings and events belong at a separate place with permission to host them.",
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
