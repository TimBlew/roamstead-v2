import Image from "next/image";
import { CommunityCTA } from "@/components/sections/CommunityCTA";
import { getProperty } from "@/data/properties";
import { getPlace, stayFacts, type Place, type PlaceStay } from "@/data/places";

const headingStyle = { fontVariationSettings: '"opsz" 14, "wdth" 100' } as const;

function ExploreIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[16px] w-[16px]">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function StayFeature({ stay, index }: { stay: PlaceStay; index: number }) {
  const property = getProperty(stay.slug);
  if (!property) return null;

  const detailHref = `/properties/${property.slug}`;
  const datesHref = `${detailHref}#availability`;
  const reversed = index % 2 === 1;

  return (
    <article
      id={property.slug}
      className="scroll-mt-[76px] grid overflow-hidden rounded-[18px] border border-[#E7DFDB] bg-[#FBF8F7] shadow-[0_14px_40px_rgba(41,29,22,0.045)] md:rounded-[24px] md:grid-cols-[0.96fr_1.04fr]"
    >
      <div className={`order-2 flex items-center px-5 py-6 sm:px-7 sm:py-8 md:p-10 lg:px-12 lg:py-12 ${reversed ? "md:order-2" : "md:order-1"}`}>
        <div className="w-full max-w-[520px]">
          <p className="font-body text-[12px] font-medium uppercase leading-5 tracking-[0.08em] text-[#8F7E73] md:text-[13px]">
            {property.hero.locationLabel}
          </p>
          <h3
            className="mt-2 font-heading text-[32px] font-medium leading-[1.05] tracking-[-0.04em] text-[#1F3125] md:text-[40px]"
            style={headingStyle}
          >
            <a href={detailHref} className="transition-colors hover:text-[#4A6E57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A6E57]">
              {property.hero.title}
            </a>
          </h3>
          <p className="mt-4 font-body text-[15px] leading-6 tracking-[-0.2px] text-[#5F534B] md:text-[17px] md:leading-[1.65]">
            {stay.summary}
          </p>
          <p className="mt-4 font-body text-[13px] leading-5 tracking-[-0.1px] text-[#6D6057] md:text-[15px]">
            {stayFacts(property)}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={detailHref}
              className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#D8CCC4] bg-[#FFFCFB] px-5 font-body text-[14px] font-semibold text-[#253329] shadow-[0_2px_7px_rgba(41,29,22,0.045)] transition-[border-color,background-color,box-shadow] duration-200 hover:border-[#8FA393] hover:bg-[#F4EFEC] hover:shadow-[0_4px_12px_rgba(41,29,22,0.07)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] sm:w-auto sm:min-w-[168px]"
            >
              Explore the stay
            </a>
            <a
              href={datesHref}
              className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#4A6E57] px-5 font-body text-[14px] font-semibold text-[#FFFCFB] shadow-[0_4px_12px_rgba(31,49,37,0.1)] transition-[background-color,box-shadow] duration-200 hover:bg-[#3C6049] hover:shadow-[0_6px_16px_rgba(31,49,37,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3125] sm:w-auto sm:min-w-[158px]"
            >
              Check dates
              <ExploreIcon />
            </a>
          </div>
        </div>
      </div>
      <a
        href={detailHref}
        aria-label={`Explore ${property.hero.title}`}
        className={`relative order-1 min-h-[230px] w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4A6E57] md:min-h-[420px] ${reversed ? "md:order-1" : "md:order-2"}`}
      >
        <Image
          src={stay.image.src}
          alt={stay.image.alt}
          fill
          sizes="(min-width: 768px) 52vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
        />
      </a>
    </article>
  );
}

