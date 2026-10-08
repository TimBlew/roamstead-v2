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
      <section className="relative overflow-hidden bg-[#F4EFEC]">
        <div className="mx-auto grid max-w-[1440px] items-stretch lg:min-h-[570px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.94fr)]">
          <div className="relative z-10 flex flex-col justify-center px-4 pb-5 pt-7 md:px-10 md:py-12 lg:px-14 lg:py-16 xl:pl-20">
            <div className="max-w-[610px]">
              <p className="font-body text-[13px] font-medium leading-[18px] tracking-[0.02em] text-[#4A6E57] md:text-[14px] lg:tracking-[0.1em]">
                Our Properties
              </p>
              <h1
                className="mt-3 max-w-[600px] font-heading text-[40px] font-medium leading-[41px] tracking-[-1.6px] text-[#1F3125] md:mt-5 md:text-[54px] md:leading-[1.08] md:tracking-[-2px] lg:mt-5 lg:text-[clamp(46px,3.45vw,64px)] lg:leading-[1.06] lg:tracking-[-0.045em]"
                style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
              >
                Homes for Those Who Roam
              </h1>
              <div className="mt-5 max-w-[680px] border-l border-[#4A6E57]/25 pl-4 md:mt-8 md:pl-6 lg:mt-7 lg:max-w-[485px]">
                <p className="font-body text-[15px] font-normal leading-[21px] tracking-[-0.3px] text-[#6D6057] md:text-[17px] md:leading-[27px] md:tracking-[-0.22px] lg:leading-[1.5]">
                  Roamstead is a growing collection of places to stay across Heber Valley and nearby mountain towns.
                </p>
                <p className="mt-2 font-body text-[15px] font-normal leading-[21px] tracking-[-0.3px] text-[#6D6057] md:mt-3 md:text-[17px] md:leading-[29px] md:tracking-[-0.32px] lg:leading-[1.5]">
                  Each one is different, but all are designed with the same belief.
                </p>
                <p className="mt-3 font-heading text-[23px] font-medium leading-[27px] tracking-[-0.7px] text-[#1F3125] md:mt-5 md:text-[26px] md:leading-[31px] md:tracking-[-0.9px] lg:text-[27px]">
                  Place comes first.
                </p>
              </div>
            </div>
          </div>
          <div className="relative min-h-[220px] w-full overflow-hidden md:min-h-[320px] lg:min-h-full">
            <Image
              src="/images/local-nature.jpg"
              alt="Heber Valley in winter"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover lg:object-[53%_center]"
            />
            <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#F4EFEC] via-[#F4EFEC]/20 to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#F4EFEC] via-[#F4EFEC]/35 to-transparent md:h-14 lg:hidden" />
          </div>
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

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-7 xl:grid-cols-3 xl:gap-8">
            {collection.map((property) => {
              if (!property) return null;

              const href = "/properties/" + property.slug;
              const facts = property.slug === "senator"
                ? ["Historic bed & breakfast", "Individual guest rooms", "Book by room"]
                : property.stats.slice(0, 3).map((stat) => {
                    if (stat.label.toLowerCase() === "sleeps") return "Sleeps " + stat.value;
                    return stat.value + " " + stat.label;
                  });

              return (
                <article
                  key={property.slug}
                  className="group grid w-full grid-cols-[46%_1fr] gap-3 rounded-[16px] bg-[#FBF8F7] p-2.5 md:flex md:h-full md:flex-col md:overflow-visible md:rounded-none md:border-0 md:bg-transparent md:p-0"
                >
                  <a href={href} className="block min-w-0">
                    <div className="relative h-full min-h-[168px] overflow-hidden rounded-[13px] bg-[#F4EFEC] md:aspect-[1.58] md:h-auto md:rounded-[10px]">
                      <Image
                        src={property.slug === "hygge-house" ? "https://d2ol7oe51mr4n9.cloudfront.net/user_3JhtTKjJmo2R3mPhsBJElt2FRYV/8d444f85-ede6-407c-ae17-93e38999bdff.jpg" : property.hero.image.src}
                        alt={property.slug === "hygge-house" ? "Front exterior of Hygge House in Midway, Utah" : property.hero.image.alt}
                        fill
                        sizes="(min-width: 1024px) 640px, (min-width: 768px) 100vw, 44vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                  </a>

                  <div className="flex min-w-0 flex-col justify-center py-0.5 pr-1 md:flex-1 md:justify-start md:px-0 md:pb-0 md:pt-5">
                    <p className="font-body text-[12px] font-medium leading-4 tracking-[-0.24px] text-[#8F7E73] md:text-[14px] md:leading-[20px] md:tracking-[-0.1px]">
                      {property.hero.locationLabel.replace(", Utah", "")}
                    </p>

                    <div className="mt-0.5 md:mt-3 md:block">
                      <h3
                        className="font-heading text-[27px] font-medium leading-[29px] tracking-[-1.08px] text-[#1F3125] md:text-[clamp(31px,2.35vw,43px)] md:leading-[1.12] md:tracking-[-0.04em]"
                        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
                      >
                        <a href={href} className="transition-colors hover:text-[#4A6E57]">
                          {property.hero.title}
                        </a>
                      </h3>

                      <a
                        href={href}
                        className="hidden"
                      >
                        Explore the stay →
                      </a>
                    </div>

                    <p className="mt-2 font-body text-[13px] font-normal leading-[18px] tracking-[-0.26px] text-[#6D6057] md:mt-4 md:max-w-none md:text-[15px] md:leading-[23px] md:tracking-[-0.15px]">
                      <span className="md:hidden">{facts.map((fact, index) => (
                        <Fragment key={fact}>
                          {index > 0 ? " · " : ""}
                          <span className="whitespace-nowrap">{fact}</span>
                        </Fragment>
                      ))}</span>
                      <span className="hidden md:flex md:flex-col md:gap-1 md:text-[15px] md:leading-[23px] md:tracking-[-0.15px]">
                        {facts.map((fact) => <span key={fact}>{fact}</span>)}
                      </span>
                    </p>

                    <a
                      href={href}
                      className="mt-3 inline-flex items-center font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#4A6E57] md:hidden"
                    >
                      Explore the stay →
                    </a>

                    <a href={href} className="mt-5 hidden w-fit items-center justify-center border border-[#D9CDC6] px-5 py-3 font-body text-[13px] font-medium leading-5 text-[#2B302A] transition-colors hover:border-[#4A6E57] hover:bg-[#F4EFEC] md:inline-flex">
                      Explore the stay
                    </a>
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
