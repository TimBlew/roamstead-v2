import Image from "next/image";

export function SenatorBand({ campaign }: { campaign: "senator-band" | "properties-page" }) {
  const href = `https://hebersenator.com/?utm_source=roamstead-co&utm_medium=referral&utm_campaign=${campaign}`;
  return (
    <section className="bg-[#F4EFEC] px-2 py-6 sm:px-4 md:px-8 md:py-12">
      <div className="mx-auto grid max-w-[1360px] overflow-hidden rounded-[12px] bg-[#FFFCFB] md:rounded-[16px] md:grid-cols-[48%_52%]">
        <div className="relative min-h-[220px] sm:min-h-[260px] md:min-h-[390px]">
          <Image src="/images/senator-main.jpg" alt="The Heber Senator historic sandstone Victorian" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[center_42%]" />
        </div>
        <div className="flex flex-col justify-center px-5 py-6 sm:px-9 sm:py-8 md:px-10 md:py-8 lg:px-12">
          <p className="font-body text-[13px] font-medium leading-5 tracking-[0.015em] text-[#4A6E57]">Our centerpiece in Heber City</p>
          <h2 className="mt-2 max-w-[590px] font-heading text-[33px] font-medium leading-[1.1] tracking-[-0.04em] text-[#1F3125] [text-wrap:balance] sm:text-[42px] md:text-[clamp(38px,3.5vw,52px)]">Old bones, new comforts</h2>
          <p className="mt-2.5 max-w-[570px] font-body text-[16px] leading-[1.6] text-[#6D6057] [text-wrap:pretty] md:text-[17px]">A historic red sandstone Victorian with rooms you book one at a time. Breakfast's on us.</p>
          <div className="mt-3.5 flex items-center border-l-[3px] border-[#4A6E57] py-0.5 pl-4"><div><p className="font-body text-[11px] font-semibold uppercase tracking-[0.13em] text-[#4A6E57]">3-time Best of State</p><p className="mt-1 font-body text-[14px] font-medium tracking-[-0.01em] text-[#1F3125]">2024 · 2025 · 2026</p></div></div>
          <div className="mt-4 flex w-full flex-col items-center sm:w-fit">
            <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 w-full min-w-0 sm:w-auto sm:min-w-[210px] items-center justify-center gap-2 whitespace-nowrap rounded-[7px] bg-[#4A6E57] px-6 font-body text-[15px] font-medium text-white transition-colors hover:bg-[#3C6049] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57]">Stay at the Senator →</a>
            <p className="mt-1.5 text-center font-body text-[12px] leading-5 text-[#6D6057]">Books on hebersenator.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}
