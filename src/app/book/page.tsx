import Image from "next/image";
import { properties } from "@/data/properties";

const order = ["hygge-house", "granary", "daystar", "lowell", "powder-room", "senator"];

export const metadata = {
  title: "Book Direct | Roamstead",
  description: "Choose your Roamstead mountain stay and check available dates.",
};

export default function BookPage() {
  const stays = order.flatMap((slug) => {
    const property = properties.find((item) => item.slug === slug);
    return property ? [property] : [];
  });

  return (
    <div className="bg-[#FFFCFB]">
      <section className="bg-[#F4EFEC] px-5 py-12 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-body text-[13px] font-medium tracking-[0.08em] text-[#4A6E57]">BOOK DIRECT</p>
          <h1 className="mt-3 max-w-[780px] font-heading text-[42px] font-medium leading-[1.06] tracking-[-0.045em] text-[#1F3125] md:text-[66px]">Your next stay starts here</h1>
          <p className="mt-5 max-w-[640px] font-body text-[16px] leading-7 text-[#6D6057] md:text-[19px]">
            Pick your stay, find your dates, and book direct. The mountains are waiting.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[1280px] px-4 py-8 md:px-8 md:py-14">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {stays.map((property) => {
            const senator = property.slug === "senator";
            const href = senator ? property.bookingUrl : `/properties/${property.slug}#availability`;
            return (
              <article key={property.slug} className="flex flex-col overflow-hidden rounded-[14px] border border-[#E7DFDB] bg-[#FBF8F7]">
                <a href={`/properties/${property.slug}`} className="relative block aspect-[1.5] overflow-hidden">
                  <Image src={property.hero.image.src} alt={property.hero.image.alt} fill sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 hover:scale-[1.025]" />
                </a>
                <div className="flex flex-1 flex-col px-4 pb-5 pt-4 md:px-5">
                  <p className="font-body text-[13px] text-[#8F7E73]">{property.hero.locationLabel.replace(", Utah", "")}</p>
                  <h2 className="mt-1 font-heading text-[30px] font-medium leading-tight tracking-[-0.04em] text-[#1F3125]">{property.hero.title}</h2>
                  <p className="mt-2 font-body text-[14px] leading-6 text-[#6D6057]">
                    {senator ? "Historic bed & breakfast in Heber City." : property.stats.slice(0, 3).map((stat) => `${stat.value} ${stat.label}`).join(" · ")}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-5">
                    <a href={href} {...(senator ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex min-h-10 items-center justify-center bg-[#4A6E57] px-5 font-body text-[14px] font-medium text-white transition-colors hover:bg-[#3C6049]">
                      {senator ? "Book direct" : "See available dates"}
                    </a>
                    <a href={`/properties/${property.slug}`} className="font-body text-[13px] font-medium text-[#4A6E57] underline underline-offset-4">Explore the stay</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
