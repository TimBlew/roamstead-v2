"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Metric = { timestamp?: string; visitors?: number; pageviews?: number; count?: number; total?: number; eventName?: string; requestPath?: string; referrerHostname?: string; deviceType?: string };
type SearchData = {connected?:boolean;message?:string;clicks?:number;impressions?:number;ctr?:number;position?:number;endDate?:string;queries?:{query:string;clicks:number}[];pages?:{page:string;clicks:number}[]};
type Payload = { connected?: boolean; message?: string; visits?: Metric[]; events?: Metric[]; pages?: Metric[]; referrers?: Metric[]; devices?: Metric[] };
const actionNames: Record<string, string> = {
  availability_dates_selected: "Dates selected",
  hostaway_checkout_click: "Continue to booking",
  early_access_submission_accepted: "Early-access signups"
};
const format = (n: number) => new Intl.NumberFormat("en-US").format(n);
const value = (row: Metric) => Number(row.pageviews ?? row.count ?? row.total ?? row.visitors ?? 0);
const shortDate = (date: string) => {
  const d = new Date(date.slice(0, 10) + "T12:00:00");
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
function pageLabel(raw: string) {
  if (raw === "/") return "Homepage";
  if (raw === "/properties") return "All stays";
  if (raw === "/book") return "Book direct";
  if (raw.startsWith("/properties/")) return "Stay: " + raw.slice("/properties/".length).replace(/-/g, " ");
  if (raw.startsWith("/book/")) return "Book: " + raw.slice("/book/".length).replace(/-/g, " ");
  return raw;
}
function MetricRows({ title, subtitle, items, keyName, emptyText }: {
  title: string; subtitle?: string; items: Metric[]; keyName: "requestPath" | "referrerHostname" | "deviceType"; emptyText?: string;
}) {
  const sorted = [...items].sort((a, b) => value(b) - value(a)).slice(0, 6);
  const max = Math.max(...sorted.map(value), 1);
  return <section className="min-w-0 rounded-2xl border border-[#D8CCC4] bg-[#FFFCFB] p-4 sm:p-5">
    <h3 className="font-heading text-[19px] font-medium leading-[1.2] text-[#1F3125]">{title}</h3>
    {subtitle && <p className="mt-1 font-body text-[12px] leading-snug text-[#6D6057]">{subtitle}</p>}
    <div className="mt-3.5 space-y-3>
      {sorted.length ? sorted.map((item, i) => {
        const raw = item[keyName] || "Direct / unknown";
        const label = keyName === "requestPath" ? pageLabel(raw) : keyName === "deviceType" ? raw === "mobile" ? "Phone" : raw === "desktop" ? "Computer" : raw : raw;
        return <div key={raw + i}>
          <div className="mb-1 flex items-baseline justify-between gap-4 font-body text-[13px]">
            <span className="min-w-0 break-words text-[#1F3125]">{label}</span>
            <span className="shrink-0 tabular-nums text-[#6D6057]">{format(value(item))}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#EAE4E0]">
            <div className="h-full rounded-full bg-[#9DB3A1]" style={{ width: `${Math.max(2, value(item) / max * 100)}%` }} />
          </div>
        </div>;
      }) : <p className="text-[13px] text-[#6D6057]">{emptyText || "Nothing to show for these dates yet."}</p>}
    </div>
  </section>;
}
function VisitsChart({ daily }: { daily: Metric[] }) {
  const points = useMemo(() => [...daily].filter(d => d.timestamp).sort((a, b) => (a.timestamp || "").localeCompare(b.timestamp || "")), [daily]);
  const [selected, setSelected] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ left: 0, max: 0 });
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const sync = () => setScroll({ left: element.scrollLeft, max: Math.max(0, element.scrollWidth - element.clientWidth) });
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(element);
    return () => observer.disconnect();
  }, [points.length]);
  const highest = Math.max(1, ...points.map(p => p.pageviews || 0));
  const chartWidth = Math.max(760, (points.length - 1) * 46 + 80);
  const left = 38, right = 20, top = 12, bottom = 34, height = 180;
  const width = chartWidth - left - right, usableHeight = height - top - bottom;
  const coords = points.map((p, i) => ({
    x: left + (points.length < 2 ? width / 2 : width * i / (points.length - 1)),
    y: top + usableHeight * (1 - (p.pageviews || 0) / highest),
    date: p.timestamp || "", views: p.pageviews || 0
  }));
  const path = coords.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
  const active = selected !== null ? coords[selected] : null;
  return <div className="mt-2.5 rounded-xl border border-[#E7DFDB] bg-[#FFFCFB] px-3 pb-2.5 pt-3 sm:px-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-[12px] text-[#6D6057]">Daily page views</p>
      <p className="font-body text-[12px] tabular-nums text-[#4A6E57]">{active ? `${shortDate(active.date)} · ${format(active.views)} views` : "Select a point to see its date and views"}</p>
    </div>
    {points.length ? <div ref={scrollRef} className="mt-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" onScroll={e => setScroll({ left: e.currentTarget.scrollLeft, max: Math.max(0, e.currentTarget.scrollWidth - e.currentTarget.clientWidth) })} onMouseLeave={() => setSelected(null)}>
      <svg role="img" aria-label="Daily page views line chart. Each dot represents one date." viewBox={`0 0 ${chartWidth} ${height + 24}`} width={chartWidth} height={height + 24} className="max-w-none" onBlur={() => setSelected(null)}>
        {[0, 0.5, 1].map((step) => {
          const y = top + usableHeight * (1 - step);
          return <g key={step}><line x1={left} x2={chartWidth - right} y1={y} y2={y} stroke="#E9E1DC" strokeWidth="1" /><text x={left - 9} y={y + 4} textAnchor="end" fill="#796F68" fontSize="11">{Math.round(highest * step)}</text></g>;
        })}
        <path d={path} fill="none" stroke="#4A6E57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((p, i) => <g key={p.date}>
          <circle cx={p.x} cy={p.y} r={selected === i ? 6 : 4} stroke="#4A6E57" strokeWidth="2" fill={selected === i ? "#4A6E57" : "#FFFCFB"} />
          <circle cx={p.x} cy={p.y} r="13" fill="transparent" tabIndex={0} role="button" aria-label={`${shortDate(p.date)}: ${p.views} views`} onMouseEnter={() => setSelected(i)} onFocus={() => setSelected(i)} onClick={() => setSelected(i)} />
          <text x={p.x} y={height + 4} textAnchor="middle" fill="#6D6057" fontSize="10" transform={`rotate(-45 ${p.x} ${height + 4})`}>{shortDate(p.date)}</text>
        </g>)}
      </svg>
    </div> : <p className="py-10 text-center text-[13px] text-[#6D6057]">No visits recorded during this period.</p>}
    {points.length > 0 && scroll.max > 0 && <div
      role="scrollbar" aria-label="Scroll chart dates horizontally" aria-orientation="horizontal"
      aria-valuemin={0} aria-valuemax={Math.ceil(scroll.max)} aria-valuenow={Math.round(scroll.left)}
      tabIndex={0} className="relative mt-1.5 h-[9px] w-full touch-none cursor-pointer rounded-full bg-[#ECE9E7]"
      onPointerDown={e => {
        const el = scrollRef.current;
        if (!el) return;
        const bar = e.currentTarget, rect = bar.getBoundingClientRect();
        const thumb = Math.max(40, rect.width * el.clientWidth / el.scrollWidth);
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left - thumb / 2) / Math.max(1, rect.width - thumb)));
        el.scrollLeft = pct * scroll.max;
        bar.setPointerCapture(e.pointerId);
      }}
      onPointerMove={e => {
        if (!e.currentTarget.hasPointerCapture(e.pointerId) || !scrollRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect(), el = scrollRef.current;
        const thumb = Math.max(40, rect.width * el.clientWidth / el.scrollWidth);
        el.scrollLeft = Math.max(0, Math.min(1, (e.clientX - rect.left - thumb / 2) / Math.max(1, rect.width - thumb))) * scroll.max;
      }}
      onKeyDown={e => {
        if (!scrollRef.current) return;
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault(); scrollRef.current.scrollLeft += e.key === "ArrowRight" ? 70 : -70;
        } else if (e.key === "Home" || e.key === "End") {
          e.preventDefault(); scrollRef.current.scrollLeft = e.key === "Home" ? 0 : scroll.max;
        }
      }}
    >
      <div className="absolute top-0 h-full rounded-full bg-[#989898]" style={{
        width: `${Math.min(100, Math.max(4, (scrollRef.current?.clientWidth || 1) / (scrollRef.current?.scrollWidth || 1) * 100))}%`,
        left: `${scroll.max ? scroll.left / scroll.max * (100 - Math.min(100, Math.max(4, (scrollRef.current?.clientWidth || 1) / (scrollRef.current?.scrollWidth || 1) * 100))) : 0}%`
      }} />
    </div>}
  </div>;
}
export default function AnalyticsPanel() {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [data, setData] = useState<Payload | null>(null);
  const [search, setSearch] = useState<SearchData | null>(null);
  useEffect(() => {
    let active = true; setData(null);
    fetch(`/admin/api/analytics?days=${days}`, { cache: "no-store" })
      .then(r => r.json()).then(x => { if (active) setData(x); })
      .catch(() => { if (active) setData({ connected: false, message: "Reporting is temporarily unavailable." }); });
    return () => { active = false; };
  }, [days]);
  useEffect(() => {
    let active = true; setSearch(null);
    fetch(`/admin/api/search-console?days=${days}`, { cache: "no-store" }).then(r => r.json()).then(x => { if(active)setSearch(x); }).catch(() => { if(active)setSearch({connected:false,message:"Google Search reporting is temporarily unavailable."}); });
    return () => { active = false; };
  }, [days]);
  const daily = data?.visits || [], events = data?.events || [];
  const pageviews = useMemo(() => daily.reduce((s, d) => s + (d.pageviews || 0), 0), [daily]);
  const visits = useMemo(() => daily.reduce((s, d) => s + (d.visitors || 0), 0), [daily]);
  const clicks = events.filter(x => x.eventName === "hostaway_checkout_click").reduce((s, x) => s + value(x), 0);
  const dateSelections = events.filter(x => x.eventName === "availability_dates_selected").reduce((s, x) => s + value(x), 0);
  const pages = data?.pages || [];
  const publicPages = pages.filter(row => !(row.requestPath || "").startsWith("/admin"));
  const adminViews = pages.filter(row => (row.requestPath || "").startsWith("/admin")).reduce((sum, row) => sum + value(row), 0);
  return <div className="space-y-3.5">
    <section className="rounded-2xl border border-[#D8CCC4] bg-[#FFFCFB] p-4 sm:p-5">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0"><h2 className="font-heading text-[24px] font-medium leading-[1.15] text-[#1F3125]">At a glance</h2><p className="mt-1 max-w-[720px] font-body text-[13px] leading-relaxed text-[#6D6057]">Explore site activity and booking interest. A checkout click shows interest, rather than a confirmed stay.</p></div>
        <div className="flex shrink-0 items-center gap-3 sm:pt-1">
          <label htmlFor="analytics-period" className="font-body text-[13px] font-medium leading-none text-[#6D6057]">Period</label>
          <div className="relative">
            <select id="analytics-period" value={days} onChange={e => setDays(Number(e.target.value) as 7 | 30 | 90)} className="h-11 w-[205px] appearance-none rounded-xl border border-[#D8CCC4] bg-white pl-4 pr-11 font-body text-[13px] font-medium text-[#1F3125] outline-none focus:border-[#4A6E57] focus:ring-2 focus:ring-[#4A6E57]/15">
              <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option>
            </select>
            <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#1F3125]" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>
      </div>
      {!data ? <p className="mt-6 text-[14px] text-[#6D6057]">Gathering your latest numbers...</p> : !data.connected ? <p className="mt-6 rounded-lg bg-[#F4EFEC] p-4 text-[14px] text-[#6D6057]">{data.message || "Your site insights are temporarily unavailable."}</p> : <>
        <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {([["Page views", pageviews], ["Visitors", visits], ["Booking clicks", clicks], ["Dates selected", dateSelections]] as const).map(([label, n]) => <div key={label} className="rounded-xl bg-[#F4EFEC] px-4 py-3"><strong className="block font-heading text-[27px] font-medium leading-none tabular-nums text-[#1F3125]">{format(n)}</strong><span className="mt-1 block font-body text-[12px] text-[#6D6057]">{label}</span></div>)}
        </div>
        <h3 className="mt-5 font-heading text-[20px] font-medium text-[#1F3125]">Visits over time</h3>
        <VisitsChart daily={daily} />
        <div className="mt-4 border-t border-[#E7DFDB] pt-3.5"><h3 className="font-heading text-[20px] font-medium text-[#1F3125]">How guests explored your site</h3><div className="mt-1 divide-y divide-[#E7DFDB]">{events.length ? events.map((e, i) => <div key={i} className="flex justify-between gap-4 py-1.5 text-[13px]"><span>{actionNames[e.eventName || ""] || e.eventName || "Other action"}</span><strong className="font-medium tabular-nums">{format(value(e))}</strong></div>) : <p className="py-2 text-[13px] text-[#6D6057]">No tracked actions yet.</p>}</div></div>
      </>}
    </section>
    {data?.connected && <div className="grid items-start gap-3.5 lg:grid-cols-2">
      <MetricRows title="Pages guests visit most" subtitle="Public website pages" items={publicPages} keyName="requestPath" />
      <MetricRows title="How guests found you" subtitle="Referring websites and direct traffic" items={data.referrers || []} keyName="referrerHostname" />
      <MetricRows title="Devices guests use" subtitle="Visits by device type" items={data.devices || []} keyName="deviceType" />
      <section className="flex min-w-0 flex-col rounded-2xl border border-[#D8CCC4] bg-[#FFFCFB] p-4 sm:p-5">
        <h3 className="font-heading text-[19px] font-medium leading-[1.2] text-[#1F3125]">Google search</h3>
        <p className="mt-1 font-body text-[12px] text-[#6D6057]">Organic search performance · same selected period</p>
        {!search ? <p className="mt-3 text-[13px] text-[#6D6057]">Loading Google Search Console…</p> : search.connected ? <>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {([["Search clicks", search.clicks || 0], ["Impressions", search.impressions || 0], ["Click rate", ((search.ctr || 0) * 100).toFixed(1) + "%"], ["Avg. position", (search.position || 0).toFixed(1)]] as const).map(([name,val]) => <div key={name} className="rounded-xl bg-[#F4EFEC] px-3 py-2.5">
              <strong className="block font-heading text-[21px] font-medium leading-tight" tabular-nums text-[#1F3125]">{typeof val === "number" ? format(val) : val}</strong>
              <span className="text-[12px] text-[#6D6057]">{name}</span>
            </div>)}
          </div>
          <h4 className="mt-5 font-heading text-[16px] text-[#1F3125]">Top searches</h4>
          <div className="mt-1 divide-y divide-[#E7DFDB]">{search.queries?.length ? search.queries.map((item,i) => <div key={i} className="flex justify-between gap-3 py-1.5 text-[12px]"><span className="min-w-0 break-words">{item.query}</span><span className="shrink-0 tabular-nums text-[#6D6057]">{format(item.clicks)} clicks</span></div>) : <p className="py-2 text-[12px] text-[#6D6057]">No search queries available for these dates.</p>}</div>
          <p className="mt-2 text-[11px] leading-snug" text-[#6D6057]">Google data typically arrives a few days after search activity. Reporting through {search.endDate}.</p>
        </> : <p className="mt-3 text-[13px] leading-relaxed text-[#6D6057]">{search.message}</p>}
        <a className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl border border-[#D8CCC4] bg-white px-4 py-2.5 text-[12px] font-medium text-[#1F3125] transition-colors hover:bg-[#F4EFEC]" href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">Open Search Console <span aria-hidden="true">↗</span></a>
      </section>
    </div>}
    {data?.connected && adminViews > 0 && <p className="px-1 text-[12px] leading-relaxed text-[#6D6057]">Admin workspace activity ({format(adminViews)} page views among the listed paths) is excluded from the popular public pages above. Overall site totals and device/referrer figures may still include internal activity.</p>}
    <div className="flex justify-end"><a href="https://vercel.com/tim-blewitts-projects/roamstead-v2/analytics" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[12px] font-medium text-[#4A6E57] underline underline-offset-4">Explore more insights <span aria-hidden="true">↗</span></a></div>
  </div>;
}
