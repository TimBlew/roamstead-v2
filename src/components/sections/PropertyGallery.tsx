"use client";

import { useRef, useState } from "react";

type Photo = { src: string; alt: string };
const photo = (folder: string, file: string, alt: string): Photo => ({
  src: `/listings/${folder}/${file}.jpg`,
  alt,
});

const galleries: Record<string, Photo[]> = {
  "hygge-house": [
    photo("house-midway", "exterior-02", "Hygge House front exterior"),
    photo("house-midway", "exterior-04", "Backyard patio and outdoor dining"),
    photo("house-midway", "living-03", "Main living room and fireplace"),
    photo("house-midway", "living-05", "Second living room and game table"),
    photo("house-midway", "living-02", "Dedicated home office and seating"),
    photo("house-midway", "kitchen-01", "Kitchen and island"),
    photo("house-midway", "bedroom-01", "Bedroom with workspace"),
    photo("house-midway", "bedroom-03", "Guest bedroom"),
    photo("house-midway", "sauna-01", "Private sauna heater"),
    photo("house-midway", "sauna-02", "View from inside the private sauna"),
    photo("house-midway", "garage-01", "Garage gym and gear storage"),
    photo("house-midway", "garage-03", "Garage weight training equipment"),
    { src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JhtTKjJmo2R3mPhsBJElt2FRYV/e4251f0c-76c0-4125-9077-c6d5063ae636.png", alt: "Aerial view of Hygge House and surrounding trees" },
  ],
  granary: [
    photo("granary", "living-01", "Living room and fireplace"),
    photo("granary", "living-02", "Open-plan living and dining"),
    photo("granary", "living-03", "Fireplace seating"),
    photo("granary", "living-04", "Living room detail"),
    photo("granary", "kitchen-01", "Kitchen and island"),
    photo("granary", "dining-01", "Dining area"),
    photo("granary", "bedroom-01", "King bedroom"),
    photo("granary", "bath-01", "Bathroom"),
  ],
  daystar: [
    photo("daystar", "living-01", "Living room"),
    photo("daystar", "kitchen-01", "Kitchen"),
    photo("daystar", "bedroom-01", "Bedroom"),
    photo("daystar", "patio-02", "Outdoor dining terrace"),
    photo("daystar", "sauna-01", "Indoor sauna"),
    photo("daystar", "recreation-01", "Indoor sport court"),
  ],
  lowell: [
    photo("lowell-302", "living-01", "Living room"),
    photo("lowell-302", "living-02", "Living space"),
    photo("lowell-302", "kitchen-01", "Kitchen"),
    photo("lowell-302", "dining-01", "Dining area"),
    photo("lowell-302", "bedroom-01", "Primary bedroom"),
    photo("lowell-302", "bedroom-02", "Second bedroom"),
    photo("lowell-302", "bathroom-01", "Bathroom"),
    photo("lowell-302", "bathroom-02", "Bathroom with steam shower"),
    photo("lowell-302", "bathroom-03", "Bathroom details"),
    photo("lowell-302", "gym-01", "Fitness center"),
    photo("lowell-302", "pool-01", "Heated pool and hot tub"),
    photo("lowell-302", "exterior-01", "Lowell building exterior"),
  ],
  "powder-room": [
    photo("powder-room", "bedroom-01", "King bed and seating"),
    photo("powder-room", "bathroom-01", "Bathroom"),
    photo("powder-room", "bathroom-02", "Bathroom kitchenette and mountain view"),
    photo("powder-room", "bathroom-03", "Bathroom vanity and details"),
    photo("powder-room", "pool-01", "Outdoor pool"),
    photo("powder-room", "pool-02", "Outdoor hot tub and pool at night"),
    photo("powder-room", "gym-01", "Fitness center"),
    photo("powder-room", "exterior-02", "Park City ski resort and building exterior"),
  ],
};

export function PropertyGallery({ slug, fallback = [] }: { slug: string; fallback?: Photo[] }) {
  const photos = galleries[slug] ?? fallback;
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);

  if (!photos.length) return null;
  const previous = () => setActive((n) => (n - 1 + photos.length) % photos.length);
  const next = () => setActive((n) => (n + 1) % photos.length);

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[active].src} alt={photos[active].alt} className="h-full w-full object-cover" loading="lazy" />
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
            <button key={item.src} type="button" onClick={() => setActive(index)} aria-label={`View photo ${index + 1}: ${item.alt}`} aria-current={index === active ? "true" : undefined} className={`relative h-[64px] w-[88px] shrink-0 snap-start overflow-hidden rounded-[9px] border-2 transition-opacity md:h-[84px] md:w-[126px] ${index === active ? "border-[#4A6E57] opacity-100" : "border-transparent opacity-70 hover:opacity-100"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

    </section>
  );
}
