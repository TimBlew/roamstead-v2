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
      <section className="grid min-h-[560px] overflow-hidden bg-[#F4EFEC] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex items-center px-6 py-16 md:px-10 lg:px-16">
          <div className="max-w-[620px]">
            <p className="font-body text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-[#4A6E57]">
              Our Properties
            </p>

            <h1
              className="mt-5 font-heading text-[52px] font-medium leading-[54px] tracking-[-2.08px] text-[#1F3125] md:text-[68px] md:leading-[70px] md:tracking-[-2.72px]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              Homes for Those Who Roam
            </h1>

            <div className="mt-7 max-w-[570px] border-l border-[#4A6E57]/40 pl-5 md:pl-6">
              <p className="font-body text-[18px] font-normal leading-8 tracking-[-0.36px] text-[#6D6057] md:text-[19px]">
                Roamstead is a growing collection of places to stay across Heber Valley and nearby mountain towns.
              </p>

              <p className="mt-3 font-body text-[18px] font-medium leading-8 tracking-[-0.36px] text-[#291D16] md:text-[19px]">
                Each one is different, but all are designed with the same belief:
                <span className="font-medium text-[#291D16]"> place comes first.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] lg:min-h-[560px]">
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

      <section className="bg-[#FFFCFB] px-6 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 max-w-[720px] md:mb-14">
            <h2
              className="font-heading text-[40px] font-medium leading-[44px] tracking-[-1.6px] text-[#1F3125] md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              Find your place
            </h2>
            <p className="mt-4 font-body text-[18px] font-normal leading-7 tracking-[-0.36px] text-[#6D6057]">
              From a quiet Midway condo to a six-bedroom Deer Valley home, each property has its own rhythm, setting, and reason to return.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-2 lg:gap-y-16">
            {collection.map((property) => {
              if (!property) return null;

              const href = "/properties/" + property.slug;
              const facts = property.stats.slice(0, 3).map((stat) => {
                if (stat.label.toLowerCase() === "sleeps") return "Sleeps " + stat.value;
                return stat.value + " " + stat.label;
              });

              return (
                <article key={property.slug} className="group">
                  <a href={href} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-3 bg-[#F4EFEC]">
                      <Image
                        src={property.hero.image.src}
                        alt={property.hero.image.alt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                  </a>

                  <div className="pt-5">
                    <p className="font-body text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-[#8F7E73]">
                      {property.hero.locationLabel.replace(", Utah", "")}
                    </p>

                    <div className="mt-2 flex items-start justify-between gap-4">
                      <h3
                        className="font-heading text-[36px] font-medium leading-[40px] tracking-[-1.44px] text-[#1F3125] md:text-[42px] md:leading-[46px] md:tracking-[-1.68px]"
                        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
                      >
                        <a href={href} className="transition-colors hover:text-[#4A6E57]">
                          {property.hero.title}
                        </a>
                      </h3>

                      <a
                        href={href}
                        className="mt-1 shrink-0 font-body text-[15px] font-medium leading-6 tracking-[-0.3px] text-[#4A6E57] transition-colors hover:text-[#3C6049]"
                      >
                        View property →
                      </a>
                    </div>

                    <p className="mt-4 max-w-[62ch] font-body text-[16px] font-normal leading-7 tracking-[-0.32px] text-[#6D6057]">
                      {property.intro}
                    </p>

                    <p className="mt-4 font-body text-[14px] font-normal leading-6 tracking-[-0.28px] text-[#8F7E73]">
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
