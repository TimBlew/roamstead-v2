"use client";

import { useRef, useState } from "react";

type Photo = { src: string; alt: string };
const base = "https://www.roamstead-co.com";
const photo = (folder: string, file: string, alt: string): Photo => ({
  src: `${base}/listings/${folder}/${file}.jpg`,
  alt,
});

const galleries: Record<string, Photo[]> = {
  "hygge-house": [
    photo("house-midway", "exterior-02", "Hygge House exterior"),
    photo("house-midway", "exterior-04", "Backyard and patio"),
    photo("house-midway", "living-03", "Living room and fireplace"),
    photo("house-midway", "kitchen-01", "Kitchen and island"),
    photo("house-midway", "bedroom-01", "Bedroom"),
    photo("house-midway", "sauna-01", "Private sauna"),
    photo("house-midway", "garage-01", "Gym and gear storage"),
    { src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3JhtTKjJmo2R3mPhsBJElt2FRYV/e4251f0c-76c0-4125-9077-c6d5063ae636.png", alt: "Golden-hour aerial view of Hygge House with the mountains beyond" },
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
    photo("lowell-302", "kitchen-01", "Kitchen"),
    photo("lowell-302", "bedroom-01", "Bedroom"),
    photo("lowell-302", "pool-01", "Heated pool"),
  ],
  "powder-room": [
    photo("powder-room", "bedroom-01", "King bed and seating"),
    photo("powder-room", "bathroom-01", "Bathroom"),
    photo("powder-room", "pool-01", "Outdoor pool"),
    photo("powder-room", "exterior-02", "Park City ski resort"),
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
    <section aria-label="Property photo gallery" className="bg-[#FFFCFB] px-4 pb-10 pt-5 md:px-6 md:pb-16 md:pt-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-heading text-[30px] font-medium leading-tight tracking-[-1.2px] text-[#1F3125] md:text-[42px] md:tracking-[-1.7px]">Explore the space<span className="text-[#4A6E57]">.</span></h2>
          <span className="font-body text-[13px] tabular-nums text-[#6D6057]">{active + 1} / {photos.length}</span>
        </div>
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-[#F4EFEC] md:aspect-[16/9] md:rounded-[24px]"
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
              <button type="button" onClick={previous} aria-label="Previous photo" className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-[#1F3125]/50 text-white backdrop-blur-[4px] transition-colors hover:bg-[#1F3125]/70 md:left-5 md:h-10 md:w-10">
                <span aria-hidden="true" className="text-[16px] leading-none">‹</span>
              </button>
              <button type="button" onClick={next} aria-label="Next photo" className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-[#1F3125]/50 text-white backdrop-blur-[4px] transition-colors hover:bg-[#1F3125]/70 md:right-5 md:h-10 md:w-10">
                <span aria-hidden="true" className="text-[16px] leading-none">›</span>
              </button>
            </>
          )}
        </div>
        <div className="mt-3 flex snap-x gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] md:gap-3">
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
