import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/Button";
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
    <div className="rounded-3 border border-border-subtle bg-bg-canvas p-6 md:p-7">
      <h3 className="font-heading text-[27px] font-medium leading-[1.1] tracking-display text-text-primary">{heading}</h3>
      <ul className="mt-5 divide-y divide-border-subtle">
        {items.map((item) => (
          <li key={item} className="py-3 text-sm leading-6 tracking-body text-text-secondary">
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
  const isSenator = slug === "senator";
  const bookingHref = isSenator ? bookingUrl : "#availability";

  return (
    <>
      <section className="relative flex min-h-[640px] flex-col justify-end overflow-hidden md:min-h-[720px]">
        <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/60" />
        <div className="container-figma relative w-full pb-12 pt-24 md:pb-16">
          <div className="max-w-[780px]">
            <p className="text-sm font-medium tracking-body text-white/85">{hero.locationLabel}</p>
            <h1 className="mt-3 font-heading text-[52px] font-medium leading-[0.98] tracking-display text-white sm:text-[60px] md:text-[72px]">
              {hero.title}
            </h1>
            <p className="mt-4 max-w-[680px] text-base leading-7 tracking-body text-white/90 md:text-lg md:leading-8">{hero.subtitle}</p>
            <div className="mt-7">
              <Button href={bookingHref} external={isSenator} variant="secondary" className="border-white/70 bg-white text-text-primary hover:bg-bg-subtle">
                Check availability
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle bg-bg-canvas py-14 md:py-20">
        <div className="container-figma">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
            <p className="max-w-[760px] text-xl leading-8 tracking-body text-text-secondary md:text-[22px] md:leading-9">{property.intro}</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7 border-t border-border-subtle pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-heading text-[30px] font-medium leading-none tracking-display text-text-primary">{stat.value}</dd>
                  <dt className="mt-2 text-xs uppercase tracking-[0.1em] text-text-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-bg-canvas py-10 md:py-14">
        <div className="container-figma">
          <div className="grid gap-3 md:grid-cols-3">
            {stories.map((story) => (
              <div key={story.image.src} className="relative aspect-[4/3] overflow-hidden rounded-3 bg-bg-surface">
                <Image src={story.image.src} alt={story.image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {listingId && (
        <section id="availability" className="scroll-mt-20 bg-bg-subtle py-16 md:py-24">
          <div className="container-figma">
            <div className="mx-auto max-w-[980px]">
              <div className="mb-8 md:flex md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-brand-default">Book direct</p>
                  <h2 className="mt-3 font-heading text-h2 font-medium tracking-display text-text-primary">Choose your dates</h2>
                </div>
                <p className="mt-4 max-w-[400px] text-sm leading-6 tracking-body text-text-secondary md:mt-0 md:text-right">
                  Select available dates below to continue into Roamstead’s secure booking flow.
                </p>
              </div>
              <div className="rounded-4 border border-border-subtle bg-bg-canvas p-4 shadow-[0_16px_50px_rgba(41,29,22,0.05)] sm:p-6 md:p-8">
                <HostawayBooking listingId={listingId} />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-bg-canvas py-16 md:py-24 lg:py-28">
        <div className="container-figma">
          <div className="mb-10 max-w-[760px] md:mb-14">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-brand-default">The stay</p>
            <h2 className="mt-3 font-heading text-h2 font-medium tracking-display text-text-primary">A place that works with the way you travel</h2>
          </div>

          <div className="space-y-16 md:space-y-24">
            {stories.map((story, index) => (
              <div key={story.image.src} className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">{["Settle in", "Make the day yours", "Wind down"][index]}</p>
                  <div className="mt-4 space-y-5 text-lg leading-8 tracking-body text-text-secondary">
                    {story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </div>
                <div className={`relative aspect-[4/3] overflow-hidden rounded-4 bg-bg-surface ${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <Image src={story.image.src} alt={story.image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-subtle py-16 md:py-24">
        <div className="container-figma">
          <div className="mb-10 max-w-[720px]">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-brand-default">At a glance</p>
            <h2 className="mt-3 font-heading text-h2 font-medium tracking-display text-text-primary">Everything you need to know</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {details.map((list) => <DetailList key={list.heading} heading={list.heading} items={list.items} />)}
          </div>
        </div>
      </section>

      <section className="bg-bg-canvas py-16 md:py-24">
        <div className="container-figma">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-14">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-brand-default">Location</p>
              <h2 className="mt-3 font-heading text-h2 font-medium tracking-display text-text-primary">Close to the reason you came</h2>
              <div className="mt-5 space-y-5 text-base leading-7 tracking-body text-text-secondary">
                {location.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
            <iframe
              title={`Map of ${location.mapQuery}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed`}
              className="h-map w-full rounded-4 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <CommunityCTA />

      {!isSenator && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-bg-canvas/95 p-3 backdrop-blur-md md:hidden">
          <a href="#availability" className="flex min-h-11 items-center justify-center rounded-2 bg-button-primary-bg px-5 text-sm font-medium tracking-body text-button-primary-text">
            Check availability
          </a>
        </div>
      )}
    </>
  );
}
