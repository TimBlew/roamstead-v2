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
      <section className="relative overflow-hidden bg-[#F4EFEC] px-5 pb-10 pt-10 md:px-10 md:pb-16 md:pt-16">
        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-14">\n          <div>
          <p className="font-body text-[12px] font-medium uppercase tracking-[0.1em] text-[#4A6E57] md:text-[13px]">Book direct with Roamstead</p>
          <h1 className="mt-3 max-w-[820px] font-heading text-[42px] font-medium leading-[1.06] tracking-[-0.045em] text-[#1F3125] md:mt-4 md:text-[64px]">
            Your mountain stay is waiting
          </h1>
          <p className="mt-4 max-w-[620px] font-body text-[16px] leading-[25px] text-[#6D6057] md:mt-5 md:text-[19px] md:leading-8">
            A collection of thoughtfully chosen mountain stays. Find the one that feels right, choose your dates, and make it yours.
          </p>
          <a href="#choose-your-stay" className="mt-6 inline-flex min-h-11 items-center justify-center bg-[#4A6E57] px-6 font-body text-[14px] font-medium text-white transition-colors hover:bg-[#3C6049] md:mt-7 md:text-[15px]">
            Choose your stay <span aria-hidden="true" className="ml-3">↓</span>
          </a>\n          </div>\n          <div className="relative hidden lg:block">\n            <div className="relative aspect-[1.35] overflow-hidden rounded-[10px]">\n              <Image src="/images/senator-main.jpg" alt="Mountain hospitality at Roamstead" fill priority sizes="(min-width: 1024px) 500px, 100vw" className="object-cover object-[center_46%]" />\n            </div>\n            <div className="absolute -bottom-5 -left-5 rounded-[8px] border border-[#E1D7D1] bg-[#FFFCFB] px-5 py-3 shadow-[0_10px_30px_rgba(41,29,22,0.08)]">\n              <p className="font-body text-[11px] font-medium uppercase tracking-[0.12em] text-[#8F7E73]">THE ROAMSTEAD COLLECTION</p>\n              <p className="mt-1 font-heading text-[20px] font-medium text-[#1F3125]">Stay a little longer.</p>\n            </div>\n          </div>\n        </div>\n      </section>

      <section id="choose-your-stay" className="scroll-mt-16 mx-auto max-w-[1280px] px-4 pb-14 pt-10 md:px-8 md:pb-20 md:pt-16">
        <div className="mb-5 md:mb-8">
          <p className="font-body text-[12px] font-medium uppercase tracking-[0.1em] text-[#4A6E57] md:text-[13px]">Choose your property</p>
          <h2 className="mt-2 font-heading text-[32px] font-medium leading-[1.1] tracking-[-0.04em] text-[#1F3125] md:text-[44px]">
            Where will you stay?
          </h2>
          <p className="mt-2 font-body text-[14px] leading-6 text-[#6D6057] md:text-[16px]">
            Explore the collection and select your stay to see available dates.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-7">
          {stays.map((property) => {
            const senator = property.slug === "senator";
            const href = senator ? property.bookingUrl : `/book/${property.slug}`;
            const facts = senator
              ? "Historic bed & breakfast · Heber City"
              : property.stats.slice(0, 3).map((stat) => `${stat.value} ${stat.label}`).join(" · ");

            return (
              <article key={property.slug} className="group flex min-w-0 flex-col overflow-hidden rounded-[10px] border border-[#E7DFDB] bg-[#FFFCFB] shadow-[0_8px_26px_rgba(41,29,22,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#A9B9A9] hover:shadow-[0_16px_36px_rgba(41,29,22,0.09)]">
                <a href={href} {...(senator ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="block" aria-label={`Check availability for ${property.hero.title}`}>
                  <div className="relative aspect-[1.55] overflow-hidden bg-[#F4EFEC] sm:aspect-[1.45]">
                    <Image src={property.hero.image.src} alt={property.hero.image.alt} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                  </div>
                </a>
                <div className="flex flex-1 flex-col px-4 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
                  <p className="font-body text-[12px] leading-5 text-[#8F7E73]">{property.hero.locationLabel.replace(", Utah", "")}</p>
                  <h3 className="mt-0.5 font-heading text-[26px] font-medium leading-[1.15] tracking-[-0.04em] text-[#1F3125] md:text-[29px]">
                    <a href={href} {...(senator ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{property.hero.title}</a>
                  </h3>
                  <p className="mt-2 font-body text-[13px] leading-5 text-[#6D6057] md:text-[14px]">{facts}</p>
                  <a href={href} {...(senator ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mt-5 inline-flex min-h-11 w-full items-center justify-between rounded-[5px] bg-[#4A6E57] px-5 font-body text-[13px] font-medium text-white transition-colors hover:bg-[#3C6049] md:mt-6 md:text-[14px]">
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
