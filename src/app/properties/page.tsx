import Image from "next/image";
import { Fragment } from "react";
import { CommunityCTA } from "@/components/sections/CommunityCTA";
import { properties } from "@/data/properties";

const order = ["hygge-house", "granary", "daystar", "lowell", "powder-room", "senator"];

export default function PropertiesPage() {
  const collection = order
    .map((slug) => properties.find((property) => property.slug === slug))
    .filter(Boolean);

  return (
    <>
      <section className="grid overflow-hidden bg-[#F4EFEC] lg:min-h-[560px] lg:grid-cols-[1fr_1fr]">
        <div className="flex items-center px-4 pb-4 pt-5 md:px-10 md:py-12 lg:px-16 lg:py-16">
          <div className="w-full max-w-[720px]">
            <p className="font-body text-[13px] font-medium leading-[18px] tracking-[-0.26px] text-[#4A6E57] md:text-[14px] md:tracking-[-0.28px]">
              Our Properties
            </p>

            <h1
              className="mt-2 max-w-[680px] font-heading text-[40px] font-medium leading-[41px] tracking-[-1.6px] text-[#1F3125] md:mt-5 md:text-[68px] md:leading-[70px] md:tracking-[-2.72px]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              Homes for Those Who Roam
            </h1>

            <div className="mt-4 max-w-[680px] border-l border-[#4A6E57]/30 pl-3 md:mt-7 md:pl-6">
              <p className="max-w-none font-body text-[15px] font-normal leading-[21px] tracking-[-0.3px] text-[#6D6057] md:text-[19px] md:leading-8 md:tracking-[-0.36px]">
                Roamstead is a growing collection of places to stay across Heber Valley and nearby mountain towns.
              </p>

              <p className="mt-2 max-w-none font-body text-[15px] font-normal leading-[21px] tracking-[-0.3px] text-[#6D6057] md:mt-3 md:text-[19px] md:leading-8 md:tracking-[-0.36px]">
                Each one is different, but all are designed with the same belief.
              </p>
              <p className="mt-1 font-heading text-[23px] font-medium leading-[25px] tracking-[-0.92px] text-[#1F3125] md:mt-3 md:text-[30px] md:leading-[32px] md:tracking-[-1.2px]">
                Place comes first.
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[220px] overflow-hidden md:min-h-[320px] lg:min-h-[560px]">
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
                  className="group grid w-full grid-cols-[46%_1fr] gap-3 rounded-[16px] bg-[#FBF8F7] p-2.5 md:flex md:flex-col md:overflow-hidden md:rounded-[20px] md:border md:border-[#E7DFDB] md:bg-[#FBF8F7] md:p-0"
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

                  <div className="flex min-w-0 flex-col justify-center py-0.5 pr-1 md:px-5 md:pb-5 md:pt-4">
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

                    <p className="mt-2 font-body text-[13px] font-normal leading-[18px] tracking-[-0.26px] text-[#6D6057] md:mt-3 md:max-w-[46ch] md:text-[14px] md:leading-[21px] md:tracking-[-0.28px]">
                      <span className="md:hidden">{facts.map((fact, index) => (
                        <Fragment key={fact}>
                          {index > 0 ? " · " : ""}
                          <span className="whitespace-nowrap">{fact}</span>
                        </Fragment>
                      ))}</span>
                      <span className="hidden md:inline">{property.intro}</span>
                    </p>

                    <a
                      href={href}
                      className="mt-3 inline-flex items-center font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#4A6E57] md:hidden"
                    >
                      Check availability →
                    </a>

                    <p className="mt-4 hidden border-t border-[#E7DFDB] pt-3 font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#6D6057] md:block">
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
