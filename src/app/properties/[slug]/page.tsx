import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { CommunityCTA } from "@/components/sections/CommunityCTA";
import { getProperty, properties } from "@/data/properties";

type PageProps = {
  params: Promise<{ slug: string }>;
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
    <div className="flex flex-col">
      <h3 className="border-b border-border-default py-1 font-body text-xl font-medium tracking-body text-text-secondary">
        {heading}
      </h3>
      <ul>
        {items.map((item) => (
          <li
            key={item}
            className="border-b border-border-subtle py-2 text-md tracking-body text-text-primary"
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

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-property-hero flex-col justify-end overflow-hidden">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-brand-default" />
        <div className="container-figma relative w-full py-8">
          <div className="flex max-w-property-hero-text flex-col items-start gap-2">
            <p className="text-lg font-medium tracking-body text-text-dark-secondary">
              {hero.locationLabel}
            </p>
            <h1 className="font-heading text-[length:var(--text-display)] font-medium leading-[var(--text-h1-lh)] tracking-display text-text-dark-primary">
              {hero.title}
            </h1>
            <p className="text-lg tracking-body text-text-dark-secondary">{hero.subtitle}</p>
            <Button href={bookingUrl} external variant="secondary">
              Check availability
            </Button>
          </div>
        </div>
      </section>

      {/* Orientation */}
      <section className="container-figma flex flex-col items-center gap-3 py-8">
        <p className="w-full max-w-content-narrow text-xl tracking-body text-text-secondary">
          {property.intro}
        </p>
        <dl className="grid w-full max-w-content-narrow grid-cols-2 gap-1 border-t border-border-subtle py-2 md:flex md:gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse md:flex-1">
              <dt className="text-md tracking-body text-text-secondary">{stat.label}</dt>
              <dd className="font-heading text-[length:var(--text-h4)] font-medium leading-[var(--text-h3-lh)] tracking-body text-text-primary">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* The Stay */}
      <section>
        {stories.map((story, index) => (
          <div
            key={story.image.src}
            className="container-figma flex flex-col items-center gap-2 py-4 md:flex-row md:py-8"
          >
            <div className="w-full space-y-[var(--text-lg-lh)] text-lg tracking-body text-text-primary md:flex-1">
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div
              className={`relative h-story-image w-full md:flex-1 ${index % 2 === 1 ? "md:order-first" : ""}`}
            >
              <Image
                src={story.image.src}
                alt={story.image.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Details */}
      <section className="container-figma grid grid-cols-1 gap-x-2 gap-y-4 py-8 md:grid-cols-2">
        <DetailList heading="The House" items={details.house} />
        <DetailList heading="Every Room Includes" items={details.roomIncludes} />
        <DetailList heading="Grounds & shared spaces" items={details.grounds} />
        <DetailList heading="Practical notes" items={details.practicalNotes} />
      </section>

      {/* Location */}
      <section className="container-figma flex flex-col items-center gap-3 py-8">
        <div className="w-full max-w-content-narrow space-y-[var(--text-xl-lh)] text-xl tracking-body text-text-secondary">
          {location.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <iframe
          title={`Map of ${location.address}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(location.address)}&output=embed`}
          className="h-map w-full max-w-content-narrow border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <CommunityCTA />
    </>
  );
}
