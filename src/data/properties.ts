export interface PropertyImage {
  src: string;
  alt: string;
}

export interface PropertyStat {
  value: string;
  label: string;
}

export interface PropertyStory {
  image: PropertyImage;
  paragraphs: string[];
}

export interface PropertyDetailList {
  heading: string;
  items: string[];
}

export interface Property {
  slug: string;
  seo: {
    title: string;
    description: string;
  };
  hero: {
    image: PropertyImage;
    locationLabel: string;
    title: string;
    subtitle: string;
  };
  intro: string;
  stats: PropertyStat[];
  stories: [PropertyStory, PropertyStory, PropertyStory];
  details: PropertyDetailList[];
  location: {
    paragraphs: string[];
    // Map embed query: a street address for the Senator, town or resort base for homes
    mapQuery: string;
  };
  bookingUrl: string;
}

export const properties: Property[] = [
  {
    slug: 'senator',
    seo: {
      title: "The Heber Senator | Roamstead",
      description:
        "A historic 1902 home in Heber City, Utah, with ten individually appointed rooms, a cooked-to-order breakfast every morning, and Deer Valley fifteen minutes away.",
    },
    hero: {
      image: {
        src: "/images/senator/exterior.webp",
        alt: "The Heber Senator, a red sandstone Victorian home, at sunset",
      },
      locationLabel: "Heber Valley, Utah",
      title: "The Heber Senator",
      subtitle:
        "A historic home for people who work from everywhere: three blocks from Main Street, fifteen minutes from the mountains.",
    },
    intro:
      "Built in 1902 by Utah State Senator Joseph Murdock, The Senator is a 9,000-square-foot home on a quiet street in Heber City, three blocks from Main Street, fifteen minutes from Deer Valley, twenty from Park City. Ten individually appointed rooms across three floors, a cooked-to-order breakfast every morning, and the kind of pace that lets you get your work done and still make it outside before the light changes.",
    stats: [
      { value: "10", label: "Rooms" },
      { value: "3", label: "Floors" },
      { value: "9,000", label: "Sq ft." },
      { value: "B&B", label: "Property type" },
    ],
    stories: [
      {
        image: {
          src: "/images/senator/room-bright.jpg",
          alt: "A bright top-floor guest room with a coffered ceiling and gilded mirror",
        },
        paragraphs: [
          "Mornings start in the dining room. A full cooked-to-order breakfast, house-made crepes, something warm, the menu changes, while the valley is still quiet and Timpanogos catches the first light through the windows.",
          "Most people open a laptop afterward. The Wi-Fi is fast, each room has its own workspace, and the commons area has room to spread out if your room starts to feel small.",
        ],
      },
      {
        image: {
          src: "/images/senator/room-sunlit.jpg",
          alt: "A sunlit guest room with a sleigh bed and a reading chair by the windows",
        },
        paragraphs: [
          "Coming back from a trail run on the Provo River or an afternoon at Deer Valley, the house absorbs you again. Central heating through the whole building, the living room commons with its fireplace, the feeling of a place that was built to hold a family of thirteen and still knows how to hold people.",
        ],
      },
      {
        image: {
          src: "/images/senator/room-green.jpg",
          alt: "A guest room with green damask wallpaper and a carved wooden bed",
        },
        paragraphs: [
          "Evenings move outside to the fire pit, or stay in the commons. This is where the B&B does something a hotel can't: strangers start talking because the house makes it easy, not because anyone forces it. The wraparound porch in summer. The garden when the light goes long.",
        ],
      },
    ],
    details: [
      {
        heading: "The House",
        items: [
          "Historic 1902 three-storey home",
          "9,000 sq ft across three floors",
          "10 individually decorated rooms",
          "Central heating throughout",
          "Living room commons with fireplace",
          "Communal dining room",
        ],
      },
      {
        heading: "Every Room Includes",
        items: [
          "Individual air conditioning",
          "Dedicated workspace",
          "High-speed Wi-Fi",
          "TV with satellite channels",
          "Premium bedding & Egyptian cotton sheets",
          "Hair dryer, iron, towels & linens",
          "Locking door & in-room safe",
        ],
      },
      {
        heading: "Grounds & shared spaces",
        items: [
          "Wraparound porch",
          "Fire pit with seating",
          "Garden & picnic area",
          "TV with satellite channels",
          "EV charging point",
          "Self-serve laundry",
          "Ski & bike storage",
        ],
      },
      {
        heading: "Practical notes",
        items: [
          "Free parking on site",
          "Full breakfast included daily",
          "Check-in from 3:00 PM",
          "Check-out by 11:00 AM",
          "Front desk 8:30 AM to 6:00 PM MST",
          "No pets (service animals welcome)",
          "100% smoke-free property",
          "ADA accessible room available",
        ],
      },
    ],
    location: {
      paragraphs: [
        "The Senator sits on a quiet residential street at 118 South 300 West, three blocks from Heber City's Main Street, which still feels like it belongs to the people who live there. The town has good restaurants, a grocery store, and the Heber Valley Railroad running through it. It's quieter than Park City, less expensive than Deer Valley, and closer to both than most people realise.",
        "Deer Valley is fifteen minutes by car. Park City's Main Street is twenty. Jordanelle Reservoir is five minutes down the road, and the Provo River trail runs along the edge of town. Good for running, better for clearing your head. Four ski resorts within reach, three lakes, and miles of wilderness trail. The valley sits between the Wasatch Range and the Uinta Mountains, and you feel it from every window.",
      ],
      mapQuery: "118 S 300 W, Heber City, UT 84032",
    },
    bookingUrl: "https://us2.cloudbeds.com/reservation/j0tTa0",
  },
  {
    slug: 'hygge-house',
    seo: {
      title: "Hygge House | Roamstead",
      description:
        "A spacious four-bedroom mountain home in Midway, Utah, with a private sauna, a dedicated office, and a garage gym set up for bikes, skis and boards.",
    },
    hero: {
      image: {
        src: "/images/hygge-house/exterior.jpg",
        alt: "Hygge House among the trees in Midway with the mountains behind",
      },
      locationLabel: "Midway, Utah",
      title: "Hygge House",
      subtitle:
        "A spacious four-bedroom mountain home with a private sauna, a dedicated office, and a garage gym built around your gear.",
    },
    intro:
      "Hygge House is a spacious four-bedroom home in Midway, built for families, remote workers, and groups who want comfort and convenience near some of Utah's best adventures. Two living rooms, a dedicated office, a desk and monitor in the bedrooms, and a two-car garage set up to store bikes, skis and boards. It sleeps ten.",
    stats: [
      { value: "10", label: "Sleeps" },
      { value: "4", label: "Bedrooms" },
      { value: "3", label: "Baths" },
      { value: "Sauna", label: "Private, 4-person" },
    ],
    stories: [
      {
        image: {
          src: "/images/hygge-house/kitchen.jpg",
          alt: "Open kitchen with a large butcher-block island and stools",
        },
        paragraphs: [
          "Mornings start upstairs in the open kitchen. The island seats eight, the dining table expands, and the deck is a step away for grilling and mountain air.",
          "Most people open a laptop afterward. The office has a standing desk and monitor, the bedrooms have desks and monitors of their own, and the Wi-Fi is fast.",
        ],
      },
      {
        image: {
          src: "/images/hygge-house/garage-gym.jpg",
          alt: "Two-car garage set up as a gym with a squat rack and bench",
        },
        paragraphs: [
          "Coming back from the day, the gear has somewhere to go. The two-car garage is set up to store bikes, skis and boards, and it doubles as a private gym with a rack, bench, dumbbells and yoga mats. The driveway fits four cars, with room for a trailer, boat or RV.",
        ],
      },
      {
        image: {
          src: "/images/hygge-house/backyard-sauna.jpg",
          alt: "Fenced backyard lawn with the private barrel sauna",
        },
        paragraphs: [
          "Evenings move to the backyard. Patio dining for six, lounge chairs, a lush lawn, and a five-chair fire pit, all inside a fully fenced yard for kids and pets. The private four-person sauna is tucked away for post-adventure recovery. Downstairs, the second living room is made for movie nights, with an electric piano and a game table that seats eight.",
        ],
      },
    ],
    details: [
      {
        heading: "The Home",
        items: [
          "4 bedrooms, 3 baths",
          "Open-concept living and kitchen",
          "Kitchen island seats 8, expandable dining table",
          "Two living rooms",
          "Dedicated office with standing desk and monitor",
          "Desk and monitor in the bedrooms",
          "Electric piano and game table that seats 8",
          "Full laundry room with washer and dryer",
          "Fast Wi-Fi",
        ],
      },
      {
        heading: "Sleeping arrangements",
        items: [
          "Primary bedroom: King Tempur-Pedic, walk-in closet, standing desk",
          "Bedroom 1: Queen, en-suite bath, desk, mountain views",
          "Bedroom 2: Queen, TV, desk",
          "Bedroom 3: Twin trundle (sleeps 1 to 2), desk",
          "Office: pull-out sofa bed (sleeps 1)",
        ],
      },
      {
        heading: "Grounds & shared spaces",
        items: [
          "Private 4-person sauna",
          "Deck with BBQ grill",
          "Patio dining for 6 and lounge chairs",
          "Five-chair fire pit",
          "Fully fenced backyard and lawn",
          "Two-car garage gym: rack, bench, dumbbells, yoga mats",
          "Bike, ski and board storage",
        ],
      },
      {
        heading: "Practical notes",
        items: [
          "Free parking: driveway fits 4 cars",
          "Room for a trailer, boat or RV",
          "Pets allowed",
          "Two owner closets are locked and clearly marked",
        ],
      },
    ],
    location: {
      paragraphs: [
        "Hygge House is in Midway, Utah, near some of the state's best adventures. There's mountain air off the deck, and mountain views from the upstairs queen bedroom with its own en-suite bath.",
      ],
      mapQuery: "Midway, UT",
    },
    bookingUrl: "https://www.roamstead-co.com/listings/house-midway",
  },
  {
    slug: 'granary',
    seo: {
      title: "Granary | Roamstead",
      description:
        "A newly renovated one-bedroom condo in Midway, Utah, with mountain views, a gas fireplace and a full kitchen, walkable to Midway's restaurants and shops.",
    },
    hero: {
      image: {
        src: "/images/granary/exterior.jpg",
        alt: "The Granary building in Midway with the mountains behind",
      },
      locationLabel: "Midway, Utah",
      title: "Granary",
      subtitle:
        "A ground-floor condo with mountain views and a gas fireplace, a walk from Midway's restaurants and shops.",
    },
    intro:
      "Granary is a newly renovated one-bedroom, ground-floor condo in Midway that blends old-world character with modern comfort. An open floor plan with mountain views, a full kitchen, a gas fireplace, and an in-unit washer and dryer. A king bed and a pull-out sofa mean it sleeps up to four.",
    stats: [
      { value: "4", label: "Sleeps" },
      { value: "1", label: "Bedroom" },
      { value: "1", label: "Bath" },
      { value: "Walkable", label: "To Midway dining and shops" },
    ],
    stories: [
      {
        image: {
          src: "/images/granary/kitchen.jpg",
          alt: "Kitchen with a granite island and stainless appliances",
        },
        paragraphs: [
          "Mornings start at the Keurig. The kitchen is fully stocked, with a dishwasher and a dining table for four, and the open floor plan looks out to the mountains.",
          "If the day starts with a laptop, there's a dedicated workspace and fast Wi-Fi.",
        ],
      },
      {
        image: {
          src: "/images/granary/dining.jpg",
          alt: "Dining table for four beside a bright window",
        },
        paragraphs: [
          "Afternoons go wherever you want them to. Midway's restaurants and shops are within walking distance, and Utah's best outdoor adventures are a drive away. One covered parking spot comes with the condo, with more available on request.",
        ],
      },
      {
        image: {
          src: "/images/granary/fireplace.jpg",
          alt: "Living room seating around the gas fireplace",
        },
        paragraphs: [
          "Evenings settle around the gas fireplace. The living room has fireplace seating and a smart TV, and the pull-out couch makes room for two more. The bedroom has a king bed and ample closet space.",
        ],
      },
    ],
    details: [
      {
        heading: "The Home",
        items: [
          "Newly renovated ground-floor condo",
          "Open floor plan with mountain views",
          "Gas fireplace",
          "Fully stocked kitchen with Keurig and dishwasher",
          "Dining table for four",
          "In-unit washer and dryer",
          "Smart TV",
          "Dedicated workspace and fast Wi-Fi",
          "Ample closet space",
        ],
      },
      {
        heading: "Sleeping arrangements",
        items: [
          "Bedroom: 1 king bed",
          "Living room: pull-out couch",
        ],
      },
      {
        heading: "Grounds & shared spaces",
        items: [
          "Covered parking (1 spot)",
        ],
      },
      {
        heading: "Practical notes",
        items: [
          "Additional parking available on request",
          "Family-friendly",
          "Smoke detector, carbon monoxide detector, fire extinguisher, first aid kit",
        ],
      },
    ],
    location: {
      paragraphs: [
        "Granary is in Midway, Utah, within walking distance of the town's restaurants and shops. Utah's best outdoor adventures are a drive away, and the mountains are in view from inside.",
      ],
      mapQuery: "Midway, UT",
    },
    bookingUrl: "https://www.roamstead-co.com/listings/granary-midway",
  },
];

export function getProperty(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug);
}
