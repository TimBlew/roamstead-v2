import Link from "next/link";
import Image from "next/image";
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
    <main className="min-h-[70vh] bg-[#FFFCFB]">
      <section className="bg-[#F4EFEC] px-4 pb-10 pt-7 md:px-8 md:pb-16 md:pt-12">
        <div className="mx-auto max-w-[1100px]">
          <Link href="/book#choose-your-stay" className="inline-flex items-center gap-2 font-body text-[13px] font-medium text-[#4A6E57] transition-colors hover:text-[#1F3125] md:text-[14px]">
            <span aria-hidden="true">←</span> All stays
          </Link>
          <div className="mt-6 flex items-center gap-3 rounded-[12px] border border-[#E1D7D1] bg-[#FFFCFB] p-2.5 sm:gap-4 md:mt-8 md:max-w-[720px] md:p-3">
            <div className="relative h-[66px] w-[88px] shrink-0 overflow-hidden rounded-[7px] bg-[#E7DFDB] sm:h-[82px] sm:w-[118px]">
              <Image src={property.hero.image.src} alt="" fill sizes="120px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-body text-[11px] font-medium uppercase tracking-[0.08em] text-[#8F7E73] md:text-[12px]">Your selected stay</p>
              <h1 className="mt-0.5 font-heading text-[25px] font-medium leading-tight tracking-[-0.04em] text-[#1F3125] sm:text-[30px]">{property.hero.title}</h1>
              <p className="mt-0.5 font-body text-[12px] text-[#6D6057] sm:text-[13px]">{property.hero.locationLabel.replace(", Utah", "")}</p>
            </div>
          </div>
          <div className="mt-8 md:mt-10">
            <p className="font-body text-[12px] font-medium uppercase tracking-[0.1em] text-[#4A6E57]">Book direct</p>
            <h2 className="mt-2 font-heading text-[35px] font-medium leading-[1.08] tracking-[-0.045em] text-[#1F3125] md:text-[49px]">Choose your dates</h2>
            <p className="mt-2 font-body text-[14px] leading-6 text-[#6D6057] md:text-[16px]">Select check-in and check-out to continue your reservation.</p>
          </div>
          <div className="mt-5 overflow-hidden rounded-[16px] border border-[#E1D7D1] bg-[#FFFCFB] px-3 py-5 shadow-[0_12px_32px_rgba(41,29,22,0.035)] sm:px-6 md:mt-7 md:px-8 md:py-8">
            <HostawayBooking listingId={listingId} fallbackUrl={property.bookingUrl} />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-body text-[12px] leading-5 text-[#8F7E73] md:text-[13px]">Secure checkout with our booking partner.</p>
            <Link href={`/properties/${slug}`} className="font-body text-[13px] font-medium text-[#4A6E57] underline underline-offset-4">
              Explore property details
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
