"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { propertyImageQuality } from "@/lib/property-image-quality";

type Photo = { src: string; alt: string };
const photo = (folder: string, file: string, alt: string): Photo => ({
  src: `/listings/${folder}/${file}.jpg`,
  alt,
});

const galleries: Record<string, Photo[]> = {
  "hygge-house": [
    photo("house-midway", "exterior-02", "Front of Hygge House, a white home with a dark garage door and covered entry"),
    photo("house-midway", "exterior-04", "Backyard patio with an outdoor dining set, lounge chairs, and stairs"),
    photo("house-midway", "living-03", "Living room with a light sofa, wooden coffee table, and white fireplace"),
    photo("house-midway", "living-05", "Dining table and sectional sofa in the second living room"),
    photo("house-midway", "living-02", "Home office with built-in shelves, a desk, and a loveseat"),
    photo("house-midway", "kitchen-01", "Kitchen with a wood island, four stools, and green cabinets"),
    photo("house-midway", "bedroom-01", "Bedroom with a dark bed, a desk by the window, and a ceiling fan"),
    photo("house-midway", "bedroom-03", "Guest bedroom with white bedding, wood nightstands, and a bench"),
    photo("house-midway", "sauna-01", "Wood sauna interior with a stone heater beside the glass door"),
    photo("house-midway", "sauna-02", "View from the sauna bench through the glass door to the yard"),
    photo("house-midway", "garage-01", "Garage gym with a squat rack, bench, and bikes stored on the wall"),
    photo("house-midway", "garage-03", "Squat rack, barbell, and weight bench in the garage gym"),
    { src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JhtTKjJmo2R3mPhsBJElt2FRYV/e4251f0c-76c0-4125-9077-c6d5063ae636.png", alt: "Aerial view of Hygge House among the trees, with mountains behind" },
  ],
  granary: [
    photo("granary", "living-01", "Open living room with a sofa, fireplace, and the kitchen beyond"),
    photo("granary", "living-02", "Kitchen island, dining table, and living room in one open space"),
    photo("granary", "living-03", "Fireplace seating with a sofa, armchair, and television"),
    photo("granary", "living-04", "Living room centered on the fireplace, television, and two armchairs"),
    photo("granary", "kitchen-01", "Kitchen with white cabinets, a granite island, and stainless appliances"),
    photo("granary", "dining-01", "Wood dining table with chairs under a chandelier"),
    photo("granary", "bedroom-01", "Bedroom with a white bed, metal headboard, and a window"),
    photo("granary", "bath-01", "Bathroom with a granite vanity, toilet, and tub-shower"),
    { src: "/images/granary/exterior.jpg", alt: "The Granary building along the street, with mountains behind" },
  ],
  lowell: [
    photo("lowell-302", "living-01", "Living room with a brown leather sectional and ottoman"),
    photo("lowell-302", "living-02", "Open living and dining space with a kitchen island and large windows"),
    photo("lowell-302", "kitchen-01", "Kitchen with a black stone island, wood cabinets, and leather stools"),
    photo("lowell-302", "dining-01", "Long dining table set by windows looking onto the hillside"),
    photo("lowell-302", "bedroom-01", "Bedroom with three beds beside a large window"),
    photo("lowell-302", "bedroom-02", "Bedroom with a large bed, wood headboard, and two sofas"),
    photo("lowell-302", "bathroom-01", "Bathroom with a vanity, toilet, and tiled walk-in shower"),
    photo("lowell-302", "bathroom-02", "Bathroom with a soaking tub and glass-enclosed shower"),
    photo("lowell-302", "bathroom-03", "Double vanity with a dark marble counter"),
    photo("lowell-302", "gym-01", "Fitness center with treadmills, an elliptical, and dumbbells"),
    photo("lowell-302", "pool-01", "Outdoor pool at night beside the stone resort building"),
    photo("lowell-302", "exterior-01", "The Lowell, a multi-story stone and wood building"),
  ],
  "powder-room": [
    photo("powder-room", "bedroom-01", "Bedroom with a wood bed, white linens, and a sofa by the window"),
    photo("powder-room", "bathroom-01", "Bathroom with a tub-shower, toilet, and dark vanity"),
    photo("powder-room", "bathroom-02", "Kitchenette sink and coffee maker beside a window with a mountain view"),
    photo("powder-room", "bathroom-03", "Bathroom vanity with a dark marble counter, mirror, and towel warmer"),
    photo("powder-room", "pool-01", "Outdoor pool deck with lounge chairs and a view toward the hills"),
    photo("powder-room", "pool-02", "Outdoor pool at night beside the stone resort building"),
    photo("powder-room", "gym-01", "Fitness center with cardio machines, weights, and mirrored walls"),
    photo("powder-room", "exterior-02", "Aerial view of snowy resort buildings and ski runs"),
  ],
};

const mainSizes = "(min-width: 1280px) 1180px, (min-width: 768px) calc(100vw - 48px), calc(100vw - 32px)";
const thumbSizes = "(min-width: 768px) 126px, 88px";

export function PropertyGallery({ slug, fallback = [] }: { slug: string; fallback?: Photo[] }) {
  const photos = galleries[slug] ?? fallback;
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const activeRef = useRef(0);
  const touchStart = useRef<number | null>(null);

  if (!photos.length) return null;

  const select = (index: number) => {
    activeRef.current = index;
    setActive(index);
  };
  const previous = () => select((active - 1 + photos.length) % photos.length);
  const next = () => select((active + 1) % photos.length);
  const frames = shown === active ? [shown] : [shown, active];
  const quality = propertyImageQuality(slug, 100);

  return (
    <section aria-label="Property photo gallery" className="bg-[#FFFCFB] px-4 pb-3 pt-3 md:px-6 md:pb-14 md:pt-4">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-heading text-[30px] font-medium leading-tight tracking-[-1.2px] text-[#1F3125] md:text-[42px] md:tracking-[-1.7px]">Explore the space<span className="text-[#4A6E57]">.</span></h2>
          <span className="font-body text-[13px] tabular-nums text-[#6D6057]">{active + 1} / {photos.length}</span>
        </div>
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Property photos. Use left and right arrow keys to browse."
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
            if (event.key === "ArrowRight") { event.preventDefault(); next(); }
          }}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] relative aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-[#F4EFEC] md:aspect-[16/9] md:rounded-[24px]"
          onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const distance = event.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(distance) > 45) (distance < 0 ? next : previous)();
            touchStart.current = null;
          }}
        >
          {frames.map((index) => {
            const item = photos[index];
            const visible = index === shown;
            return (
              <Image
                key={item.src}
                src={item.src}
                alt={visible ? item.alt : ""}
                aria-hidden={visible ? undefined : true}
                fill
                sizes={mainSizes}
                quality={quality}
                className={`object-cover ${visible ? "opacity-100" : "opacity-0"}`}
                onLoad={() => {
                  if (activeRef.current === index) setShown(index);
                }}
              />
            );
          })}
          {photos.length > 1 && (
            <>
              <button type="button" onClick={previous} aria-label="Previous photo" className="group absolute left-1 top-1/2 z-10 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center md:left-3">
                <span aria-hidden="true" className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white/30 bg-[#1F3125]/55 text-[18px] leading-none text-white backdrop-blur-[4px] transition-colors group-hover:bg-[#1F3125]/75 md:h-[34px] md:w-[34px]">‹</span>
              </button>
              <button type="button" onClick={next} aria-label="Next photo" className="group absolute right-1 top-1/2 z-10 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center md:right-3">
                <span aria-hidden="true" className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white/30 bg-[#1F3125]/55 text-[18px] leading-none text-white backdrop-blur-[4px] transition-colors group-hover:bg-[#1F3125]/75 md:h-[34px] md:w-[34px]">›</span>
              </button>
            </>
          )}
        </div>
        <div className="mt-2.5 flex snap-x gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] md:gap-3">
          {photos.map((item, index) => (
            <button key={item.src} type="button" onClick={() => select(index)} aria-label={`View photo ${index + 1}: ${item.alt}`} aria-current={index === active ? "true" : undefined} className={`relative h-[64px] w-[88px] shrink-0 snap-start overflow-hidden rounded-[9px] border-2 transition-opacity md:h-[84px] md:w-[126px] ${index === active ? "border-[#4A6E57] opacity-100" : "border-transparent opacity-70 hover:opacity-100"}`}>
              <Image src={item.src} alt={item.alt} fill sizes={thumbSizes} quality={quality} className="object-cover" />
            </button>
          ))}
        </div>
      </div>

    </section>
  );
}
