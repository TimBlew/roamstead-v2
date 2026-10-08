import Image from "next/image";
import { Fragment } from "react";
import { CommunityCTA } from "@/components/sections/CommunityCTA";
import { properties } from "@/data/properties";

const order = ["hygge-house", "granary", "daystar", "lowell", "powder-room", "senator"];

const propertyHighlights: Record<string, string[]> = {
  "hygge-house": ["Private 4-person sauna", "Dedicated office", "Garage gym & gear storage", "Fenced yard & fire pit"],
  granary: ["Mountain views", "Gas fireplace", "Full kitchen", "Walkable to Midway"],
  daystar: ["Outdoor hot tub", "Indoor sauna", "Indoor sport court", "Pool table"],
  lowell: ["Steps from the slopes", "Steam shower", "Heated pool & hot tub", "Ski storage"],
  "powder-room": ["At the resort base", "Pool & hot tub", "Fitness center", "Ski storage"],
  senator: ["Historic 1902 home", "Breakfast included", "Individual guest rooms", "Wraparound porch"],
};


export default function PropertiesPage() {
  const collection = order
    .map((slug) => properties.find((property) => property.slug === slug))
    .filter(Boolean);

  return (
    <>
      <section className="grid overflow-hidden bg-[#F4EFEC] lg:min-h-[570px] lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
        <div className="flex items-center px-4 pb-4 pt-5 md:px-10 md:py-12 lg:px-12 lg:py-14 xl:px-[clamp(56px,5vw,100px)]">
          <div className="w-full max-w-[610px]">
            <p className="font-body text-[13px] font-medium leading-[18px] tracking-[0.02em] text-[#4A6E57] md:text-[14px]">
              Our Properties
            </p>

            <h1
              className="mt-3 max-w-[600px] font-heading text-[40px] font-medium leading-[41px] tracking-[-1.6px] text-[#1F3125] md:mt-5 md:text-[54px] md:leading-[1.08] md:tracking-[-2px] xl:text-[58px] xl:leading-[1.08]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              Homes for Those Who Roam
            </h1>

            <div className="mt-5 max-w-[680px] border-l border-[#4A6E57]/25 pl-4 md:mt-8 md:pl-6 lg:mt-9 lg:max-w-[530px]">
              <p className="max-w-none font-body text-[15px] font-normal leading-[21px] tracking-[-0.3px] text-[#6D6057] md:text-[17px] md:leading-[27px] md:tracking-[-0.22px]">
                Roamstead is a growing collection of places to stay across Heber Valley and nearby mountain towns.
              </p>

              <p className="mt-2 max-w-none font-body text-[15px] font-normal leading-[21px] tracking-[-0.3px] text-[#6D6057] md:mt-3 md:text-[17px] md:leading-[29px] md:tracking-[-0.32px]">
                Each one is different, but all are designed with the same belief.
              </p>
              <p className="mt-3 font-heading text-[23px] font-medium leading-[27px] tracking-[-0.7px] text-[#1F3125] md:mt-5 md:text-[26px] md:leading-[31px] md:tracking-[-0.9px]">
                Place comes first.
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[220px] overflow-hidden md:min-h-[320px] lg:min-h-[570px]">
          <Image
            src="/images/local-nature.jpg"
            alt="Heber Valley in winter"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#F4EFEC]/20" />
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#F4EFEC] via-[#F4EFEC]/35 to-transparent md:h-14 lg:hidden" />
        </div>
      </section>

      <section className="bg-[#FFFCFB] px-2 py-7 md:px-8 md:py-12 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-5 px-1 md:mb-8 md:px-0">
            <h2
              className="font-heading text-[31px] font-medium leading-[34px] tracking-[-1.24px] text-[#1F3125] md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              Find your place
            </h2>
            <p className="mt-2 max-w-[42ch] font-body text-[14.5px] font-normal leading-[21px] tracking-[-0.29px] text-[#6D6057] md:mt-4 md:max-w-[820px] md:text-[18px] md:leading-7 md:tracking-[-0.36px]">
              From a quiet Midway condo to a six-bedroom Deer Valley home, each property has its own rhythm, setting, and reason to return.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
            {collection.map((property) => {
              if (!property) return null;

              const href = "/properties/" + property.slug;
              const facts = property.stats.slice(0, 3).map((stat) => {
                if (stat.label.toLowerCase() === "sleeps") return "Sleeps " + stat.value;
                return stat.value + " " + stat.label;
              });

              return (
                <article
                  key={property.slug}
                  className="group grid w-full grid-cols-[46%_1fr] gap-3 rounded-[16px] bg-[#FBF8F7] p-2.5 md:flex md:h-full md:flex-col md:overflow-hidden md:rounded-[20px] md:border md:border-[#E7DFDB] md:bg-[#FBF8F7] md:p-0"
                >
                  <a href={href} className="block min-w-0">
                    <div className="relative h-full min-h-[168px] overflow-hidden rounded-[13px] bg-[#F4EFEC] md:aspect-[4/3] md:h-auto md:rounded-none">
                      <Image
                        src={property.hero.image.src}
                        alt={property.hero.image.alt}
                        fill
                        sizes="(min-width: 1024px) 640px, (min-width: 768px) 100vw, 44vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                  </a>

                  <div className="flex min-w-0 flex-col justify-center py-0.5 pr-1 md:flex-1 md:justify-start md:px-5 md:pb-5 md:pt-5">
                    <p className="font-body text-[12px] font-medium leading-4 tracking-[-0.24px] text-[#8F7E73] md:text-[14px] md:leading-[18px] md:tracking-[-0.28px]">
                      {property.hero.locationLabel.replace(", Utah", "")}
                    </p>

                    <div className="mt-0.5 md:mt-2 md:flex md:items-start md:justify-between md:gap-4">
                      <h3
                        className="font-heading text-[27px] font-medium leading-[29px] tracking-[-1.08px] text-[#1F3125] md:text-[34px] md:leading-[38px] md:tracking-[-1.36px]"
                        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
                      >
                        <a href={href} className="transition-colors hover:text-[#4A6E57]">
                          {property.hero.title}
                        </a>
                      </h3>

                      <a
                        href={href}
                        className="mt-2 hidden shrink-0 font-body text-[14px] font-medium leading-5 tracking-[-0.28px] text-[#4A6E57] transition-colors hover:text-[#3C6049] md:block"
                      >
                        Check availability →
                      </a>
                    </div>

                    <p className="mt-2 font-body text-[13px] font-normal leading-[18px] tracking-[-0.26px] text-[#6D6057] md:mt-5 md:max-w-none md:text-[14px] md:leading-[22px] md:tracking-[-0.28px]">
                      <span className="md:hidden">{facts.map((fact, index) => (
                        <Fragment key={fact}>
                          {index > 0 ? " · " : ""}
                          <span className="whitespace-nowrap">{fact}</span>
                        </Fragment>
                      ))}</span>
                      <span className="hidden md:block">
                        <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8F7E73]">Stay highlights</span>
                        <span className="grid grid-cols-1 gap-x-3 gap-y-2.5 xl:grid-cols-2">
                          {(propertyHighlights[property.slug] ?? []).map((highlight) => (
                            <span key={highlight} className="flex min-w-0 items-start gap-2 text-[14px] leading-[20px] text-[#4D5149]">
                              <span aria-hidden="true" className="mt-[8px] h-[4px] w-[4px] shrink-0 rounded-full bg-[#4A6E57]" />
                              <span>{highlight}</span>
                            </span>
                          ))}
                        </span>
                      </span>
                    </p>

                    <a
                      href={href}
                      className="mt-3 inline-flex items-center font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#4A6E57] md:hidden"
                    >
                      Check availability →
                    </a>

                    <p className="mt-4 hidden border-t border-[#E7DFDB] pt-3 font-body md:mt-auto text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#6D6057] md:block">
                      {facts.join("  ·  ")}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CommunityCTA />
    </>
  );
}
