import Image from "next/image";

export function SenatorBand({ campaign }: { campaign: "senator-band" | "properties-page" }) {
  const href = `https://hebersenator.com/?utm_source=roamstead-co&utm_medium=referral&utm_campaign=${campaign}`;
  return (
    <section className="bg-[#F4EFEC] px-2 pb-2 pt-3 sm:px-4 md:px-8 md:py-12">
      <div className="mx-auto grid max-w-[1360px] overflow-hidden rounded-[12px] bg-[#FFFCFB] md:rounded-[16px] md:grid-cols-[48%_52%]">
        <div className="relative min-h-[220px] sm:min-h-[260px] md:min-h-[390px]">
          <Image src="/images/senator-main.jpg" alt="The Heber Senator historic sandstone Victorian" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[center_42%]" />
        </div>
        <div className="flex flex-col justify-center px-5 pb-4 pt-3 sm:px-9 sm:py-8 md:px-10 md:py-8 lg:px-12">
          <p className="font-body text-[13px] font-medium leading-5 tracking-[0.015em] text-[#4A6E57]">Our centerpiece in Heber City</p>
          <h2 className="mt-2 max-w-[590px] font-heading text-[33px] font-medium leading-[1.1] tracking-[-0.04em] text-[#1F3125] [text-wrap:balance] sm:text-[42px] md:text-[clamp(38px,3.5vw,52px)]">Old bones, new comforts</h2>
          <p className="mt-2.5 max-w-[340px] font-body text-[15px] leading-[1.6] tracking-[-0.15px] text-[#6D6057] [text-wrap:pretty] sm:max-w-[460px] sm:text-[16px] md:max-w-[570px] md:text-[17px] md:tracking-normal">A historic red sandstone Victorian with rooms you book one at a time. Breakfast's on us.</p>
          <div className="mt-3.5 flex items-center border-l-[3px] border-[#4A6E57] py-0.5 pl-4"><div><p className="font-body text-[11px] font-semibold uppercase tracking-[0.13em] text-[#4A6E57]">3-time Best of State</p><p className="mt-1 font-body text-[14px] font-medium tracking-[-0.01em] text-[#1F3125]">2024 · 2025 · 2026</p></div></div>
          <div className="mt-4 flex w-full flex-col items-center sm:w-fit">
            <a href={href} target="_blank" rel="noopener noreferrer" className="group/cta inline-flex h-[46px] w-full min-w-0 items-center justify-center gap-[10px] whitespace-nowrap rounded-[8px] bg-[#4A6E57] px-[22px] font-body text-[15px] font-semibold text-white shadow-[0_5px_14px_rgba(31,49,37,0.13)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-[1px] hover:bg-[#3F624C] hover:shadow-[0_7px_17px_rgba(31,49,37,0.17)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] sm:w-[235px]"><span>Stay at the Senator</span><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-[15px] w-[15px] shrink-0 transition-transform duration-300 group-hover/cta:translate-x-[3px]"><path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
            <p className="mt-1.5 text-center font-body text-[12px] leading-5 text-[#6D6057]">Books on hebersenator.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}