export function PlacePage({ place }: { place: Place }) {
  const other = getPlace(place.otherSlug);

  return (
    <>
      <section className="relative overflow-hidden bg-[#F4EFEC]">
        <div className="mx-auto grid w-full items-stretch lg:min-h-[640px] lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
          <div className="relative z-10 order-2 flex flex-col justify-center px-5 pb-10 pt-8 md:px-10 md:pb-14 md:pt-12 lg:order-1 lg:py-[72px] lg:pl-[clamp(72px,7.5vw,140px)] lg:pr-12">
            <div className="max-w-[640px]">
              <p className="font-body text-[13px] font-semibold uppercase leading-5 tracking-[0.14em] text-[#4A6E57] md:text-[15px]">
                {place.eyebrow}
              </p>
              <h1
                className="mt-3 font-heading text-[64px] font-medium leading-[0.92] tracking-[-0.05em] text-[#1F3125] md:text-[92px] lg:text-[104px]"
                style={headingStyle}
              >
                {place.title}
              </h1>
              <p
                className="mt-4 max-w-[16ch] font-heading text-[26px] font-medium leading-[1.15] tracking-[-0.035em] text-[#365A43] md:mt-5 md:text-[32px]"
                style={headingStyle}
              >
                {place.deck}
              </p>
              <p className="mt-5 max-w-[460px] font-body text-[16px] leading-[1.6] tracking-[-0.16px] text-[#62584F] md:text-[18px] md:leading-[1.55]">
                {place.lede}
              </p>
              <a
                href="#stays"
                className="mt-7 inline-flex h-[48px] w-fit items-center justify-center rounded-[8px] border border-[#D8CCC4] bg-[#FFFCFB] px-6 font-body text-[15px] font-semibold text-[#253329] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_5px_rgba(9,22,16,0.06)] transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-[1px] hover:border-[#B6C5B9] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] md:mt-8"
              >
                See the homes
              </a>
            </div>
          </div>
          <div className="relative order-1 min-h-[280px] w-full md:min-h-[420px] lg:order-2 lg:min-h-full">
            <Image
              src={place.hero.src}
              alt={place.hero.alt}
              fill
              priority
              quality={85}
              sizes="(min-width: 1024px) 52vw, 100vw"
              className={place.hero.className}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[46%] bg-gradient-to-r from-[#F4EFEC] via-[#F4EFEC]/50 to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F4EFEC] to-transparent lg:hidden" />
            <p className="absolute bottom-4 right-4 max-w-[70%] rounded-[6px] bg-[#1F3125]/55 px-2.5 py-1.5 text-right font-body text-[12px] font-medium leading-4 text-[#FFFCFB] backdrop-blur-[4px] md:bottom-5 md:right-5 md:text-[13px]">
              {place.hero.caption}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#FFFCFB] px-5 pb-2 pt-10 md:px-8 md:pb-4 md:pt-16 lg:px-12">
        <div className="mx-auto grid max-w-[1280px] gap-6 md:grid-cols-2 md:gap-x-14 md:gap-y-0 lg:gap-x-20">
          {place.essay.map((paragraph) => (
            <p key={paragraph} className="font-body text-[16px] leading-[1.65] tracking-[-0.2px] text-[#5F534B] md:text-[18px] md:leading-[1.7]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section id="stays" className="scroll-mt-[72px] bg-[#FFFCFB] px-4 pb-12 pt-10 md:px-8 md:pb-20 md:pt-14 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-6 max-w-[640px] md:mb-8">
            <p className="font-body text-[13px] font-medium uppercase leading-[18px] tracking-[0.08em] text-[#8F7E73]">The homes</p>
            <h2
              className="mt-2 font-heading text-[32px] font-medium leading-[1.1] tracking-[-0.04em] text-[#1F3125] md:text-[46px]"
              style={headingStyle}
            >
              {place.staysHeading}
            </h2>
            <p className="mt-3 font-body text-[15px] leading-6 text-[#6D6057] md:text-[17px] md:leading-7">{place.staysIntro}</p>
          </div>
          <div className="space-y-6 md:space-y-10">
            {place.stays.map((stay, index) => (
              <StayFeature key={stay.slug} stay={stay} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F4EFEC] px-4 py-10 md:px-8 md:py-16 lg:px-12">
        <div className="mx-auto grid max-w-[1280px] items-center gap-6 md:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] md:gap-12 lg:gap-16">
          <a
            href={other.path}
            className="relative block aspect-[16/10] overflow-hidden rounded-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A6E57] md:rounded-[20px]"
          >
            <Image
              src={other.hero.src}
              alt={other.hero.alt}
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className={`${other.hero.className} transition-transform duration-700 ease-out hover:scale-[1.02]`}
            />
          </a>
          <div className="max-w-[520px]">
            <p className="font-body text-[13px] font-medium uppercase leading-[18px] tracking-[0.08em] text-[#8F7E73]">Also in the collection</p>
            <h2
              className="mt-2 font-heading text-[36px] font-medium leading-[1.05] tracking-[-0.045em] text-[#1F3125] md:text-[52px]"
              style={headingStyle}
            >
              {place.other.title}
            </h2>
            <p className="mt-3 font-body text-[16px] leading-7 text-[#5F534B] md:text-[18px]">{place.other.body}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={other.path}
                className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#4A6E57] px-5 font-body text-[14px] font-semibold text-[#FFFCFB] shadow-[0_4px_12px_rgba(31,49,37,0.1)] transition-[background-color,box-shadow] duration-200 hover:bg-[#3C6049] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3125] sm:w-auto sm:min-w-[160px]"
              >
                {place.other.cta}
                <ExploreIcon />
              </a>
              <a
                href="/properties"
                className="inline-flex h-[48px] w-full items-center justify-center rounded-[8px] border border-[#D8CCC4] bg-[#FFFCFB] px-5 font-body text-[14px] font-semibold text-[#253329] transition-[border-color,background-color] duration-200 hover:border-[#8FA393] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] sm:w-auto sm:min-w-[140px]"
              >
                All stays
              </a>
            </div>
          </div>
        </div>
      </section>

      <CommunityCTA />
    </>
  );
}
