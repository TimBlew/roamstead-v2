import Image from "next/image";
import { properties } from "@/data/properties";

const order = ["hygge-house", "granary", "daystar", "lowell", "powder-room", "senator"];

export const metadata = {
  title: "Book Direct | Roamstead",
  description: "Choose a Roamstead stay, check your dates, and book direct.",
};

export default function BookPage() {
  const stays = order.flatMap((slug) => {
    const property = properties.find((item) => item.slug === slug);
    return property ? [property] : [];
  });

  return (
    <div className="bg-[#FFFCFB]">
      <section className="bg-[#F4EFEC] px-5 pb-9 pt-10 md:px-10 md:pb-14 md:pt-16">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-body text-[12px] font-medium uppercase tracking-[0.1em] text-[#4A6E57] md:text-[13px]">Book direct with Roamstead</p>
          <h1 className="mt-3 max-w-[820px] font-heading text-[42px] font-medium leading-[1.06] tracking-[-0.045em] text-[#1F3125] md:mt-4 md:text-[64px]">
            Your mountain stay is waiting
          </h1>
          <p className="mt-4 max-w-[620px] font-body text-[16px] leading-[25px] text-[#6D6057] md:mt-5 md:text-[19px] md:leading-8">
            Start by choosing a place below. Then pick your dates and book directly with Roamstead.
          </p>
          <a href="#choose-your-stay" className="mt-6 inline-flex min-h-11 items-center justify-center bg-[#4A6E57] px-6 font-body text-[14px] font-medium text-white transition-colors hover:bg-[#3C6049] md:mt-7 md:text-[15px]">
            Choose your stay <span aria-hidden="true" className="ml-3">↓</span>
          </a>
        </div>
      </section>

      <section id="choose-your-stay" className="scroll-mt-16 mx-auto max-w-[1280px] px-4 pb-14 pt-8 md:px-8 md:pb-20 md:pt-12">
        <div className="mb-5 md:mb-8">
          <p className="font-body text-[12px] font-medium uppercase tracking-[0.1em] text-[#4A6E57] md:text-[13px]">Choose your property</p>
          <h2 className="mt-2 font-heading text-[32px] font-medium leading-[1.1] tracking-[-0.04em] text-[#1F3125] md:text-[44px]">
            Where will you stay?
          </h2>
          <p className="mt-2 font-body text-[14px] leading-6 text-[#6D6057] md:text-[16px]">
            Select a property to check available dates.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {stays.map((property) => {
            const senator = property.slug === "senator";
            const href = senator ? property.bookingUrl : `/book/${property.slug}`;
            const facts = senator
              ? "Historic bed & breakfast · Heber City"
              : property.stats.slice(0, 3).map((stat) => `${stat.value} ${stat.label}`).join(" · ");

            return (
              <article key={property.slug} className="group flex min-w-0 flex-col overflow-hidden rounded-[12px] border border-[#E7DFDB] bg-[#FBF8F7] transition-colors hover:border-[#A9B9A9]">
                <a href={href} {...(senator ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="block" aria-label={`Check availability for ${property.hero.title}`}>
                  <div className="relative aspect-[1.9] overflow-hidden bg-[#F4EFEC] sm:aspect-[1.65]">
                    <Image src={property.hero.image.src} alt={property.hero.image.alt} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                  </div>
                </a>
                <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5 md:px-5 md:pb-5 md:pt-4">
                  <p className="font-body text-[12px] leading-5 text-[#8F7E73]">{property.hero.locationLabel.replace(", Utah", "")}</p>
                  <h3 className="mt-0.5 font-heading text-[26px] font-medium leading-[1.15] tracking-[-0.04em] text-[#1F3125] md:text-[29px]">
                    <a href={href} {...(senator ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{property.hero.title}</a>
                  </h3>
                  <p className="mt-2 font-body text-[13px] leading-5 text-[#6D6057] md:text-[14px]">{facts}</p>
                  <a href={href} {...(senator ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-[7px] bg-[#4A6E57] px-4 font-body text-[13px] font-medium text-white transition-colors hover:bg-[#3C6049] md:mt-5 md:text-[14px]">
                    {senator ? "Check rooms & dates" : "Check available dates"} <span aria-hidden="true" className="ml-2">→</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
