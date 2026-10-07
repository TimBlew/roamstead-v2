import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CommunityCTA } from "@/components/sections/CommunityCTA";
import { HostawayBooking } from "@/components/booking/HostawayBooking";
import { getProperty, properties } from "@/data/properties";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const hostawayListingIds: Record<string, number> = {
  "hygge-house": 455635,
  granary: 455631,
  daystar: 455634,
  lowell: 455632,
  "powder-room": 455633,
};

const propertyHighlights: Record<string, string[]> = {
  "hygge-house": [
    "Sleeps 10",
    "4 Bedrooms",
    "3 Baths",
    "Private sauna",
    "Dedicated office",
    "Gym + gear garage",
    "Fenced yard + fire pit",
    "Pets allowed",
  ],
  granary: [
    "Sleeps 4",
    "1 Bedroom",
    "1 Bath",
    "Gas fireplace",
    "Mountain views",
    "Walkable Midway location",
  ],
  daystar: [
    "Sleeps 12",
    "6 Bedrooms",
    "6 Baths",
    "Hot tub",
    "Indoor sauna",
    "Sport court",
    "Pool table",
  ],
  lowell: [
    "Sleeps 8",
    "2 Bedrooms",
    "2 Baths",
    "Steps from the snow",
    "Steam shower",
    "Pool + hot tub",
    "Ski storage",
  ],
  "powder-room": [
    "Sleeps 4",
    "King bed",
    "Private bath",
    "Pool + hot tub",
    "Fitness center",
    "Ski storage",
  ],
  senator: [
    "10 Rooms",
    "Historic 1902 home",
    "Cooked-to-order breakfast",
    "3 blocks from Main Street",
  ],
};

export const dynamicParams = false;

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return {};

  return {
    title: property.seo.title,
    description: property.seo.description,
    openGraph: {
      title: property.seo.title,
      description: property.seo.description,
    },
  };
}

function DetailList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="border-t border-[#D8CCC4] pt-4">
      <h3
        className="font-heading text-[26px] font-medium leading-[32px] tracking-[-1.04px] text-[#1F3125]"
        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
      >
        {heading}
      </h3>

      <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="border-b border-[#E7DFDB] py-2.5 font-body text-[15px] font-normal leading-6 tracking-[-0.3px] text-[#4E433C]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const { hero, stats, stories, details, location, bookingUrl } = property;
  const listingId = hostawayListingIds[slug];
  const highlights = propertyHighlights[slug] ?? [];
  const isSenator = slug === "senator";
  const bookingHref = isSenator ? bookingUrl : "#availability";

  return (
    <>
      <section className="relative flex min-h-[620px] w-full items-end overflow-hidden md:min-h-[720px]">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        <div className="relative z-10 w-full px-6 pb-10 pt-24 md:px-10 md:pb-12 lg:px-12">
          <div className="max-w-[900px] rounded-[20px] border border-white/20 bg-black/18 p-5 backdrop-blur-[2px] md:p-7">
            <p className="font-body text-[15px] font-medium leading-6 tracking-[-0.3px] text-white/85 md:text-[17px]">
              {hero.locationLabel}
            </p>

            <h1
              className="mt-2 font-heading text-[50px] font-medium leading-[52px] tracking-[-2px] text-white md:text-[70px] md:leading-[70px] md:tracking-[-2.8px]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              {hero.title}
            </h1>

            <p className="mt-4 max-w-[720px] font-body text-[17px] font-normal leading-7 tracking-[-0.34px] text-white/90 md:text-[19px]">
              {hero.subtitle}
            </p>

            {highlights.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {highlights.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 font-body text-[14px] font-medium leading-5 tracking-[-0.28px] text-white backdrop-blur-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}

            <a
              href={bookingHref}
              {...(isSenator ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2 bg-white px-5 py-2.5 font-body text-[15px] font-medium leading-6 tracking-[-0.3px] text-[#291D16] transition-colors hover:bg-[#F4EFEC]"
            >
              Check availability
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#FFFCFB] px-6 py-14 md:py-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8">
            <p className="font-body text-[13px] font-medium uppercase leading-[18px] tracking-[0.08em] text-[#8F7E73]">
              Property details
            </p>
            <h2
              className="mt-2 font-heading text-[36px] font-medium leading-[40px] tracking-[-1.44px] text-[#1F3125] md:text-[44px] md:leading-[48px] md:tracking-[-1.76px]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              What to know before you stay
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-2">
            {details.map((list) => (
              <DetailList key={list.heading} heading={list.heading} items={list.items} />
            ))}
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col items-center gap-6 bg-[#FFFCFB] px-6 py-16">
        <div className="w-full max-w-[816px] space-y-8 font-body text-[20px] font-normal leading-8 tracking-[-0.4px] text-[#6D6057]">
          {location.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <iframe
          title={`Map of ${location.mapQuery}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed`}
          className="h-[400px] w-full max-w-[816px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <CommunityCTA />

      {!isSenator ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E1D7D1] bg-[#FFFCFB]/95 p-3 backdrop-blur-md md:hidden">
          <a
            href="#availability"
            className="flex min-h-11 items-center justify-center bg-[#4A6E57] px-5 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#FFFCFB]"
          >
            Check availability
          </a>
        </div>
      ) : null}
    </>
  );
}
