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
        "Spacious 4BR mountain home w/ sauna, office, gym + gear garage",
    },
    intro:
      "The ideal Utah mountain escape: a spacious 4-bedroom home built for families, remote workers, and groups who want comfort and convenience near Utah's best adventures. Enjoy two cozy living rooms, a dedicated office, desks and monitors in each bedroom, and a 2-car garage set up to store bikes, skis, boards, and more. Finish your day with the private 4-person sauna, then hang outside with the BBQ and fire pit in the fenced backyard.",
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
        src: "/images/granary/kitchen.jpg",
        alt: "Granary kitchen with a granite island and stainless appliances",
      },
      locationLabel: "Midway, Utah",
      title: "Granary",
      subtitle:
        "Charming 1BD/1BA ground-floor condo with mountain views, full kitchen, gas fireplace, and in-unit washer/dryer, walkable to Midway's restaurants and shops and a drive from Utah's best outdoor adventures.",
    },
    intro:
      "This charming 1BD/1BA ground-floor condo sleeps up to 4 and blends old-world character with modern comfort. Enjoy mountain views from the spacious open floor plan with a full kitchen and gas fireplace. Newly renovated with ample closet space, a pull-out sofa for extra sleeping space, and in-unit washer and dryer.",
    stats: [
      { value: "4", label: "Sleeps" },
      { value: "1", label: "Bedroom" },
      { value: "1", label: "Bath" },
      { value: "Walkable", label: "To Midway dining and shops" },
    ],
    stories: [
      {
        image: {
          src: "/images/granary/exterior.jpg",
          alt: "The Granary building in Midway with the mountains behind",
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
  {
    slug: 'daystar',
    seo: {
      title: "Daystar | Roamstead",
      description:
        "A family-friendly six-bedroom home in Solamere, minutes from the Deer Valley resort base, with an outdoor hot tub, an indoor sauna and an indoor sport court.",
    },
    hero: {
      image: {
        src: "/images/daystar/exterior.jpg",
        alt: "Daystar among aspens and pines with Deer Valley's ski runs behind",
      },
      locationLabel: "Deer Valley, Park City, Utah",
      title: "Daystar",
      subtitle:
        "Family-friendly Deer Valley retreat in Solamere, just minutes from the resort base. After a day on the slopes, unwind in the outdoor hot tub, indoor sauna, or one of three soaking tubs. The main level features an open floor plan with a pool table, large kitchen, and two dining areas. Two living rooms and an indoor sport court provide space for everyone to relax and play.",
    },
    intro:
      "Make unforgettable memories at this spacious Deer Valley home in Solamere, just minutes from the resort base. After skiing, relax in the outdoor hot tub, indoor sauna, or one of the soaking tubs. The main level offers an open layout with a pool table, living room, large kitchen, and two dining areas so everyone has a seat to gather. Two distinct living rooms create separate hangout spaces, while the indoor sport court invites friendly competition. The entire property is available for guest access.",
    stats: [
      { value: "12", label: "Sleeps" },
      { value: "6", label: "Bedrooms" },
      { value: "6", label: "Baths" },
      { value: "Indoor", label: "Sport court" },
    ],
    stories: [
      {
        image: {
          src: "/images/daystar/kitchen.jpg",
          alt: "Large kitchen with a granite island, timber beams and tile floors",
        },
        paragraphs: [
          "Mornings start on the main level, an open layout with a large kitchen and two dining areas, so everyone has a seat.",
          "When it's time to ski, the neighborhood's free shuttle to Deer Valley comes at the touch of a button, running from 7 AM to 4:30 PM.",
        ],
      },
      {
        image: {
          src: "/images/daystar/hot-tub.jpg",
          alt: "Deck with lounge chairs and the outdoor hot tub",
        },
        paragraphs: [
          "After a day on the slopes, the house takes care of recovery: an outdoor hot tub, an indoor sauna, and three soaking tubs. If you'd rather head into town, the free public bus from the Deer Valley base reaches all of Park City, Main Street included, with frequent service.",
        ],
      },
      {
        image: {
          src: "/images/daystar/pool-table.jpg",
          alt: "Pool table on the main level beside the kitchen bar",
        },
        paragraphs: [
          "Evenings spread out. Two distinct living rooms give everyone their own place to hang out, there's a fireplace and a pool table on the main level, and the indoor sport court invites some friendly competition.",
        ],
      },
    ],
    details: [
      {
        heading: "The Home",
        items: [
          "6 bedrooms, 6 private baths",
          "Open main level with pool table",
          "Large, chef-ready kitchen",
          "Two dining areas",
          "Two living rooms",
          "Fireplace",
          "Three soaking tubs",
          "Washer and dryer",
          "Smart TV and fast Wi-Fi",
        ],
      },
      {
        heading: "Sleeping arrangements",
        items: [
          "6 bedrooms, 8 beds",
          "2 King beds",
          "2 Queen beds",
          "Full bunk beds",
        ],
      },
      {
        heading: "Grounds & shared spaces",
        items: [
          "Outdoor hot tub",
          "Indoor sauna",
          "Indoor sport court",
          "Pool table",
          "Outdoor grill",
        ],
      },
      {
        heading: "Practical notes",
        items: [
          "Free parking",
          "Free Deer Valley shuttle, 7 AM to 4:30 PM",
          "Entire property available to guests",
          "Family-friendly",
          "Smoke detector, carbon monoxide detector, fire extinguisher, first aid kit",
        ],
      },
    ],
    location: {
      paragraphs: [
        "Daystar is in Solamere, a Deer Valley neighborhood just minutes from the resort base. The neighborhood runs a free shuttle to Deer Valley with one touch of a button, from 7 AM to 4:30 PM.",
        "From the Deer Valley base, the free public bus system reaches all areas of Park City, including Main Street, with frequent service.",
      ],
      mapQuery: "Deer Valley Resort, Park City, UT",
    },
    bookingUrl: "https://www.roamstead-co.com/listings/daystar-deer-valley",
  },
  {
    slug: 'lowell',
    seo: {
      title: "The Lowell | Roamstead",
      description:
        "A brand-new two-bedroom condo at the base of Park City Mountain Resort, about thirty steps from the snow, with a steam shower, heated pool and hot tub.",
    },
    hero: {
      image: {
        src: "/images/lowell/exterior.jpg",
        alt: "The Lowell building at the base of Park City Mountain Resort",
      },
      locationLabel: "Park City, Utah",
      title: "The Lowell",
      subtitle:
        "Brand-new condo at the base of Park City Mountain Resort, walk about 30 steps and you're on the snow. Enjoy a steam shower and bathtub, a piano and chess table, and a full kitchen. Building amenities include a fitness center, hot tub, heated pool, underground parking, ski storage, and an on-site rental and tuning shop. Easy access to Main Street via the resort bus hub.",
    },
    intro:
      "This spacious, modern condo is located steps from the base of Park City Mountain Resort with unbeatable walkability to the lifts and snow. Inside you'll find a full kitchen, in-unit washer and dryer, large dining table, piano, chess table, complimentary Wi-Fi, and flat-screen TVs in both bedrooms. After a day outside, unwind with a steam shower and soak in the bathtub. Guests also have access to the building's heated outdoor pool, hot tub, fitness center, elevator, underground parking, and ski storage. Keyless entry is available for self check-in, and local recommendations are available for guides, drivers, restaurants, and activities.",
    stats: [
      { value: "8", label: "Sleeps" },
      { value: "2", label: "Bedrooms" },
      { value: "2", label: "Baths" },
      { value: "30 steps", label: "To the snow" },
    ],
    stories: [
      {
        image: {
          src: "/images/lowell/kitchen.jpg",
          alt: "Full kitchen with a granite island and bar stools",
        },
        paragraphs: [
          "Mornings start with the walk to the lifts, about thirty steps from the building. Ski storage is in the building, and there's an on-site rental and tuning shop for everything else.",
        ],
      },
      {
        image: {
          src: "/images/lowell/pool.jpg",
          alt: "Heated outdoor pool beside the building at dusk",
        },
        paragraphs: [
          "After a day outside, there's the steam shower and a soak in the bathtub. The building has a heated outdoor pool, a hot tub and a fitness center.",
          "For town, the nearby resort bus stop runs frequently and reaches Historic Main Street in about three to five minutes, or it's about fifteen minutes on foot.",
        ],
      },
      {
        image: {
          src: "/images/lowell/dining.jpg",
          alt: "Large dining table beside floor-to-ceiling windows",
        },
        paragraphs: [
          "Evenings come together around the large dining table, which seats about ten, with the full kitchen close by. There's a piano and a chess table, and flat-screen TVs in both bedrooms.",
        ],
      },
    ],
    details: [
      {
        heading: "The Home",
        items: [
          "Brand-new condo",
          "2 bedrooms, 2 private baths",
          "Full kitchen",
          "Large dining table (seats about 10)",
          "Piano and chess table",
          "Steam shower and bathtub",
          "In-unit washer and dryer",
          "Flat-screen TVs in both bedrooms",
          "Air conditioning and heating",
          "Fast Wi-Fi",
        ],
      },
      {
        heading: "Sleeping arrangements",
        items: [
          "Bedroom 1: King bed and twin daybed",
          "Bedroom 2: 2 Queen beds and full-size futon",
        ],
      },
      {
        heading: "Grounds & shared spaces",
        items: [
          "Heated outdoor pool",
          "Outdoor hot tub",
          "Fitness center",
          "Elevator",
          "Underground parking",
          "Ski storage",
          "On-site ski rental and tuning shop",
        ],
      },
      {
        heading: "Practical notes",
        items: [
          "Keyless self check-in",
          "Underground parking",
          "Host reachable by call or text 24/7",
          "Local recommendations for guides, drivers, restaurants and activities",
          "Smoke detector, carbon monoxide detector, fire extinguisher, first aid kit",
        ],
      },
    ],
    location: {
      paragraphs: [
        "The Lowell sits at the base area of Park City Mountain Resort. Walk out and you're right by the mountain, with a resort bus stop nearby.",
        "The bus runs frequently and reaches Historic Main Street in about three to five minutes. Main Street is also walkable, about fifteen minutes on foot.",
      ],
      mapQuery: "Park City Mountain Resort, Park City, UT",
    },
    bookingUrl: "https://www.roamstead-co.com/listings/lowell-302",
  },
  {
    slug: 'powder-room',
    seo: {
      title: "Powder Room | Roamstead",
      description:
        "A hotel-style studio at the base of Park City Mountain Resort, steps from the snow, with a king bed, an outdoor pool and hot tub, and a fitness center.",
    },
    hero: {
      image: {
        src: "/images/powder-room/resort-base.jpg",
        alt: "Aerial view of the Park City Mountain Resort base area in winter",
      },
      locationLabel: "Park City, Utah",
      title: "Powder Room",
      subtitle:
        "Hotel-style ski-base studio w/ king bed, futon, pool + hot tub",
    },
    intro:
      "Located at the base of Park City Mountain Resort, this hotel-style unit is steps from the snow and built for easy mountain days. After exploring the resort or town, unwind in the outdoor pool and hot tub, or get a quick workout in the fitness center. The unit features a comfy king bed, a queen futon, and a full private bathroom, plus a kitchenette with a microwave, mini fridge, and kettle and coffee maker. In the winter, guests receive equipment discounts and nightly ski storage through Park City Sport on site.",
    stats: [
      { value: "4", label: "Sleeps" },
      { value: "Studio", label: "Layout" },
      { value: "1", label: "Bath" },
      { value: "Ski base", label: "Steps from the snow" },
    ],
    stories: [
      {
        image: {
          src: "/images/powder-room/exterior.jpg",
          alt: "The building at the resort base under a blue sky",
        },
        paragraphs: [
          "Mornings start close to the lifts. The building is at the base area, with quick access to the mountain and its services.",
          "In winter, guests get equipment discounts and nightly ski storage through Park City Sport, right on site.",
        ],
      },
      {
        image: {
          src: "/images/powder-room/pool.jpg",
          alt: "Outdoor pool and lounge chairs with the mountains beyond",
        },
        paragraphs: [
          "After exploring the resort or town, there's the outdoor pool and hot tub, or a quick workout in the fitness center. The free bus stop nearby runs about every five minutes and typically reaches Historic Main Street in three to five.",
        ],
      },
      {
        image: {
          src: "/images/powder-room/bedroom.jpg",
          alt: "King bed and futon in the studio",
        },
        paragraphs: [
          "Evenings keep it simple. The kitchenette has a microwave, a mini fridge, and a coffee maker and kettle, and the building has an outdoor BBQ grill. Then it's back to the king bed.",
        ],
      },
    ],
    details: [
      {
        heading: "The Home",
        items: [
          "Hotel-style studio",
          "1 private full bath",
          "Kitchenette: microwave, mini fridge, coffee maker and kettle",
          "Cups, mugs and flatware",
          "Air conditioning and heating",
          "Fast Wi-Fi",
        ],
      },
      {
        heading: "Sleeping arrangements",
        items: [
          "1 California King",
          "1 full/queen futon (sleeps 2)",
          "Best fit: 2 adults and 2 small children, or 3 adults",
        ],
      },
      {
        heading: "Grounds & shared spaces",
        items: [
          "Outdoor pool",
          "Outdoor hot tub",
          "Fitness center",
          "Outdoor BBQ grill",
          "Elevator",
          "Underground parking",
          "On-site ski rental and tuning (Park City Sport)",
          "Ski gear storage",
        ],
      },
      {
        heading: "Practical notes",
        items: [
          "Winter equipment discounts and nightly ski storage through Park City Sport",
          "Optional daily maid and concierge services, extra cost, subject to availability",
          "Host reachable by call or text 24/7",
          "Smoke detector, carbon monoxide detector",
        ],
      },
    ],
    location: {
      paragraphs: [
        "Powder Room is at the base area of Park City Mountain Resort, with quick access to the lifts and mountain services.",
        "The base is a hub for many bus routes, so it's simple to get around Park City without a car. The free bus stop nearby runs about every five minutes and typically reaches Historic Main Street in three to five.",
      ],
      mapQuery: "Park City Mountain Resort, Park City, UT",
    },
    bookingUrl: "https://www.roamstead-co.com/listings/powder-room",
  },
];

export function getProperty(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug);
}
