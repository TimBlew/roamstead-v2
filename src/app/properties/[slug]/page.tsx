import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CommunityCTA } from "@/components/sections/CommunityCTA";
import { PropertyGallery } from "@/components/sections/PropertyGallery";
import { RoamsteadBooking } from "@/components/booking/RoamsteadBooking";
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
  const shortHeroSummaries: Record<string, string> = {
    "hygge-house": "A spacious Midway mountain home with a private sauna, office, and room to gather.",
    granary: "A cozy Midway condo with mountain views, a full kitchen, and an easy walk into town.",
    daystar: "A generous Deer Valley retreat with a hot tub, sauna, and room for everyone.",
    lowell: "A welcoming Park City condo just steps from the mountain, with resort amenities.",
    "powder-room": "A comfortable studio at the base of Park City Mountain Resort.",
    senator: "A historic Heber City home with individually appointed rooms and breakfast included.",
  };
  const heroImageClass =
    slug === "hygge-house"
      ? "object-cover scale-[1.18] object-[center_24%] md:scale-100 md:object-center"
      : "object-cover object-center";

  return (
    <>
      <section className="relative flex min-h-[500px] w-full items-end overflow-hidden md:min-h-[630px] md:items-center">
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

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-5 pt-8 md:flex md:justify-center md:px-10 md:py-12 lg:px-12">
          <div className="w-full max-w-[620px] rounded-[18px] border border-white/20 bg-[linear-gradient(180deg,rgba(18,35,26,0.91)_0%,rgba(21,37,28,0.83)_46%,rgba(21,37,28,0.73)_100%)] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.24)] backdrop-blur-[14px] md:max-w-[580px] md:rounded-[18px] md:px-8 md:py-7 lg:max-w-[600px]">
            <p className="font-body text-[13px] font-semibold leading-5 tracking-[-0.24px] text-[#E6F0E5] drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] md:text-[17px] md:leading-6 md:tracking-[-0.28px]">
              {hero.locationLabel}
            </p>

            <h1
              className="mt-1 font-heading text-[42px] font-medium leading-[42px] tracking-[-1.68px] text-white md:mt-1 md:text-[56px] md:leading-[1.08] md:tracking-[-2.2px]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              {hero.title}
            </h1>

            <p className="mt-2 max-w-[700px] font-body text-[15.5px] font-medium leading-[22px] tracking-[-0.28px] text-[#FFFCFB] drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)] md:mt-3 md:max-w-[520px] md:text-[17px] md:leading-[1.5] md:tracking-[-0.3px]">
              {shortHeroSummaries[slug] ?? hero.subtitle}
            </p>

            {highlights.primary.length > 0 ? (
              <div className="mt-4 border-t border-white/20 pt-3 md:mt-4 md:pt-3">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 md:gap-x-8 md:gap-y-2">
                  {highlights.primary.map((item) => (
                    <div
                      key={item}
                      className="flex items-center py-0.5 font-body text-[13px] font-medium leading-5 tracking-[-0.1px] text-[#FFFCFB]"
                    >
                      <span className="block w-full text-left md:text-left">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex justify-start md:mt-5">
              <a
                href={bookingHref}
                {...(isSenator ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex h-11 min-w-[148px] items-center justify-center whitespace-nowrap rounded-[7px] border border-white/50 bg-[#FFFCFB] px-6 font-body text-[14px] font-semibold leading-5 text-[#1F3125] shadow-[0_5px_16px_rgba(0,0,0,0.12)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-12 md:min-w-[160px] md:text-[15px]"
              >
                Check dates
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FFFCFB] px-4 pb-2 pt-6 md:px-6 md:pb-1 md:pt-9">
        <p className="mx-auto max-w-[1060px] font-body text-[16px] font-normal leading-6 tracking-[-0.32px] text-[#6D6057] md:text-[19px] md:leading-[1.65] md:tracking-[-0.4px]">
          {property.intro}
        </p>
      </section>

      <PropertyGallery slug={slug} fallback={stories.map((story) => ({ src: story.image.src, alt: story.image.alt }))} />

      {listingId ? (
        <section id="availability" className="scroll-mt-16 bg-[#F4EFEC] px-4 py-8 md:px-6 md:py-16">
          <div className="mx-auto max-w-[620px]">
            <div className="mb-4 md:mb-5">
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

            <div className="rounded-[14px] border border-[#E1D7D1] bg-[#FFFCFB] px-3 py-5 shadow-[0_8px_24px_rgba(41,29,22,0.04)] sm:px-6 md:px-7 md:py-7">
              <RoamsteadBooking listingId={listingId} fallbackUrl={bookingUrl} />
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
