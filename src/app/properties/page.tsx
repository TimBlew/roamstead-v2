import Image from "next/image";
import { SenatorBand } from "@/components/sections/SenatorBand";
import { CommunityCTA } from "@/components/sections/CommunityCTA";
import { properties } from "@/data/properties";

const order = ["hygge-house", "granary", "lowell", "powder-room"];

export const metadata = {
  title: "Our stays | Roamstead Collective",
  description: "Homes across Utah's Wasatch Back, from Heber Valley to Park City. Ski, ride, float, then settle in. Book direct with Roamstead Collective.",
  openGraph: { title: "Our stays | Roamstead Collective", description: "Homes across Utah's Wasatch Back, from Heber Valley to Park City. Ski, ride, float, then settle in. Book direct with Roamstead Collective." },
  twitter: { title: "Our stays | Roamstead Collective", description: "Homes across Utah's Wasatch Back, from Heber Valley to Park City. Ski, ride, float, then settle in. Book direct with Roamstead Collective." },
};

export default function PropertiesPage() {
  const collection = order
    .map((slug) => properties.find((property) => property.slug === slug))
    .filter(Boolean);

  return (
    <>
      <section className="relative overflow-hidden bg-[#F4EFEC]">
        <div className="mx-auto grid w-full items-stretch lg:min-h-[510px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.94fr)]">
          <div className="relative z-10 flex flex-col justify-center px-4 pb-5 pt-7 md:px-10 md:py-12 lg:pl-[clamp(88px,9vw,180px)] lg:pr-8 lg:py-12">
            <div className="max-w-[680px]">
              <p className="font-body text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-[#4A6E57] md:text-[16px] lg:tracking-[0.14em]">
                Our stays
              </p>
              <h1
                className="mt-3 max-w-[670px] font-heading text-[40px] font-medium leading-[1.08] tracking-[-0.04em] text-[#1F3125] md:mt-5 md:text-[54px] md:tracking-[-0.04em] lg:text-[clamp(43px,3.1vw,60px)] lg:leading-[1.06] lg:tracking-[-0.045em]"
                style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
              >
                Homes for people<br className="hidden lg:block" /> who roam
              </h1>
              <div className="mt-5 max-w-[680px] border-l border-[#4A6E57]/25 pl-4 md:mt-8 md:pl-6 lg:mt-6 lg:max-w-[560px]">
                <p className="font-body text-[15px] font-normal leading-[21px] tracking-[-0.3px] text-[#6D6057] md:text-[18px] md:leading-[28px] md:tracking-[-0.22px] lg:leading-[1.5]">
                  Roamstead Collective started in Heber Valley and has grown across the Wasatch Back. Every home is different. The rule is the same: <strong className="font-semibold text-[#1F3125]">the place comes first.</strong>
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

      <section className="bg-[#FFFCFB] px-2 py-7 md:px-8 md:py-9 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-4 px-1 md:mb-5 md:px-0">
            <h2
              className="font-heading text-[31px] font-medium leading-[34px] tracking-[-1.24px] text-[#1F3125] md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
              style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
            >
              Find your fit
            </h2>
            <p className="mt-2 max-w-[42ch] font-body text-[14.5px] font-normal leading-[21px] tracking-[-0.29px] text-[#6D6057] md:mt-2 md:max-w-[820px] md:text-[18px] md:leading-[1.45] md:tracking-[-0.36px]">
              From a studio at the base of Park City Mountain to a Midway home that sleeps 10, each stay has its own setting and its own reason to come back.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-x-7 md:gap-y-10 xl:grid-cols-2 xl:gap-x-8">
            {collection.map((property) => {
              if (!property) return null;

              const href = "/book/" + property.slug;
              const detailHref = "/properties/" + property.slug;
              const facts = property.slug === "powder-room" ? ["Sleeps 4", "Studio", "1 Bath"] : property.stats.slice(0, 3).map((stat) => stat.label.toLowerCase() === "sleeps" ? "Sleeps " + stat.value : stat.value + " " + stat.label);
              const hooks: Record<string, string> = {
                "hygge-house": "Room for 10. Cozy enough to earn the name.",
                granary: "A quiet Midway base for 2 to 4. The kitchen island does a lot of work.",
                lowell: "At the base of Park City Mountain. Boots on, lift next.",
                "powder-room": "Yes, it's called the Powder Room. Yes, it's for skiers. A studio inside the Lowell building.",
              };

              return (
                <article
                  key={property.slug}
                  className="group grid w-full grid-cols-[46%_1fr] gap-3 rounded-[16px] bg-[#FBF8F7] p-2.5 md:flex md:flex-col md:overflow-visible md:rounded-none md:border-0 md:bg-transparent md:p-0"
                >
                  <a href={detailHref} className="block min-w-0">
                    <div className="relative h-full min-h-[168px] overflow-hidden rounded-[13px] bg-[#F4EFEC] md:aspect-[1.58] md:h-auto md:rounded-[10px]">
                      <Image
                        src={property.slug === "powder-room" ? "/images/powder-room/bedroom.jpg" : property.slug === "hygge-house" ? "https://d2ol7oe51mr4n9.cloudfront.net/user_3JhtTKjJmo2R3mPhsBJElt2FRYV/8d444f85-ede6-407c-ae17-93e38999bdff.jpg" : property.hero.image.src}
                        alt={property.slug === "powder-room" ? "Powder Room studio bedroom and seating" : property.slug === "hygge-house" ? "Front exterior of Hygge House in Midway, Utah" : property.hero.image.alt}
                        fill
                        sizes="(min-width: 1024px) 640px, (min-width: 768px) 100vw, 44vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                  </a>

                  <div className="flex min-w-0 flex-col justify-center py-0.5 pr-1 md:justify-start md:px-0 md:pb-0 md:pt-3">
                    <p className="font-body text-[12px] font-medium leading-4 tracking-[-0.24px] text-[#8F7E73] md:text-[14px] md:leading-[20px] md:tracking-[-0.1px]">
                      {property.hero.locationLabel.replace(", Utah", "")}
                    </p>

                    <div className="mt-0.5 md:mt-1.5 md:block">
                      <h3
                        className="font-heading text-[27px] font-medium leading-[29px] tracking-[-1.08px] text-[#1F3125] md:text-[clamp(31px,2.35vw,43px)] md:leading-[1.12] md:tracking-[-0.04em]"
                        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
                      >
                        <a href={detailHref} className="transition-colors hover:text-[#4A6E57]">
                          {property.hero.title}
                        </a>
                      </h3>

                    </div>

                    <p className="mt-1.5 font-body text-[14px] leading-[22px] text-[#6D6057] md:text-[16px] md:leading-6">{hooks[property.slug]}</p>
                    <p className="mt-2 font-body text-[13px] font-normal leading-[20px] tracking-[-0.2px] text-[#6D6057] md:mt-3 md:text-[15px] md:leading-[23px]">
                      {facts.join(" · ")}
                    </p>

                    <a href={href} className="mt-4 inline-flex h-12 w-fit items-center justify-center rounded-[7px] border border-[#D9CDC6] px-5 font-body text-[14px] font-medium text-[#2B302A] transition-colors hover:border-[#4A6E57] hover:bg-[#F4EFEC] md:mt-4 md:min-w-[155px]">
                      Check dates
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <SenatorBand campaign="properties-page" />
      <CommunityCTA />
    </>
  );
}
