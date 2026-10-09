import Image from "next/image";

export function SenatorBand({ campaign }: { campaign: "senator-band" | "properties-page" }) {
  const href = `https://hebersenator.com/?utm_source=roamstead-co&utm_medium=referral&utm_campaign=${campaign}`;
  return (
    <section className="bg-[#F4EFEC] px-4 py-7 md:px-8 md:py-16">
      <div className="mx-auto grid max-w-[1440px] overflow-hidden rounded-[14px] bg-[#FFFCFB] md:grid-cols-2">
        <div className="relative min-h-[230px] md:min-h-[410px]">
          <Image src="/images/senator-main.jpg" alt="The Heber Senator historic sandstone Victorian" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[center_42%]" />
        </div>
        <div className="flex flex-col justify-center px-6 py-7 sm:px-8 md:px-10 md:py-10">
          <p className="font-body text-[13px] font-medium tracking-[0.02em] text-[#4A6E57]">Our centerpiece in Heber City</p>
          <h2 className="mt-2 font-heading text-[36px] leading-[1.08] tracking-[-0.04em] text-[#1F3125] md:text-[52px]">Old bones, new comforts</h2>
          <p className="mt-3 max-w-[520px] font-body text-[16px] leading-[1.55] text-[#6D6057]">A historic red sandstone Victorian with rooms you book one at a time. Breakfast's on us.</p>
          <div className="mt-5 flex items-center gap-3 border-l-[3px] border-[#4A6E57] pl-4"><div><p className="font-body text-[11px] font-semibold uppercase tracking-[0.13em] text-[#4A6E57]">3-time Best of State</p><p className="mt-1 font-body text-[14px] font-medium tracking-[-0.01em] text-[#1F3125]">2024 · 2025 · 2026</p></div></div>
          <a href={href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 w-fit items-center justify-center whitespace-nowrap rounded-[7px] bg-[#4A6E57] px-6 font-body text-[15px] font-medium text-white hover:bg-[#3C6049]">Stay at the Senator →</a>
          <p className="mt-2 font-body text-[12px] text-[#6D6057]">Books on hebersenator.com</p>
        </div>
      </div>
    </section>
  );
}
