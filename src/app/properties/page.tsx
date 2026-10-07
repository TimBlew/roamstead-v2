import Image from "next/image";
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
        <div className="flex items-center px-5 py-8 md:px-10 md:py-12 lg:px-16 lg:py-16">
          <div className="w-full max-w-[700px]">
            <p className="font-body text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-[#4A6E57]">
              Our Properties
            </p>

            <h1
              className="mt-3 font-heading text-[40px] font-medium leading-[42px] tracking-[-1.6px] md:mt-5 text-[#1F3125] md:text-[68px] md:leading-[70px] md:tracking-[-2.72px]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              Homes for Those Who Roam
            </h1>

            <div className="mt-4 max-w-[640px] border-l border-[#4A6E57]/30 pl-4 md:mt-7 md:pl-6">
              <p className="font-body text-[15px] font-normal leading-[22px] tracking-[-0.3px] text-[#6D6057] md:text-[19px] md:leading-8 md:tracking-[-0.36px]">
                Roamstead is a growing collection of places to stay across Heber Valley and nearby mountain towns.
              </p>

              <p className="mt-2 font-body text-[15px] font-normal leading-[22px] tracking-[-0.3px] text-[#6D6057] md:mt-3 md:text-[19px] md:leading-8 md:tracking-[-0.36px]">
                Each one is different, but all are designed with the same belief.
              </p>
              <p className="mt-2 font-heading text-[22px] font-medium leading-[24px] tracking-[-0.88px] text-[#1F3125] md:mt-3 md:text-[30px] md:leading-[32px] md:tracking-[-1.2px]">
                Place comes first.
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[230px] md:min-h-[320px] lg:min-h-[560px]">
          <Image
            src="/images/local-nature.jpg"
            alt="Heber Valley in winter"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#F4EFEC]/20" />
        </div>
      </section>

      <section className="bg-[#FFFCFB] px-5 py-8 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-5 max-w-[760px] md:mb-10">
            <h2
              className="font-heading text-[32px] font-medium leading-[35px] tracking-[-1.28px] text-[#1F3125] md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              Find your place
            </h2>
            <p className="mt-2.5 font-body text-[15px] font-normal leading-[22px] tracking-[-0.3px] text-[#6D6057] md:mt-4 md:text-[18px] md:leading-7 md:tracking-[-0.36px]">
              From a quiet Midway condo to a six-bedroom Deer Valley home, each property has its own rhythm, setting, and reason to return.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12">
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
                  className="group grid grid-cols-[128px_1fr] gap-4 rounded-[16px] bg-[#FBF8F7] p-3 md:block md:overflow-hidden md:rounded-[20px] md:border md:border-[#E7DFDB] md:bg-[#FBF8F7] md:p-3"
                >
                  <a href={href} className="block">
                    <div className="relative h-full min-h-[128px] overflow-hidden rounded-[13px] bg-[#F4EFEC] md:aspect-[16/9] md:h-auto md:rounded-[16px]">
                      <Image
                        src={property.hero.image.src}
                        alt={property.hero.image.alt}
                        fill
                        sizes="(min-width: 1024px) 640px, (min-width: 768px) 100vw, 128px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                  </a>

                  <div className="flex min-w-0 flex-col justify-center md:px-2 md:pb-3 md:pt-4">
                    <p className="font-body text-[12px] font-medium leading-4 tracking-[-0.24px] text-[#8F7E73] md:text-[14px] md:leading-[18px] md:tracking-[-0.28px]">
                      {property.hero.locationLabel.replace(", Utah", "")}
                    </p>

                    <div className="mt-0.5 md:mt-2 md:flex md:items-start md:justify-between md:gap-4">
                      <h3
                        className="font-heading text-[24px] font-medium leading-[27px] tracking-[-0.96px] text-[#1F3125] md:text-[38px] md:leading-[42px] md:tracking-[-1.52px]"
                        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
                      >
                        <a href={href} className="transition-colors hover:text-[#4A6E57]">
                          {property.hero.title}
                        </a>
                      </h3>

                      <a
                        href={href}
                        className="mt-2 hidden shrink-0 font-body text-[15px] font-medium leading-6 tracking-[-0.3px] text-[#4A6E57] transition-colors hover:text-[#3C6049] md:block"
                      >
                        See the stay →
                      </a>
                    </div>

                    <p className="mt-1.5 font-body text-[12.5px] font-normal leading-[18px] tracking-[-0.25px] text-[#6D6057] md:mt-3 md:max-w-[58ch] md:text-[15px] md:leading-6 md:tracking-[-0.32px]">
                      <span className="md:hidden">{facts.join(" · ")}</span>
                      <span className="hidden md:inline">{property.intro}</span>
                    </p>

                    <a
                      href={href}
                      className="mt-2 inline-flex items-center font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#4A6E57] md:hidden"
                    >
                      See the stay →
                    </a>

                    <p className="mt-3 hidden border-t border-[#E7DFDB] pt-3 font-body text-[13px] font-medium leading-5 tracking-[-0.26px] text-[#6D6057] md:block">
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
