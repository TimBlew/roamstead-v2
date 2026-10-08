"use client";

import { useEffect, useState } from "react";

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
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
      if (event.key === "ArrowRight") setActive((n) => (n + 1) % photos.length);
      if (event.key === "ArrowLeft") setActive((n) => (n - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, photos.length]);

  if (!photos.length) return null;
  const previous = () => setActive((n) => (n - 1 + photos.length) % photos.length);
  const next = () => setActive((n) => (n + 1) % photos.length);

  return (
    <section aria-label="Property photo gallery" className="bg-[#FFFCFB] px-4 pb-10 pt-5 md:px-6 md:pb-16 md:pt-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="font-body text-[12px] font-medium uppercase tracking-[0.1em] text-[#8F7E73]">Explore the space</p>
            <h2 className="mt-1 font-heading text-[30px] font-medium tracking-[-1.2px] text-[#1F3125] md:text-[42px]">A closer look<span className="text-[#4A6E57]">.</span></h2>
          </div>
          <span className="font-body text-[13px] tabular-nums text-[#6D6057]">{active + 1} / {photos.length}</span>
        </div>
        <button type="button" onClick={() => setExpanded(true)} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-[#F4EFEC] text-left md:aspect-[16/9] md:rounded-[24px]" aria-label="Open full-screen photo gallery">
          {/* Remote photographs are served from the original Roamstead property site. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[active].src} alt={photos[active].alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]" loading="lazy" />
          <span className="absolute bottom-4 right-4 rounded-full border border-white/60 bg-[#FFFCFB]/95 px-4 py-2 font-body text-[13px] font-medium text-[#1F3125] shadow-sm">View photos ↗</span>
        </button>
        <div className="mt-3 flex items-center gap-3">
          <button type="button" onClick={previous} aria-label="Previous photo" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D8CCC4] text-[#1F3125]">←</button>
          <div className="flex min-w-0 flex-1 snap-x gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none]">
            {photos.map((item, index) => (
              <button key={item.src} type="button" onClick={() => setActive(index)} aria-label={`View photo ${index + 1}: ${item.alt}`} aria-current={index === active ? "true" : undefined} className={`relative h-[72px] w-[100px] shrink-0 snap-start overflow-hidden rounded-[10px] border-2 transition-opacity md:h-[92px] md:w-[138px] ${index === active ? "border-[#4A6E57] opacity-100" : "border-transparent opacity-70 hover:opacity-100"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <button type="button" onClick={next} aria-label="Next photo" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D8CCC4] text-[#1F3125]">→</button>
        </div>
      </div>
      {expanded && (
        <div role="dialog" aria-modal="true" aria-label="Full-screen property gallery" className="fixed inset-0 z-[100] flex flex-col bg-[#101B15]/98 p-4 text-white md:p-8">
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 pb-4">
            <span className="font-body text-[14px] tabular-nums">{active + 1} / {photos.length} · {photos[active].alt}</span>
            <button type="button" onClick={() => setExpanded(false)} className="rounded-full border border-white/40 px-4 py-2 font-body text-[14px]">Close ✕</button>
          </div>
          <div className="relative mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 items-center justify-center gap-2">
            <button type="button" onClick={previous} aria-label="Previous photo" className="shrink-0 rounded-full border border-white/30 px-3 py-2">←</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[active].src} alt={photos[active].alt} className="max-h-full min-w-0 max-w-full flex-1 object-contain" />
            <button type="button" onClick={next} aria-label="Next photo" className="shrink-0 rounded-full border border-white/30 px-3 py-2">→</button>
          </div>
        </div>
      )}
    </section>
  );
}
