import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CommunityCTA } from "@/components/sections/CommunityCTA";
import { PropertyGallery } from "@/components/sections/PropertyGallery";
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
    primary: ["Sleeps 4", "Studio", "1 Bath", "At the resort base"],
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
    <div className="border-t border-[#D8CCC4] pt-3">
      <h3
        className="font-heading text-[26px] font-medium leading-[32px] tracking-[-1.04px] text-[#1F3125]"
        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
      >
        {heading}
      </h3>

      <ul className="mt-2.5 grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="border-b border-[#E7DFDB] py-2 font-body text-[15px] font-normal leading-[22px] tracking-[-0.3px] text-[#4E433C]"
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
  const heroImageClass =
    slug === "hygge-house"
      ? "object-cover scale-[1.18] object-[center_24%] md:scale-100 md:object-center"
      : "object-cover object-center";

  return (
    <>
      <section className="relative flex min-h-[500px] w-full items-end overflow-hidden md:min-h-[680px] md:items-center">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          quality={100}
          sizes="100vw"
          className={heroImageClass}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/34 via-black/8 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/22 via-transparent to-transparent" />

        <div className="relative z-10 w-full px-4 pb-5 pt-8 md:px-10 md:py-12 lg:px-12">
          <div className="max-w-[940px] rounded-[18px] border border-white/20 bg-[linear-gradient(180deg,rgba(18,35,26,0.91)_0%,rgba(21,37,28,0.83)_46%,rgba(21,37,28,0.73)_100%)] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.24)] backdrop-blur-[14px] md:max-w-[790px] md:rounded-[22px] md:px-10 md:py-9 lg:max-w-[820px]">
            <p className="font-body text-[13px] font-semibold leading-5 tracking-[-0.24px] text-[#E6F0E5] drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] md:text-[17px] md:leading-6 md:tracking-[-0.28px]">
              {hero.locationLabel}
            </p>

            <h1
              className="mt-1 font-heading text-[42px] font-medium leading-[42px] tracking-[-1.68px] text-white md:mt-1 md:text-[62px] md:leading-[64px] md:tracking-[-2.8px]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              {hero.title}
            </h1>

            <p className="mt-2 max-w-[700px] font-body text-[15.5px] font-medium leading-[22px] tracking-[-0.28px] text-[#FFFCFB] drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)] md:mt-4 md:max-w-[660px] md:text-[18px] md:leading-[27px] md:tracking-[-0.3px]">
              {hero.subtitle}
            </p>

            {highlights.primary.length > 0 ? (
              <div className="mt-2.5 border-y border-white/24 py-1.5 md:mt-5 md:py-0">
                <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-white/20">
                  {highlights.primary.map((item, index) => (
                    <div
                      key={item}
                      className={`flex min-h-[46px] items-center px-3 py-1.5 font-body text-[13.5px] font-medium leading-[18px] tracking-[-0.24px] text-[#FFFCFB] md:min-h-[66px] md:justify-start md:px-4 md:py-3 md:text-[14px] md:leading-[21px] md:tracking-[-0.2px] ${index % 2 === 1 ? "border-l border-white/18 md:border-l-0" : ""} ${index > 1 ? "border-t border-white/12 md:border-t-0" : ""}`}
                    >
                      <span className="block w-full text-left md:text-left">{item}</span>
                    </div>
                  ))}
                </div>

                {highlights.secondary.length > 0 ? (
                  <p className="mt-1.5 border-t border-white/12 pt-2 font-body text-[13.5px] font-medium leading-[20px] tracking-[-0.24px] text-[#FFFCFB] md:mt-0 md:border-t md:border-white/20 md:px-3 md:py-3 md:text-left md:text-[13.5px] md:leading-6 md:tracking-[-0.26px]">
                    {highlights.secondary.join("  ·  ")}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="mt-3 flex justify-center md:mt-5">
              <a
                href={bookingHref}
                {...(isSenator ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex min-h-10 items-center justify-center rounded-[10px] border border-white/55 bg-[#FFFCFB] px-6 py-2 font-body text-[14px] font-medium leading-5 tracking-[-0.24px] text-[#291D16] shadow-[0_8px_22px_rgba(0,0,0,0.16)] transition-all hover:-translate-y-px hover:bg-white md:min-h-11 md:px-7 md:py-2.5 md:text-[15px] md:leading-6 md:tracking-[-0.28px]"
              >
                Check dates
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FFFCFB] px-4 pb-5 pt-6 md:px-6 md:py-12">
        <p className="mx-auto max-w-[1180px] font-body text-[16px] font-normal leading-6 tracking-[-0.32px] text-[#6D6057] md:text-[22px] md:leading-9 md:tracking-[-0.4px]">
          {property.intro}
        </p>
      </section>

      <PropertyGallery slug={slug} fallback={stories.map((story) => ({ src: story.image.src, alt: story.image.alt }))} />

      {listingId ? (
        <section id="availability" className="scroll-mt-16 bg-[#F4EFEC] px-4 py-8 md:px-6 md:py-16">
          <div className="mx-auto max-w-[860px]">
            <div className="mb-4 md:mb-6">
              <p className="font-body text-[13px] font-medium uppercase leading-[18px] tracking-[0.08em] text-[#8F7E73]">
                Book direct
              </p>
              <h2
                className="mt-1.5 font-heading text-[32px] font-medium leading-[36px] tracking-[-1.28px] md:mt-2 text-[#1F3125] md:text-[46px] md:leading-[50px] md:tracking-[-1.84px]"
                style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
              >
                Find your dates
              </h2>
            </div>

            <div className="rounded-[12px] border border-[#E1D7D1] bg-[#FFFCFB] px-2 py-5 shadow-[0_8px_24px_rgba(41,29,22,0.04)] sm:px-5 md:px-7 md:py-7">
              <HostawayBooking listingId={listingId} fallbackUrl={bookingUrl} />
            </div>
          </div>
        </section>
      ) : null}

      {stories.length > 0 ? (
        <section className="bg-[#FFFCFB] px-3 pb-3 pt-6 sm:px-4 md:px-6 md:pb-10 md:pt-14">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-5 max-w-[760px] md:mb-10">
              <h2
                className="font-heading text-[32px] font-medium leading-[36px] tracking-[-1.28px] text-[#1F3125] md:text-[46px] md:leading-[50px] md:tracking-[-1.84px]"
                style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
              >
                The stay
              </h2>
            </div>

            <div className="space-y-4 md:space-y-8">
              {stories.map((story, index) => (
                <article
                  key={story.image.src}
                  className="grid w-full overflow-hidden rounded-[18px] border border-[#E7DFDB] bg-[#FBF8F7] shadow-[0_14px_40px_rgba(41,29,22,0.045)] md:rounded-[24px] md:grid-cols-[0.92fr_1.08fr]"
                >
                  <div
                    className={`flex items-center px-4 py-4 sm:px-5 sm:py-5 md:p-8 lg:p-10 ${index % 2 === 1 ? "md:order-2" : ""}`}
                  >
                    <div className="w-full max-w-none md:max-w-[520px]">
                      <p className="font-body text-[12px] font-medium uppercase leading-5 tracking-[0.08em] text-[#8F7E73]">
                        {story.eyebrow}
                      </p>
                      <h3
                        className="mt-1.5 font-heading text-[27px] font-medium leading-[31px] tracking-[-1.2px] text-[#1F3125] md:text-[34px] md:leading-[38px] md:tracking-[-1.36px]"
                        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
                      >
                        {story.title}
                      </h3>
                      <div className="mt-3 font-body text-[15px] font-normal leading-6 tracking-[-0.34px] text-[#5F534B] md:text-[18px] md:leading-8">
                        {story.paragraphs.map((paragraph) => (
                          <p key={paragraph} className="mb-3 last:mb-0 md:mb-5">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`relative min-h-[260px] w-full md:min-h-[420px] ${index % 2 === 1 ? "md:order-1" : ""}`}
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

      <section className="bg-[#FFFCFB] px-4 py-8 md:px-6 md:py-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-3 md:mb-6">
            <p className="font-body text-[13px] font-medium uppercase leading-[18px] tracking-[0.08em] text-[#8F7E73]">
              Property details
            </p>
            <h2
              className="mt-1.5 font-heading text-[31px] font-medium leading-[35px] tracking-[-1.44px] text-[#1F3125] md:text-[44px] md:leading-[48px] md:tracking-[-1.76px]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              What to know before you stay
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:gap-y-6 lg:grid-cols-2">
            {details.map((list) => (
              <DetailList key={list.heading} heading={list.heading} items={list.items} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFFCFB] px-4 pb-6 pt-3 md:px-6 md:py-12">
        <div className="mx-auto grid max-w-[1180px] gap-4 md:gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="font-body text-[13px] font-medium uppercase leading-[18px] tracking-[0.08em] text-[#8F7E73]">
              Location
            </p>
            <div className="mt-2.5 space-y-2 font-body text-[16px] font-normal leading-[23px] tracking-[-0.36px] text-[#6D6057] md:mt-4 md:space-y-4 md:text-[18px] md:leading-7">
              {location.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <iframe
            title={`Map of ${location.mapQuery}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed`}
            className="h-[300px] w-full rounded-[18px] border-0 md:h-[420px] md:rounded-[20px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <CommunityCTA />

    </>
  );
}
