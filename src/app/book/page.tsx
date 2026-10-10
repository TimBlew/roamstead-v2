import Image from "next/image";
import { properties } from "@/data/properties";

const order = ["hygge-house", "granary", "daystar", "lowell", "powder-room", "senator"];

export const metadata = {
  title: "Book direct | Roamstead",
  description: "Choose a Roamstead stay, check your dates, and book direct.",
};

export default function BookPage() {
  const stays = order.flatMap((slug) => {
    const property = properties.find((item) => item.slug === slug);
    return property ? [property] : [];
  });

  return (
    <div className="bg-[#FFFCFB]">
      <section className="relative overflow-hidden bg-[#F4EFEC]">
        <div className="mx-auto grid w-full items-stretch lg:min-h-[540px] lg:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)]">
          <div className="relative z-10 flex flex-col justify-center px-5 pb-9 pt-12 sm:px-10 lg:px-14 lg:py-20 xl:pl-20">
            <p className="font-body text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-[#4A6E57] md:text-[16px] lg:tracking-[0.14em]">Book direct with Roamstead</p>
            <h1 className="mt-3 max-w-[670px] font-heading text-[40px] font-medium leading-[1.08] tracking-[-0.04em] text-[#1F3125] md:mt-5 md:text-[54px] md:tracking-[-0.04em] lg:text-[clamp(43px,3.1vw,60px)] lg:leading-[1.06] lg:tracking-[-0.045em]">
              Your mountain stay<br className="hidden lg:block" /> is waiting
            </h1>
            <p className="mt-5 max-w-[510px] font-body text-[16px] leading-[1.65] text-[#6D6057] lg:text-[18px]">
              Thoughtfully chosen places to settle in and stay awhile. Explore the collection, choose your dates, and book directly.
            </p>
            <div className="mt-7">
              <a href="#choose-your-stay" className="inline-flex min-h-12 items-center justify-center rounded-[6px] bg-[#4A6E57] px-8 font-body text-[14px] font-medium text-[#FFFCFB] shadow-[0_8px_20px_rgba(31,49,37,0.12)] transition-colors hover:bg-[#3C6049] md:text-[15px]">
                Choose your stay
              </a>
            </div>
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[4/3] lg:aspect-auto lg:min-h-full">
            <Image src="https://d2ol7oe51mr4n9.cloudfront.net/user_3JhtTKjJmo2R3mPhsBJElt2FRYV/357bad24-b2c4-437e-80dd-decc76988428.png" alt="Aerial view of Hygge House and the surrounding mountains in Midway, Utah" fill unoptimized priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-contain object-center saturate-[0.92] contrast-[0.96] brightness-[1.015] lg:object-cover lg:object-[center_62%]" />
            <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#F4EFEC] via-[#F4EFEC]/30 via-[22%] to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#F4EFEC] to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      <section id="choose-your-stay" className="scroll-mt-16 mx-auto max-w-[1280px] px-4 pb-14 pt-10 md:px-8 md:pb-20 md:pt-16">
        <div className="mb-5 md:mb-8">
          <p className="font-body text-[12px] font-medium uppercase tracking-[0.1em] text-[#4A6E57] md:text-[13px]">Choose your property</p>
          <h2 className="mt-2 font-heading text-[32px] font-medium leading-[1.1] tracking-[-0.04em] text-[#1F3125] md:text-[44px]">
            Find your kind of getaway.
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
              : property.slug === "powder-room"
                ? "Sleeps 4 · Studio · 1 Bath"
                : property.stats.slice(0, 3).map((stat) => stat.label.toLowerCase() === "sleeps" ? `Sleeps ${stat.value}` : `${stat.value} ${stat.label}`).join(" · ");

            return (
              <article key={property.slug} className="group flex min-w-0 flex-col overflow-hidden rounded-[10px] border border-[#E7DFDB] bg-[#FFFCFB] shadow-[0_8px_26px_rgba(41,29,22,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#A9B9A9] hover:shadow-[0_16px_36px_rgba(41,29,22,0.09)]">
                <a href={href} {...(senator ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="block" aria-label={`Check availability for ${property.hero.title}`}>
                  <div className="relative aspect-[1.55] overflow-hidden bg-[#F4EFEC] sm:aspect-[1.45]">
                    <Image src={property.slug === "powder-room" ? "/images/powder-room/bedroom.jpg" : property.slug === "hygge-house" ? "https://d2ol7oe51mr4n9.cloudfront.net/user_3JhtTKjJmo2R3mPhsBJElt2FRYV/8d444f85-ede6-407c-ae17-93e38999bdff.jpg" : property.hero.image.src} alt={property.slug === "powder-room" ? "Powder Room studio bedroom and seating" : property.slug === "hygge-house" ? "Front exterior of Hygge House in Midway, Utah" : property.hero.image.alt} fill unoptimized={property.slug === "hygge-house"} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                  </div>
                </a>
                <div className="flex flex-1 flex-col px-4 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
                  <p className="font-body text-[12px] leading-5 text-[#8F7E73]">{property.hero.locationLabel.replace(", Utah", "")}</p>
                  <h3 className="mt-0.5 font-heading text-[26px] font-medium leading-[1.15] tracking-[-0.04em] text-[#1F3125] md:text-[29px]">
                    <a href={href} {...(senator ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{property.hero.title}</a>
                  </h3>
                  <p className="mt-2 font-body text-[13px] leading-5 text-[#6D6057] md:text-[14px]">{facts}</p>
                  <a href={href} {...(senator ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mt-5 inline-flex min-h-11 w-full items-center justify-between rounded-[5px] bg-[#4A6E57] px-5 font-body text-[13px] font-medium text-white transition-colors hover:bg-[#3C6049] md:mt-6 md:text-[14px]">
                    Check dates <span aria-hidden="true" className="ml-2">→</span>
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
