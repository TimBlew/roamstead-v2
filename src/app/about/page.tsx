import type { Metadata } from "next";
import Image from "next/image";
import { CommunityCTA } from "@/components/sections/CommunityCTA";

export const metadata: Metadata = {
  title: "About | Roamstead",
  description:
    "Roamstead is a growing collection of places to stay in Heber Valley and the surrounding mountains, built for shared stoke, real connection, and four-season living.",
};

const story = [
  "Something has been lost along the way.",
  "Places that once felt open (trails, powder stashes, gathering spots) are being fenced off or packaged for display. Homesteading used to mean building something together. Now it often means private acreage and polished distance.",
  "We remember a different version. Strangers who became friends on a chairlift. A local who showed you a line that changed how you ride. Long nights around a fire where stories turned into plans.",
  "Roamstead was built in response to that memory. Not as a hotel chain. Not as an exclusive retreat. But as a collective: places designed for shared stoke, real connection, and four-season living.",
  "This is our way of giving the mountains back to the people who love them.",
];

const values = [
  {
    image: "/images/about/community-first.jpg",
    alt: "Three friends in winter gear and helmets in the snow",
    title: "Community first",
    description:
      "We design spaces that encourage gathering: around a table, a fire, or a shared plan for tomorrow. The best stays leave room for people.",
  },
  {
    image: "/images/about/four-season-living.jpg",
    alt: "A mountain biker riding a ridge trail through golden grass",
    title: "Four-season living",
    description:
      "We’re here for winter powder and summer singletrack. Mud season. Quiet weeks. Full parking lots and empty trails. The whole year matters.",
  },
  {
    image: "/images/about/local-by-nature.jpg",
    alt: "A person on a frozen lake below snowy peaks",
    title: "Local by nature",
    description:
      "Roamstead stays are shaped by their surroundings and the people who live there. We pay attention to the rhythms of the valley, not outside expectations.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="flex w-full flex-col items-center gap-6 bg-[#FFFCFB] px-6 py-16">
        <div className="inline-flex h-[34px] items-center justify-center border border-[#D8CCC4] px-6 py-2">
          <p className="font-body text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-[#1F3125]">
            About Roamstead Collective
          </p>
        </div>

        <h1
          className="w-full max-w-[720px] text-center font-heading text-[44px] font-medium leading-[48px] tracking-[-1.76px] text-[#1F3125] md:text-[64px] md:leading-[72px] md:tracking-[-2.56px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          We believe mountains are better when we share them
        </h1>

        <div className="w-full max-w-[720px] space-y-8 font-body text-[20px] font-normal leading-8 tracking-[-0.4px] text-[#6D6057]">
          {story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="flex w-full flex-col items-center gap-6 bg-[#FFFCFB] px-6 py-16">
        <h2
          className="w-full max-w-[816px] text-center font-heading text-[40px] font-medium leading-[44px] tracking-[-1.6px] text-[#1F3125] md:text-[48px] md:leading-[54px] md:tracking-[-1.92px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          What we care about
        </h2>

        <p className="w-full max-w-[816px] font-body text-[20px] font-normal leading-8 tracking-[-0.4px] text-[#6D6057]">
          Roamstead is a growing collection of places to stay in Heber Valley and the surrounding mountains. Each property is shaped by its setting, designed to feel intentional, welcoming, and easy to return to.
        </p>

        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-3 md:gap-4">
          {values.map((value) => (
            <div key={value.title} className="flex h-[452px] flex-col gap-4 md:h-[460px]">
              <div className="relative h-[320px] w-full overflow-hidden rounded-3">
                <Image src={value.image} alt={value.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <h3
                  className="font-heading text-[28px] font-medium leading-[36px] tracking-[-1.12px] text-[#1F3125] md:text-[36px] md:leading-[44px] md:tracking-[-1.44px]"
                  style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
                >
                  {value.title}
                </h3>
                <p className="font-body text-[16px] font-normal leading-6 tracking-[-0.32px] text-[#6D6057]">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CommunityCTA />
    </>
  );
}
