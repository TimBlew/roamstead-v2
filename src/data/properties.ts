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
  eyebrow: string;
  title: string;
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
        eyebrow: "Breakfast & workspace",
        title: "A slower start, with room to settle in",
        paragraphs: [
          "A full cooked-to-order breakfast is part of the stay, with house-made crepes and a rotating menu served in the dining room.",
          "Fast Wi-Fi, in-room workspaces, and the commons area make it easy to get a little work done when needed without giving up the character of the house.",
        ],
      },
      {
        image: {
          src: "/images/senator/room-sunlit.jpg",
          alt: "A sunlit guest room with a sleigh bed and a reading chair by the windows",
        },
        eyebrow: "Shared spaces",
        title: "A house that gives everyone room",
        paragraphs: [
          "The Senator was built to hold people. The living room commons, fireplace, and shared spaces give guests room to spread out, regroup, or simply stay in for a while between plans.",
        ],
      },
      {
        image: {
          src: "/images/senator/room-green.jpg",
          alt: "A guest room with green damask wallpaper and a carved wooden bed",
        },
        eyebrow: "Porch, garden & fire",
        title: "Plenty of places to linger",
        paragraphs: [
          "The wraparound porch, garden, fire pit, and commons create easy places to spend time outside the room. The setting leaves room for conversation when it happens, and quiet when it does not.",
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
        src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JhtTKjJmo2R3mPhsBJElt2FRYV/e4251f0c-76c0-4125-9077-c6d5063ae636.png",
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
        eyebrow: "Kitchen, dining & workspace",
        title: "Space to gather, with room to get things done",
        paragraphs: [
          "The open kitchen is built for a full house, with an island that seats eight, an expandable dining table, and the deck just outside for grilling and mountain air.",
          "A dedicated office with a standing desk and monitor, plus desks and monitors in the bedrooms, makes the home work just as well for longer stays and remote work.",
        ],
      },
      {
        image: {
          src: "/images/hygge-house/garage-gym.jpg",
          alt: "Two-car garage set up as a gym with a squat rack and bench",
        },
        eyebrow: "Garage, gym & gear",
        title: "Built for everything you bring with you",
        paragraphs: [
          "The two-car garage is set up for bikes, skis, boards, and other mountain gear, while also doubling as a private gym with a rack, bench, dumbbells, and yoga mats.",
          "The driveway fits four cars, with additional room for a trailer, boat, or RV.",
        ],
      },
      {
        image: {
          src: "/images/hygge-house/backyard-sauna.jpg",
          alt: "Fenced backyard lawn with the private barrel sauna",
        },
        eyebrow: "Sauna, yard & second living room",
        title: "Room to unwind your own way",
        paragraphs: [
          "The fenced backyard brings together patio dining, lounge seating, a lawn, a five-chair fire pit, and the private four-person sauna.",
          "Inside, the second living room adds another place to spread out, with an electric piano and a game table that seats eight.",
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
        "Charming 1BD/1BA ground-floor condo with mountain views, full kitchen, gas fireplace, and in-unit washer/dryer, walkable to Midway's restaurants and shops and a drive to Utah's best outdoor adventures.",
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
        eyebrow: "Kitchen & workspace",
        title: "Everything you need in a smaller footprint",
        paragraphs: [
          "The fully stocked kitchen includes a Keurig, dishwasher, and dining table for four, all within an open floor plan with mountain views.",
          "A dedicated workspace and fast Wi-Fi make the condo easy to use for longer stays or a little work between plans.",
        ],
      },
      {
        image: {
          src: "/images/granary/dining.jpg",
          alt: "Dining table for four beside a bright window",
        },
        eyebrow: "Midway at your doorstep",
        title: "Walk to town, drive to the mountains",
        paragraphs: [
          "Midway's restaurants and shops are within walking distance, while the valley's outdoor access is an easy drive away.",
          "One covered parking spot comes with the condo, with additional parking available on request.",
        ],
      },
      {
        image: {
          src: "/images/granary/fireplace.jpg",
          alt: "Living room seating around the gas fireplace",
        },
        eyebrow: "Fireplace & living space",
        title: "A comfortable place to come back to",
        paragraphs: [
          "The living room centers on the gas fireplace and smart TV, with a pull-out couch that adds room for two more guests.",
          "The bedroom has a king bed and ample closet space, keeping the stay comfortable without overcomplicating it.",
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
        eyebrow: "Kitchen & gathering space",
        title: "Made for a full house",
        paragraphs: [
          "The open main level brings together a large kitchen, two dining areas, and plenty of room for everyone to gather without feeling crowded.",
          "For ski days, the neighborhood's free Deer Valley shuttle runs from 7 AM to 4:30 PM and can be called with the touch of a button.",
        ],
      },
      {
        image: {
          src: "/images/daystar/hot-tub.jpg",
          alt: "Deck with lounge chairs and the outdoor hot tub",
        },
        eyebrow: "Hot tub, sauna & soaking tubs",
        title: "Plenty of ways to slow down",
        paragraphs: [
          "The outdoor hot tub, indoor sauna, and three soaking tubs give the house several ways to recharge between mountain days.",
          "For time in town, the free public bus from the Deer Valley base connects to Park City and Main Street with frequent service.",
        ],
      },
      {
        image: {
          src: "/images/daystar/pool-table.jpg",
          alt: "Pool table on the main level beside the kitchen bar",
        },
        eyebrow: "Living rooms, games & sport court",
        title: "Enough space for everyone to find their corner",
        paragraphs: [
          "Two distinct living rooms give larger groups options for gathering or spreading out. The main level adds a fireplace and pool table, while the indoor sport court creates another place to play.",
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
        eyebrow: "At the mountain base",
        title: "About thirty steps from the snow",
        paragraphs: [
          "The location does most of the work: the building sits about thirty steps from the snow, with ski storage and an on-site rental and tuning shop close at hand.",
        ],
      },
      {
        image: {
          src: "/images/lowell/pool.jpg",
          alt: "Heated outdoor pool beside the building at dusk",
        },
        eyebrow: "Pool, hot tub & steam shower",
        title: "Comfort built into the return",
        paragraphs: [
          "A steam shower and bathtub inside the condo pair with the building's heated outdoor pool, hot tub, and fitness center.",
          "Historic Main Street is about three to five minutes away by the frequent resort bus, or roughly fifteen minutes on foot.",
        ],
      },
      {
        image: {
          src: "/images/lowell/dining.jpg",
          alt: "Large dining table beside floor-to-ceiling windows",
        },
        eyebrow: "Dining & downtime",
        title: "Room to gather without leaving the condo",
        paragraphs: [
          "The large dining table seats about ten with the full kitchen close by, giving groups an easy place to come together.",
          "A piano, chess table, and flat-screen TVs in both bedrooms add quieter options when everyone wants something different.",
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
        eyebrow: "At the resort base",
        title: "Simple access to the mountain",
        paragraphs: [
          "The building sits at the Park City Mountain Resort base, with quick access to the lifts and mountain services.",
          "In winter, guests receive equipment discounts and nightly ski storage through Park City Sport on site.",
        ],
      },
      {
        image: {
          src: "/images/powder-room/pool.jpg",
          alt: "Outdoor pool and lounge chairs with the mountains beyond",
        },
        eyebrow: "Pool, hot tub & town access",
        title: "Easy options beyond the room",
        paragraphs: [
          "The building includes an outdoor pool, hot tub, and fitness center for time off the mountain.",
          "A nearby free bus stop runs about every five minutes and typically reaches Historic Main Street in three to five.",
        ],
      },
      {
        image: {
          src: "/images/powder-room/bedroom.jpg",
          alt: "King bed and futon in the studio",
        },
        eyebrow: "Studio essentials",
        title: "Everything needed for an easy stay",
        paragraphs: [
          "The kitchenette includes a microwave, mini fridge, coffee maker, and kettle, while an outdoor BBQ grill adds another simple meal option.",
          "Inside, the king bed and futon keep the studio straightforward and comfortable.",
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
