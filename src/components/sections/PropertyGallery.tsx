"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { propertyImageQuality } from "@/lib/property-image-quality";

import { galleries, type Photo } from "@/data/property-galleries";

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
