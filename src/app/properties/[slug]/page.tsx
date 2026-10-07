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

const propertyHighlights: Record<string, { primary: string[]; secondary: string[] }> = {
  "hygge-house": {
    primary: ["Sleeps 10", "4 Bedrooms", "3 Baths", "Private sauna"],
    secondary: ["Dedicated office", "Gym + gear garage", "Fenced yard + fire pit", "Pets allowed"],
  },
  granary: {
    primary: ["Sleeps 4", "1 Bedroom", "1 Bath", "Gas fireplace"],
    secondary: ["Mountain views", "Full kitchen", "In-unit laundry", "Walkable Midway location"],
  },
  daystar: {
    primary: ["Sleeps 12", "6 Bedrooms", "6 Baths", "Hot tub"],
    secondary: ["Indoor sauna", "Sport court", "Pool table", "Two living rooms"],
  },
  lowell: {
    primary: ["Sleeps 8", "2 Bedrooms", "2 Baths", "Steps from the snow"],
    secondary: ["Steam shower", "Pool + hot tub", "Ski storage", "Underground parking"],
  },
  "powder-room": {
    primary: ["Sleeps 4", "King bed", "Private bath", "At the resort base"],
    secondary: ["Pool + hot tub", "Fitness center", "Ski storage", "Kitchenette"],
  },
  senator: {
    primary: ["10 Rooms", "Historic 1902 home", "Cooked-to-order breakfast", "Heber City"],
    secondary: ["Three floors", "Shared gathering spaces", "Garden + porch", "3 blocks from Main Street"],
  },
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

  const { hero, stories, details, location, bookingUrl } = property;
  const listingId = hostawayListingIds[slug];
  const highlights = propertyHighlights[slug] ?? { primary: [], secondary: [] };
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/34 via-black/8 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/22 via-transparent to-transparent" />

        <div className="relative z-10 w-full px-6 pb-10 pt-24 md:px-10 md:pb-12 lg:px-12">
          <div className="max-w-[940px] rounded-[22px] bg-black/42 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-[5px] md:p-8">
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

            {highlights.primary.length > 0 ? (
              <div className="mt-6 border-y border-white/20 py-4">
                <div className="flex flex-wrap items-center gap-y-3">
                  {highlights.primary.map((item, index) => (
                    <div
                      key={item}
                      className={`pr-4 font-body text-[15px] font-medium leading-6 tracking-[-0.3px] text-white md:text-[16px] ${index > 0 ? "border-l border-white/20 pl-4" : ""}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {highlights.secondary.length > 0 ? (
                  <p className="mt-3 font-body text-[14px] font-normal leading-6 tracking-[-0.28px] text-white/72 md:text-[15px]">
                    {highlights.secondary.join("  ·  ")}
                  </p>
                ) : null}
              </div>
            ) : null}

            <a
              href={bookingHref}
              {...(isSenator ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2 bg-white px-5 py-2.5 font-body text-[15px] font-medium leading-6 tracking-[-0.3px] text-[#291D16] shadow-sm transition-all hover:-translate-y-px hover:bg-[#F4EFEC]"
            >
              See available dates
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#FFFCFB] px-6 py-14 md:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <p className="font-body text-[20px] font-normal leading-8 tracking-[-0.4px] text-[#6D6057] md:text-[22px] md:leading-9">
            {property.intro}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {highlights.primary.map((item) => (
              <div
                key={item}
                className="rounded-3 border border-[#E1D7D1] bg-[#FBF8F7] px-4 py-4"
              >
                <p className="font-body text-[15px] font-medium leading-6 tracking-[-0.3px] text-[#291D16] md:text-[16px]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {listingId ? (
        <section id="availability" className="scroll-mt-16 bg-[#F4EFEC] px-6 py-14 md:py-16">
          <div className="mx-auto max-w-[980px]">
            <div className="mb-6">
              <p className="font-body text-[13px] font-medium uppercase leading-[18px] tracking-[0.08em] text-[#8F7E73]">
                Book direct
              </p>
              <h2
                className="mt-2 font-heading text-[38px] font-medium leading-[42px] tracking-[-1.52px] text-[#1F3125] md:text-[46px] md:leading-[50px] md:tracking-[-1.84px]"
                style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
              >
                Find your dates
              </h2>
            </div>

            <div className="rounded-[20px] border border-[#E1D7D1] bg-[#FFFCFB] p-4 md:p-6">
              <HostawayBooking listingId={listingId} />
            </div>
          </div>
        </section>
      ) : null}

      {stories.length > 0 ? (
        <section className="bg-[#FFFCFB] px-6 py-14 md:py-20">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-8 max-w-[760px] md:mb-10">
              <p className="font-body text-[13px] font-medium uppercase leading-[18px] tracking-[0.08em] text-[#8F7E73]">
                The stay
              </p>
              <h2
                className="mt-2 font-heading text-[38px] font-medium leading-[42px] tracking-[-1.52px] text-[#1F3125] md:text-[46px] md:leading-[50px] md:tracking-[-1.84px]"
                style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
              >
                Settle into the rhythm of the place
              </h2>
            </div>

            <div className="space-y-6 md:space-y-8">
              {stories.map((story, index) => (
                <article
                  key={story.image.src}
                  className="grid overflow-hidden rounded-[24px] border border-[#E7DFDB] bg-[#FBF8F7] shadow-[0_14px_40px_rgba(41,29,22,0.045)] md:grid-cols-[0.92fr_1.08fr]"
                >
                  <div
                    className={`flex items-center p-6 md:p-8 lg:p-10 ${index % 2 === 1 ? "md:order-2" : ""}`}
                  >
                    <div className="max-w-[520px]">
                      <p className="mb-4 font-body text-[12px] font-medium uppercase leading-5 tracking-[0.08em] text-[#8F7E73]">
                        {index === 0 ? "Mornings" : index === 1 ? "After the day" : "Evenings"}
                      </p>
                      <div className="font-body text-[17px] font-normal leading-7 tracking-[-0.34px] text-[#5F534B] md:text-[18px] md:leading-8">
                        {story.paragraphs.map((paragraph) => (
                          <p key={paragraph} className="mb-5 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`relative min-h-[320px] md:min-h-[420px] ${index % 2 === 1 ? "md:order-1" : ""}`}
                  >
                    <Image
                      src={story.image.src}
                      alt={story.image.alt}
                      fill
                      quality={95}
                      sizes="(min-width: 768px) 55vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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

      <section className="bg-[#FFFCFB] px-6 py-14 md:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="font-body text-[13px] font-medium uppercase leading-[18px] tracking-[0.08em] text-[#8F7E73]">
              Location
            </p>
            <div className="mt-4 space-y-6 font-body text-[18px] font-normal leading-8 tracking-[-0.36px] text-[#6D6057]">
              {location.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <iframe
            title={`Map of ${location.mapQuery}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed`}
            className="h-[420px] w-full rounded-[20px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <CommunityCTA />

      {!isSenator ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E1D7D1] bg-[#FFFCFB]/95 p-3 backdrop-blur-md md:hidden">
          <a
            href="#availability"
            className="flex min-h-11 items-center justify-center rounded-2 bg-[#4A6E57] px-5 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#FFFCFB]"
          >
            See available dates
          </a>
        </div>
      ) : null}
    </>
  );
}
