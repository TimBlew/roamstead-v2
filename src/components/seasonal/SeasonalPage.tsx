import Image from "next/image";
import { RoamsteadBooking } from "@/components/booking/RoamsteadBooking";
import { getProperty } from "@/data/properties";
import type { SeasonalPageData } from "@/data/seasonal-pages";
import { jsonLdString, seasonalPageJsonLd } from "@/lib/structured-data";

const headingClass = "font-heading text-[32px] font-medium leading-[1.1] tracking-[-0.04em] text-[#1F3125] md:text-[46px]";
const buttonClass = "mt-6 inline-flex min-h-[48px] items-center justify-center rounded-[8px] bg-[#4A6E57] px-5 py-3 font-body text-[14px] font-semibold text-[#FFFCFB] hover:bg-[#3C6049] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3125]";

function Paragraph({ text }: { text: string }) {
  return <p className="mt-4 font-body text-[16px] leading-[1.7] text-[#4E433C] md:text-[18px]">{text.split(/(The Lowell)/).map((part, index) => part === "The Lowell" ? <a key={index} href="/properties/lowell" className="text-[#4A6E57] underline underline-offset-4">{part}</a> : part)}</p>;
}

export function SeasonalPage({ page }: { page: SeasonalPageData }) {
  return (
    <article className="bg-[#FFFCFB]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(seasonalPageJsonLd(page)) }} />
      <section className="bg-[#F4EFEC] px-5 py-12 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1180px] items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <a href={page.townPath} className="font-body text-[13px] uppercase tracking-[0.08em] text-[#8F7E73] underline-offset-4 hover:underline">{page.town}, Utah</a>
            <h1 className="mt-4 font-heading text-[40px] font-medium leading-[1.05] tracking-[-0.04em] text-[#1F3125] md:text-[56px]">{page.heading}</h1>
            <Paragraph text={page.intro} />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] md:rounded-[24px]">
            <Image src={page.image} alt={getProperty(page.slugs[0])?.hero.image.alt ?? page.town} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-[1180px] space-y-12 px-5 py-12 md:space-y-16 md:px-8 md:py-16">
        {page.sections.map((section, index) => (
          <section key={section.heading ?? index} aria-label={section.heading ?? "Powder Room dates"}>
            {section.heading && <h2 className={headingClass}>{section.heading}</h2>}
            <div className="max-w-[800px]">{section.paragraphs?.map(text => <Paragraph key={text} text={text} />)}</div>
            {section.listingId && section.slug && <div className="mt-6"><RoamsteadBooking listingId={section.listingId} propertySlug={section.slug} /></div>}
            {section.cta && <a className={buttonClass} href={`/properties/${section.slug}`}>{section.cta}</a>}
          </section>
        ))}
        {page.faq && <section aria-label="Frequently asked questions" className="space-y-8 border-t border-[#8F7E73]/30 pt-10">
          {page.faq.map(item => <div key={item.question}><h2 className="font-heading text-[26px] text-[#1F3125]">{item.question}</h2><Paragraph text={item.answer} /></div>)}
        </section>}
      </div>
    </article>
  );
}
