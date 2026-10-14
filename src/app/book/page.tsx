import Image from "next/image";
import { properties } from "@/data/properties";

const order = ["hygge-house", "granary", "lowell", "powder-room"];

export const metadata = {
  alternates: { canonical: "/book" },
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
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <Image src="/images/book-direct-sunset.png" alt="Hygge House surrounded by trees beneath the mountains and warm sunset sky in Midway, Utah" fill unoptimized priority sizes="100vw" className="object-cover object-bottom" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#F4EFEC_0%,rgba(244,239,236,0.98)_18%,rgba(244,239,236,0.88)_30%,rgba(244,239,236,0.72)_43%,transparent_55%)]" />
        </div>
        <div className="mx-auto grid w-full items-stretch lg:min-h-[clamp(620px,40.2vw,772px)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="relative z-10 flex flex-col justify-center px-5 pb-9 pt-12 sm:px-10 lg:py-[80px] lg:pl-[clamp(88px,8.5vw,160px)] lg:pr-[32px]">
            <p className="font-body text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-[#4A6E57] md:text-[16px] lg:tracking-[0.14em]">Book direct with Roamstead</p>
            <h1 className="mt-[14px] max-w-[650px] text-balance font-heading text-[40px] font-medium leading-[1.09] tracking-[-0.04em] text-[#1F3125] md:mt-[20px] md:text-[clamp(46px,5.4vw,55px)] md:leading-[1.09] lg:max-w-[600px] lg:text-[clamp(46px,3.2vw,61px)] lg:leading-[1.075] lg:tracking-[-0.043em]">
              Your mountain stay<br className="hidden lg:block" /> is waiting
            </h1>
            <p className="mt-[20px] max-w-[490px] font-body text-[15px] font-medium leading-[1.62] tracking-[-0.13px] text-[#62584F] sm:text-[16px] md:mt-[24px] md:font-normal md:leading-[1.6] lg:max-w-[505px] lg:text-[18px]">
              Thoughtfully chosen places to settle in and stay awhile. Explore the collection, choose your dates, and book directly.
            </p>
            <div className="mt-[20px] flex justify-center md:mt-[30px] md:justify-start">
              <a href="#choose-your-stay" className="inline-flex h-[48px] w-[230px] items-center justify-center rounded-[8px] bg-[#4A6E57] px-[26px] font-body text-[15px] font-semibold leading-none tracking-[-0.2px] text-[#FFFCFB] shadow-[0_4px_12px_rgba(31,49,37,0.10)] transition-[background-color,box-shadow] duration-200 hover:bg-[#3D604B] hover:shadow-[0_6px_16px_rgba(31,49,37,0.13)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#1F3125] md:h-[50px] md:w-auto md:min-w-[176px] md:text-[16px]">
                Choose your stay
              </a>
            </div>
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4EFEC] sm:aspect-[4/3] lg:hidden">
            <Image src="https://d2ol7oe51mr4n9.cloudfront.net/user_3JhtTKjJmo2R3mPhsBJElt2FRYV/357bad24-b2c4-437e-80dd-decc76988428.png" alt="Aerial view of Hygge House and the surrounding mountains in Midway, Utah" fill unoptimized priority sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover object-center saturate-[0.92] contrast-[0.96] brightness-[1.015]" />
            <div className="pointer-events-none absolute inset-y-0 -left-px hidden w-[32%] bg-gradient-to-r from-[#F4EFEC] via-[#F4EFEC]/60 to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#F4EFEC] to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      <section id="choose-your-stay" className="scroll-mt-16 mx-auto max-w-[1280px] px-4 pb-[56px] pt-[40px] md:px-8 md:pb-[80px] md:pt-[52px]">
        <div className="mb-[24px] md:mb-[32px]">
          <p className="font-body text-[12px] font-medium uppercase tracking-[0.1em] text-[#4A6E57] md:text-[13px]">Choose your property</p>
          <h2 className="mt-2 font-heading text-[32px] font-medium leading-[1.1] tracking-[-0.04em] text-[#1F3125] md:text-[44px]">
            Find your kind of getaway.
          </h2>
          <p className="mt-2 font-body text-[14px] leading-6 text-[#6D6057] md:text-[16px]">
            Explore the collection and select your stay to see available dates.
          </p>
        </div>

        <div className="mx-auto grid gap-[20px] sm:grid-cols-2 md:gap-x-[28px] md:gap-y-[32px] lg:max-w-[1180px] lg:gap-x-[32px] lg:gap-y-[34px]">
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
                  <div className="relative aspect-[1.55] overflow-hidden bg-[#F4EFEC] sm:aspect-[1.5] lg:aspect-[1.78]">
                    <Image src={property.slug === "powder-room" ? "/images/powder-room/bedroom.jpg" : property.slug === "hygge-house" ? "https://d2ol7oe51mr4n9.cloudfront.net/user_3JhtTKjJmo2R3mPhsBJElt2FRYV/8d444f85-ede6-407c-ae17-93e38999bdff.jpg" : property.hero.image.src} alt={property.slug === "powder-room" ? "Powder Room studio bedroom and seating" : property.slug === "hygge-house" ? "Front exterior of Hygge House in Midway, Utah" : property.hero.image.alt} fill unoptimized={property.slug === "hygge-house"} sizes="(min-width: 1280px) 575px, (min-width: 1024px) 48vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                  </div>
                </a>
                <div className="flex flex-1 flex-col px-[20px] pb-[20px] pt-[18px] md:px-[24px] md:pb-[24px] md:pt-[22px] lg:px-[28px] lg:pb-[26px] lg:pt-[23px]">
                  <p className="font-body text-[12px] leading-5 text-[#8F7E73] lg:text-[13px]">{property.hero.locationLabel.replace(", Utah", "")}</p>
                  <h3 className="mt-0.5 font-heading text-[26px] font-medium leading-[1.15] tracking-[-0.04em] text-[#1F3125] md:text-[29px] lg:text-[32px]">
                    <a href={href} {...(senator ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{property.hero.title}</a>
                  </h3>
                  <p className="mb-[20px] mt-[10px] font-body text-[13px] leading-5 text-[#6D6057] md:text-[14px] lg:text-[15px]">{facts}</p>
                  <a href={href} {...(senator ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mt-auto inline-flex min-h-[44px] w-full items-center justify-between rounded-[8px] bg-[#4A6E57] px-5 py-[11px] font-body text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(31,49,37,0.10)] transition-[background-color,box-shadow] duration-200 hover:bg-[#3C6049] hover:shadow-[0_6px_16px_rgba(31,49,37,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] md:min-h-[48px] md:text-[14px] lg:min-h-[50px] lg:text-[15px]">
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
