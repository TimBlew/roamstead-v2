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
    <div className="flex w-full flex-col items-start">
      <div className="flex h-12 w-full items-center border-b border-[#E1D7D1] py-2">
        <h3 className="w-full font-body text-[20px] font-medium leading-8 tracking-[-0.4px] text-[#6D6057]">
          {heading}
        </h3>
      </div>

      {items.map((item) => (
        <div key={item} className="flex min-h-14 w-full items-center border-b border-[#E7DFDB] py-4">
          <p className="w-full font-body text-[16px] font-normal leading-6 tracking-[-0.32px] text-[#291D16]">
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const { hero, stats, stories, details, location, bookingUrl } = property;
  const listingId = hostawayListingIds[slug];
  const isSenator = slug === "senator";
  const bookingHref = isSenator ? bookingUrl : "#availability";

  return (
    <>
      <section className="relative flex h-[600px] w-full flex-col items-start justify-end gap-4 overflow-hidden px-6 py-16 md:h-[720px]">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-[#4A6E57]" />

        <p className="relative z-10 w-full max-w-[720px] font-body text-[18px] font-medium leading-7 tracking-[-0.36px] text-[#FBF8F7]">
          {hero.locationLabel}
        </p>

        <h1
          className="relative z-10 w-full max-w-[720px] font-heading text-[48px] font-medium leading-[54px] tracking-[-1.92px] text-[#FFFCFB] md:text-[72px] md:leading-[72px] md:tracking-[-2.88px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          {hero.title}
        </h1>

        <p className="relative z-10 w-full max-w-[720px] font-body text-[18px] font-normal leading-7 tracking-[-0.36px] text-[#FBF8F7]">
          {hero.subtitle}
        </p>

        <a
          href={bookingHref}
          {...(isSenator ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="relative z-10 inline-flex h-10 items-center justify-center border border-[#D8CCC4] bg-[#FEFDFC] px-4 py-2 font-body text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#291D16] transition-colors hover:bg-[#F4EFEC]"
        >
          Check availability
        </a>
      </section>

      <section className="flex w-full flex-col items-center gap-6 bg-[#FFFCFB] px-6 py-16">
        <p className="w-full max-w-[816px] font-body text-[20px] font-normal leading-8 tracking-[-0.4px] text-[#6D6057]">
          {property.intro}
        </p>

        <dl className="grid w-full max-w-[816px] grid-cols-2 gap-x-2 gap-y-2 border-t border-[#E7DFDB] py-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex min-w-0 flex-col items-start">
              <dd
                className="w-full font-heading text-[36px] font-medium leading-[48px] tracking-[-0.72px] text-[#291D16]"
                style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
              >
                {stat.value}
              </dd>
              <dt className="w-full font-body text-[16px] font-normal leading-6 tracking-[-0.32px] text-[#6D6057]">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {listingId ? (
        <section id="availability" className="scroll-mt-16 bg-[#F4EFEC] px-6 py-16">
          <div className="mx-auto w-full max-w-[816px]">
            <div className="mb-6">
              <h2
                className="font-heading text-[40px] font-medium leading-[44px] tracking-[-1.6px] text-[#291D16] md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
                style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
              >
                Check availability
              </h2>
              <p className="mt-4 font-body text-[16px] font-normal leading-6 tracking-[-0.32px] text-[#6D6057]">
                Choose your dates to continue into Roamstead’s direct booking flow.
              </p>
            </div>

            <div className="border border-[#E1D7D1] bg-[#FFFCFB] p-4 md:p-6">
              <HostawayBooking listingId={listingId} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="w-full bg-[#FFFCFB]">
        {stories.map((story, index) => (
          <div
            key={story.image.src}
            className="flex w-full flex-col gap-4 px-6 py-8 md:grid md:min-h-[507px] md:grid-cols-2 md:gap-0 md:px-0 md:py-0"
          >
            <div
              className={`flex items-center md:h-full md:px-6 md:py-16 ${index % 2 === 1 ? "md:order-2" : ""}`}
            >
              <div className="w-full font-body text-[18px] font-normal leading-7 tracking-[-0.36px] text-[#6D6057]">
                {story.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mb-7 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div
              className={`flex items-center md:h-full md:px-6 md:py-16 ${index % 2 === 1 ? "md:order-1" : ""}`}
            >
              <div className="relative h-[379px] w-full overflow-hidden">
                <Image
                  src={story.image.src}
                  alt={story.image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-[#FFFCFB] px-6 py-16">
        <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2">
          {details.map((list) => (
            <DetailList key={list.heading} heading={list.heading} items={list.items} />
          ))}
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
