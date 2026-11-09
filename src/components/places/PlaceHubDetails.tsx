import { getProperty } from "@/data/properties";
import type { Place, PlaceComparisonStay, PlaceLodgingNote, PlacePlanningBlock } from "@/data/places";

const headingStyle = { fontVariationSettings: '"opsz" 14, "wdth" 100' } as const;

function ExploreIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[16px] w-[16px]">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function ComparisonStay({ stay }: { stay: PlaceComparisonStay }) {
  const property = getProperty(stay.slug);
  if (!property) return null;

  const href = `/properties/${property.slug}`;
  const datesHref = `${href}#availability`;

  return (
    <article className="flex h-full flex-col rounded-[18px] border border-[#E7DFDB] bg-[#FFFCFB] p-5 sm:p-7 md:rounded-[24px] md:p-8">
      <p className="font-body text-[12px] font-medium uppercase leading-5 tracking-[0.08em] text-[#8F7E73] md:text-[13px]">
        {stay.kind}
      </p>
      <h3
        className="mt-2 font-heading text-[32px] font-medium leading-[1.05] tracking-[-0.04em] text-[#1F3125] md:text-[40px]"
        style={headingStyle}
      >
        <a href={href} className="transition-colors hover:text-[#4A6E57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A6E57]">
          {property.hero.title}
        </a>
      </h3>
      <ul className="mt-4 space-y-2">
        {stay.points.map((point) => (
          <li key={point} className="flex items-start gap-2 font-body text-[15px] leading-6 text-[#5F534B] md:text-[16px] md:leading-7">
            <span aria-hidden="true" className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#4A6E57]" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col gap-3 sm:mt-auto sm:flex-row sm:items-center sm:pt-6">
        <a
          href={href}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[8px] border border-[#D8CCC4] bg-[#FFFCFB] px-5 py-3 text-center font-body text-[14px] font-semibold text-[#253329] transition-[border-color,background-color] duration-200 hover:border-[#8FA393] hover:bg-[#F4EFEC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] sm:w-auto sm:min-w-[168px]"
        >
          Explore {property.hero.title}
        </a>
        <a
          href={datesHref}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#4A6E57] px-5 py-3 text-center font-body text-[14px] font-semibold text-[#FFFCFB] transition-[background-color] duration-200 hover:bg-[#3C6049] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3125] sm:w-auto sm:min-w-[168px]"
        >
          Check dates
          <ExploreIcon />
        </a>
      </div>
    </article>
  );
}

function PlanningBlock({ block }: { block: PlacePlanningBlock }) {
  return (
    <article className="max-w-[640px]">
      <h3
        className="font-heading text-[28px] font-medium leading-[1.15] tracking-[-0.04em] text-[#1F3125] md:text-[34px]"
        style={headingStyle}
      >
        {block.title}
      </h3>
      <div className="mt-3 space-y-3">
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph} className="font-body text-[16px] leading-[1.65] text-[#5F534B] md:text-[17px] md:leading-[1.7]">
            {paragraph}
          </p>
        ))}
      </div>
      <a
        href={block.sourceHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex font-body text-[15px] font-semibold text-[#4A6E57] underline-offset-[3px] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A6E57]"
      >
        {block.sourceLabel} (official page)
      </a>
    </article>
  );
}

function LodgingNote({ note }: { note: PlaceLodgingNote }) {
  return (
    <article>
      <h3
        className="font-heading text-[28px] font-medium leading-[1.15] tracking-[-0.04em] text-[#1F3125] md:text-[34px]"
        style={headingStyle}
      >
        {note.heading}
      </h3>
      <p className="mt-3 font-body text-[16px] leading-[1.65] text-[#5F534B] md:text-[17px] md:leading-[1.7]">
        {note.body}
      </p>
    </article>
  );
}

export function PlaceHubDetails({ place }: { place: Place }) {
  if (!place.comparison && !place.planning && !place.lodgingNotes?.length) return null;

  return (
    <>
      {place.comparison ? (
        <section aria-labelledby="stay-comparison" className="bg-[#F4EFEC] px-4 py-10 md:px-8 md:py-16 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <p className="font-body text-[13px] font-medium uppercase leading-[18px] tracking-[0.08em] text-[#8F7E73]">Compare</p>
            <h2
              id="stay-comparison"
              className="mt-2 max-w-[640px] font-heading text-[32px] font-medium leading-[1.1] tracking-[-0.04em] text-[#1F3125] md:text-[46px]"
              style={headingStyle}
            >
              {place.comparison.heading}
            </h2>
            <p className="mt-4 max-w-[640px] font-body text-[16px] leading-[1.65] text-[#5F534B] md:text-[18px] md:leading-[1.7]">
              {place.comparison.intro}
            </p>
            <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-6">
              {place.comparison.stays.map((stay) => (
                <ComparisonStay key={stay.slug} stay={stay} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {place.planning ? (
        <section aria-labelledby="activity-planning" className="bg-[#FFFCFB] px-4 py-10 md:px-8 md:py-16 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <p className="font-body text-[13px] font-medium uppercase leading-[18px] tracking-[0.08em] text-[#8F7E73]">Activities</p>
            <h2
              id="activity-planning"
              className="mt-2 max-w-[640px] font-heading text-[32px] font-medium leading-[1.1] tracking-[-0.04em] text-[#1F3125] md:text-[46px]"
              style={headingStyle}
            >
              {place.planning.heading}
            </h2>
            <p className="mt-4 font-body text-[14px] leading-6 text-[#6D6057] md:text-[15px]">{place.planning.reviewed}</p>
            <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
              {place.planning.blocks.map((block) => (
                <PlanningBlock key={block.title} block={block} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {place.lodgingNotes?.length ? (
        <section aria-labelledby="lodging-notes" className="bg-[#FFFCFB] px-4 pb-4 pt-2 md:px-8 md:pb-8 lg:px-12">
          <div className="mx-auto max-w-[1280px] border-t border-[#E7DFDB] pt-8 md:pt-12">
            <h2 id="lodging-notes" className="sr-only">Overnight lodging notes</h2>
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              {place.lodgingNotes.map((note) => (
                <LodgingNote key={note.heading} note={note} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
