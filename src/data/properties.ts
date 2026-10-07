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
  details: {
    house: string[];
    roomIncludes: string[];
    grounds: string[];
    practicalNotes: string[];
  };
  location: {
    paragraphs: string[];
    address: string;
  };
  bookingUrl: string;
}

export const properties: Property[] = [
  {
    slug: "senator",
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
    details: {
      house: [
        "Historic 1902 three-storey home",
        "9,000 sq ft across three floors",
        "10 individually decorated rooms",
        "Central heating throughout",
        "Living room commons with fireplace",
        "Communal dining room",
      ],
      roomIncludes: [
        "Individual air conditioning",
        "Dedicated workspace",
        "High-speed Wi-Fi",
        "TV with satellite channels",
        "Premium bedding & Egyptian cotton sheets",
        "Hair dryer, iron, towels & linens",
        "Locking door & in-room safe",
      ],
      grounds: [
        "Wraparound porch",
        "Fire pit with seating",
        "Garden & picnic area",
        "TV with satellite channels",
        "EV charging point",
        "Self-serve laundry",
        "Ski & bike storage",
      ],
      practicalNotes: [
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
    location: {
      paragraphs: [
        "The Senator sits on a quiet residential street at 118 South 300 West, three blocks from Heber City's Main Street, which still feels like it belongs to the people who live there. The town has good restaurants, a grocery store, and the Heber Valley Railroad running through it. It's quieter than Park City, less expensive than Deer Valley, and closer to both than most people realise.",
        "Deer Valley is fifteen minutes by car. Park City's Main Street is twenty. Jordanelle Reservoir is five minutes down the road, and the Provo River trail runs along the edge of town. Good for running, better for clearing your head. Four ski resorts within reach, three lakes, and miles of wilderness trail. The valley sits between the Wasatch Range and the Uinta Mountains, and you feel it from every window.",
      ],
      address: "118 S 300 W, Heber City, UT 84032",
    },
    bookingUrl: "https://us2.cloudbeds.com/reservation/j0tTa0",
  },
];

export function getProperty(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug);
}
