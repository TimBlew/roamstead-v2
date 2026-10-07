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
      {/* Hero */}
      <section className="container-figma flex flex-col items-center gap-3 py-8">
        <p className="border border-border-strong px-3 py-1 text-sm font-medium tracking-body text-brand-text">
          About Roamstead Collective
        </p>
        <h1 className="w-full max-w-content-medium text-left font-heading text-h1 font-medium tracking-display text-brand-text md:text-center">
          We believe mountains are better when we share them
        </h1>
        <div className="w-full max-w-content-medium space-y-[var(--text-xl-lh)] text-xl tracking-body text-text-secondary">
          {story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* What we care about */}
      <section className="container-figma flex flex-col items-center gap-3 py-8">
        <h2 className="w-full max-w-content-narrow text-center font-heading text-h2 font-medium tracking-display text-brand-text">
          What we care about
        </h2>
        <p className="w-full max-w-content-narrow text-xl tracking-body text-text-secondary">
          Roamstead is a growing collection of places to stay in Heber Valley and the surrounding
          mountains. Each property is shaped by its setting, designed to feel intentional, welcoming,
          and easy to return to.
        </p>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-2">
          {values.map((value) => (
            <div key={value.title} className="flex flex-col gap-2">
              <div className="relative h-value-card-image w-full overflow-hidden rounded-3">
                <Image
                  src={value.image}
                  alt={value.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-heading text-h4 font-medium tracking-display text-brand-text">
                  {value.title}
                </h3>
                <p className="text-md tracking-body text-text-secondary">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CommunityCTA />
    </>
  );
}
