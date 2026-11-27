export const seasonalPages = {
  parkCity: {
    path: "/park-city/christmas-new-year",
    town: "Park City",
    townPath: "/park-city",
    title: "Christmas and New Year's at Park City Mountain | Studio Stay",
    description: "Planning Christmas or New Year's in Park City? Powder Room is a studio at the Park City Mountain base, with a pool and hot tub. Check dates and book direct.",
    heading: "Christmas and New Year's at the base of Park City Mountain",
    intro: "Powder Room is a studio at the Park City Mountain Resort base, steps from the snow. Check Christmas and New Year dates on the calendar and book direct.",
    slugs: ["powder-room", "lowell"],
    image: "/images/powder-room/bedroom.jpg",
    sections: [
      { listingId: 455633, slug: "powder-room" },
      {
        heading: "What your days can look like",
        paragraphs: [
          "The studio sits at the resort base, steps from the snow, with on-site ski rental, tuning, and ski storage through Park City Sport.",
          "The building has an outdoor pool, an outdoor hot tub, and a fitness center.",
          "Historic Main Street is close: the free bus stop nearby runs about every five minutes and typically gets there in three to five.",
        ],
      },
      {
        heading: "The studio",
        paragraphs: [
          "Sleeps 4: 1 California King and 1 full/queen futon. Best fit: 2 adults and 2 small children, or 3 adults.",
          "1 private full bath. Kitchenette with microwave, mini fridge, coffee maker, and kettle. Outdoor BBQ grill.",
          "Elevator and underground parking. Host reachable by call or text 24/7.",
          "Optional daily maid and concierge services, extra cost, subject to availability.",
        ],
      },
      {
        heading: "Need more room?",
        paragraphs: ["The Lowell, also at the Park City Mountain base, is a 2-bedroom condo that sleeps 8. Check dates on the calendar, or see The Lowell."],
        listingId: 455632, slug: "lowell",
      },
      {
        heading: "Booking",
        paragraphs: ["Pick your dates here, then finish payment securely with our booking partner."],
        cta: "Check Christmas and New Year dates", slug: "powder-room",
      },
    ],
    faq: [
      { question: "Is it ski-in, ski-out?", answer: "Powder Room is at the Park City Mountain Resort base, steps from the snow. We do not describe it as ski-in or ski-out." },
      { question: "What is the minimum stay?", answer: "The live calendar shows the minimum stay when you pick dates." },
      { question: "Do I need a car?", answer: "Not required to reach Main Street. The base is a hub for many bus routes." },
    ],
  },
  midway: {
    path: "/midway/december",
    town: "Midway",
    townPath: "/midway",
    title: "Midway, Utah in December | Fireplace Condo and Family Home",
    description: "December in Midway, in the Heber Valley. Granary, a 1-bedroom condo with a fireplace, and Hygge House, a 4-bedroom home with a sauna. Check dates and book direct.",
    heading: "December in Midway, Utah",
    intro: "Midway is a mountain town in the Heber Valley. Two Roamstead stays are here: Granary, a 1-bedroom condo, and Hygge House, a 4-bedroom home. Check December dates on the calendars and book direct.",
    slugs: ["granary", "hygge-house"],
    image: "/images/granary/exterior.jpg",
    sections: [
      {
        heading: "Granary, for two to four",
        paragraphs: ["A renovated ground-floor 1-bedroom condo with a gas fireplace, a full kitchen with a Keurig and dishwasher, mountain views, a dedicated workspace with fast Wi-Fi, and an in-unit washer and dryer. King bed plus a pull-out couch. One covered parking spot. Walk to Midway's restaurants and shops."],
        listingId: 455631, slug: "granary", cta: "Check Granary dates",
      },
      {
        heading: "Hygge House, for families and groups up to 10",
        paragraphs: ["Room for the whole group:", "Four bedrooms, three baths, a private 4-person sauna, a dedicated office, a garage gym with ski and bike storage, a fenced yard with a fire pit, and a kitchen island that seats 8. Pets allowed."],
        listingId: 455635, slug: "hygge-house", cta: "Check Hygge House dates",
      },
      {
        heading: "December dates",
        paragraphs: ["Use the calendars to see which nights are open and what minimum stay applies."],
      },
    ],
  },
};

export type SeasonalPageData = {
  path: string; town: string; townPath: string; title: string; description: string;
  heading: string; intro: string; slugs: string[]; image: string;
  sections: { heading?: string; paragraphs?: string[]; listingId?: number; slug?: string; cta?: string }[];
  faq?: { question: string; answer: string }[];
};
