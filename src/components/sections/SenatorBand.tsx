import Image from "next/image";

export function SenatorBand({ campaign }: { campaign: "senator-band" | "properties-page" }) {
  const href = `https://hebersenator.com/?utm_source=roamstead-co&utm_medium=referral&utm_campaign=${campaign}`;
  return (
    <section className="bg-[#F4EFEC] px-5 py-10 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-[1440px] overflow-hidden rounded-[16px] bg-[#FFFCFB] md:grid-cols-2">
        <div className="relative min-h-[260px] md:min-h-[440px]">
          <Image src="/images/senator-main.jpg" alt="The Heber Senator historic sandstone Victorian" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center px-6 py-9 md:px-12 md:py-14">
          <p className="font-body text-[13px] font-medium text-[#4A6E57]">Our centerpiece in Heber City</p>
          <h2 className="mt-3 font-heading text-[36px] leading-[1.08] tracking-[-0.04em] text-[#1F3125] md:text-[52px]">Old bones, new comforts</h2>
          <p className="mt-5 font-body text-[17px] leading-7 text-[#6D6057]">A historic red sandstone Victorian with rooms you book one at a time. Breakfast's on us.</p>
          <p className="mt-5 w-fit rounded-full border border-[#C7B9AC] px-4 py-2 font-body text-[13px] text-[#4A6E57]">3-time Best of State · 2024, 2025, 2026</p>
          <a href={href} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex w-fit items-center rounded-[7px] bg-[#4A6E57] px-6 py-3 font-body font-medium text-white hover:bg-[#3C6049]">Stay at the Senator →</a>
          <p className="mt-2 font-body text-[12px] text-[#6D6057]">Books on hebersenator.com</p>
        </div>
      </div>
    </section>
  );
}
