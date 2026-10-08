import Link from "next/link";
import { notFound } from "next/navigation";
import { HostawayBooking } from "@/components/booking/HostawayBooking";
import { getProperty } from "@/data/properties";

const listingIds: Record<string, number> = {
  "hygge-house": 455635,
  granary: 455631,
  daystar: 455634,
  lowell: 455632,
  "powder-room": 455633,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(listingIds).map((slug) => ({ slug }));
}

export default async function BookingPropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = getProperty(slug);
  const listingId = listingIds[slug];
  if (!property || !listingId) notFound();

  return (
    <main className="min-h-[65vh] bg-[#FFFCFB]">
      <section className="bg-[#F4EFEC] px-4 py-10 md:px-8 md:py-16">
        <div className="mx-auto max-w-[1050px]">
          <Link href="/book" className="font-body text-[14px] text-[#4A6E57] underline underline-offset-4">← All stays</Link>
          <p className="mt-7 font-body text-[13px] font-medium tracking-[0.08em] text-[#4A6E57]">BOOK DIRECT</p>
          <h1 className="mt-2 font-heading text-[42px] font-medium leading-tight tracking-[-0.04em] text-[#1F3125] md:text-[58px]">Find dates for {property.hero.title}</h1>
          <p className="mt-3 font-body text-[16px] leading-7 text-[#6D6057]">Choose your check-in and check-out dates to continue with your reservation.</p>
          <div className="mt-8 rounded-[18px] border border-[#E1D7D1] bg-[#FFFCFB] p-4 md:p-7">
            <HostawayBooking listingId={listingId} fallbackUrl={property.bookingUrl} />
          </div>
          <p className="mt-5 font-body text-[14px] leading-6 text-[#6D6057]">
            Want to learn more first? <Link href={`/properties/${slug}`} className="font-medium text-[#4A6E57] underline underline-offset-4">Explore {property.hero.title}</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
