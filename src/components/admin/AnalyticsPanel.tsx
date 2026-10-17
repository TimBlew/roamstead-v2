"use client";
import { useEffect, useMemo, useState } from "react";

type Metric = { timestamp?: string; visitors?: number; pageviews?: number; count?: number; total?: number; eventName?: string; requestPath?: string; referrerHostname?: string; deviceType?: string };
type SearchData = {connected?:boolean;message?:string;clicks?:number;impressions?:number;ctr?:number;position?:number;endDate?:string;queries?:{query:string;clicks:number}[];pages?:{page:string;clicks:number}[]};
type WeeklyPoint = {start:string;end:string;visitors:number};
type Weekly = {weeks:WeeklyPoint[];current:WeeklyPoint|null};
type Payload = { connected?: boolean; message?: string; visits?: Metric[]; weekly?: Weekly; events?: Metric[]; pages?: Metric[]; referrers?: Metric[]; devices?: Metric[] };
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
    <div className="mt-3.5 space-y-3">
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
function VisitsChart({ weekly }: { weekly?: Weekly }) {
  const weeks = weekly?.weeks || [];
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...weeks.map(w => w.visitors));
  const width = 600, height = 190, left = 18, right = 18, top = 26, bottom = 30;
  const baseline = height - bottom;
  const coords = weeks.map((w, i) => ({
    x: left + (width-left-right)*i/Math.max(1,weeks.length-1),
    y: baseline - (baseline-top)*w.visitors/max,
    ...w
  }));
  const path = coords.map((p,i) => `${i?"L":"M"} ${p.x} ${p.y}`).join(" ");
  const fill = coords.length > 1 ? `${path} L ${coords[coords.length-1].x} ${baseline} L ${coords[0].x} ${baseline} Z` : "";
  const labelEvery = Math.max(1, Math.ceil(weeks.length/6));
  const previous = weeks.length > 1 ? weeks[weeks.length-2] : null;
  const latest = weeks.length ? weeks[weeks.length-1] : null;
  const change = previous && previous.visitors > 0 && latest ? (latest.visitors-previous.visitors)/previous.visitors*100 : null;
  return <div className="mt-2.5 rounded-xl border border-[#E7DFDB] bg-[#FFFCFB] px-3 pb-3 pt-3 sm:px-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-[12px] text-[#6D6057]">Weekly visitors · completed weeks</p>
      <p className="text-[12px] tabular-nums text-[#4A6E57]">{active !== null && weeks[active] ? `${shortDate(weeks[active].start)}–${shortDate(weeks[active].end)} · ${format(weeks[active].visitors)} visitors` : "Select a point for details"}</p>
    </div>
    {weeks.length > 1 ? <svg role="img" aria-label="Weekly visitors over the past year, completed weeks only" viewBox="0 0 600 190" className="mt-2 block h-auto w-full" onMouseLeave={() => setActive(null)}>
      <path d={fill} fill="#4A6E57" fillOpacity=".08"/>
      <line x1={left} x2={width-right} y1={baseline} y2={baseline} stroke="#E7DFDB" />
      <path d={path} fill="none" stroke="#4A6E57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((p,i) => <g key={p.start}>
        <circle cx={p.x} cy={p.y} r={i === coords.length-1 ? 5 : 3.5} fill="#4A6E57" />
        {(weeks.length <= 8 || i === weeks.length-1) && <text x={p.x} y={Math.max(12,p.y-11)} fontSize="10" textAnchor={i===0?"start":i===weeks.length-1?"end":"middle"} fill="#1F3125">{format(p.visitors)}</text>}
        {(i%labelEvery===0 || i===weeks.length-1) && <text x={p.x} y={height-9} fontSize="10" textAnchor={i===0?"start":i===weeks.length-1?"end":"middle"} fill="#6D6057">{shortDate(p.start)}</text>}
        <circle cx={p.x} cy={p.y} r="13" fill="transparent" tabIndex={0} role="button" aria-label={`${shortDate(p.start)} to ${shortDate(p.end)}: ${p.visitors} visitors`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} />
      </g>)}
    </svg> : <p className="py-5 text-[13px] text-[#6D6057]">{weeks.length === 1 ? `First complete week: ${format(weeks[0].visitors)} visitors (${shortDate(weeks[0].start)}–${shortDate(weeks[0].end)}).` : "Weekly history will appear after the first complete week of tracking."}</p>}
    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-[#E7DFDB] pt-2 text-[12px] text-[#6D6057]">
      {latest && previous && change !== null && <span>Latest completed week <strong className="font-medium text-[#1F3125]">{format(latest.visitors)}</strong> <span className={change>0?"text-[#4A6E57]":change<0?"text-[#9A5B55]":"text-[#6D6057]"}>({change>0?"+":""}{change.toFixed(1)}% vs prior week)</span></span>}
      {weekly?.current && <span>This week so far ({shortDate(weekly.current.start)}–{shortDate(weekly.current.end)}): <strong className="font-medium text-[#1F3125]">{format(weekly.current.visitors)} visitors</strong></span>}
    </div>
  </div>;
}
export default function AnalyticsPanel() {
  const [days, setDays] = useState<7 | 30 | 90 | 365>(30);
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
            <select id="analytics-period" value={days} onChange={e => setDays(Number(e.target.value) as 7 | 30 | 90 | 365)} className="h-11 w-[205px] appearance-none rounded-xl border border-[#D8CCC4] bg-white pl-4 pr-11 font-body text-[13px] font-medium text-[#1F3125] outline-none focus:border-[#4A6E57] focus:ring-2 focus:ring-[#4A6E57]/15">
              <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option><option value={365}>Last 365 days</option>
            </select>
            <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#1F3125]" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>
      </div>
      {!data ? <p className="mt-6 text-[14px] text-[#6D6057]">Gathering your latest numbers...</p> : !data.connected ? <p className="mt-6 rounded-lg bg-[#F4EFEC] p-4 text-[14px] text-[#6D6057]">{data.message || "Your site insights are temporarily unavailable."}</p> : <>
        <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {([["Page views", pageviews], ["Visitors", visits], ["Booking clicks", clicks], ["Dates selected", dateSelections]] as const).map(([label, n]) => <div key={label} className="rounded-xl bg-[#F4EFEC] px-4 py-3"><strong className="block font-heading text-[27px] font-medium leading-none tabular-nums text-[#1F3125]">{format(n)}</strong><span className="mt-1 block font-body text-[12px] text-[#6D6057]">{label}</span></div>)}
        </div>
        <h3 className="mt-5 font-heading text-[20px] font-medium text-[#1F3125]">Weekly visitor trend</h3>
        <VisitsChart weekly={data.weekly} />
        <div className="mt-4 border-t border-[#E7DFDB] pt-3.5"><h3 className="font-heading text-[20px] font-medium text-[#1F3125]">How guests explored your site</h3><div className="mt-1 divide-y divide-[#E7DFDB]">{events.length ? events.map((e, i) => <div key={i} className="flex justify-between gap-4 py-1.5 text-[13px]"><span>{actionNames[e.eventName || ""] || e.eventName || "Other action"}</span><strong className="font-medium tabular-nums">{format(value(e))}</strong></div>) : <p className="py-2 text-[13px] text-[#6D6057]">No tracked actions yet.</p>}</div></div>
      </>}
    </section>
    {data?.connected && <div className="grid gap-3.5 lg:grid-cols-2 lg:items-start">
      <div className="min-w-0 space-y-3.5">
      <MetricRows title="Pages guests visit most" subtitle="Public website pages" items={publicPages} keyName="requestPath" />
      
      <MetricRows title="Devices guests use" subtitle="Visits by device type" items={data.devices || []} keyName="deviceType" />
      </div>
      <div className="min-w-0 space-y-3.5">
      <section className="flex min-w-0 flex-col rounded-2xl border border-[#D8CCC4] bg-[#FFFCFB] p-4 sm:p-5">
        <h3 className="font-heading text-[19px] font-medium leading-[1.2] text-[#1F3125]">Google search</h3>
        <p className="mt-1 font-body text-[12px] text-[#6D6057]">Organic search performance · same selected period</p>
        {!search ? <p className="mt-3 text-[13px] text-[#6D6057]">Loading Google Search Console…</p> : search.connected ? <>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {([["Search clicks", search.clicks || 0], ["Impressions", search.impressions || 0], ["Click rate", ((search.ctr || 0) * 100).toFixed(1) + "%"], ["Avg. position", (search.position || 0).toFixed(1)]] as const).map(([name,val]) => <div key={name} className="rounded-xl bg-[#F4EFEC] px-3 py-2.5">
              <strong className="block font-heading text-[21px] font-medium leading-tight tabular-nums text-[#1F3125]">{typeof val === "number" ? format(val) : val}</strong>
              <span className="text-[12px] text-[#6D6057]">{name}</span>
            </div>)}
          </div>
          <h4 className="mt-5 font-heading text-[16px] text-[#1F3125]">Top searches</h4>
          <div className="mt-1 divide-y divide-[#E7DFDB]">{search.queries?.length ? search.queries.map((item,i) => <div key={i} className="flex justify-between gap-3 py-1.5 text-[12px]"><span className="min-w-0 break-words">{item.query}</span><span className="shrink-0 tabular-nums text-[#6D6057]">{format(item.clicks)} clicks</span></div>) : <p className="py-2 text-[12px] text-[#6D6057]">No search queries available for these dates.</p>}</div>
          <p className="mt-2 text-[11px] leading-snug text-[#6D6057]">Google data typically arrives a few days after search activity. Reporting through {search.endDate}.</p>
        </> : <p className="mt-3 text-[13px] leading-relaxed text-[#6D6057]">{search.message}</p>}
        <a className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl border border-[#D8CCC4] bg-white px-4 py-2.5 text-[12px] font-medium text-[#1F3125] transition-colors hover:bg-[#F4EFEC]" href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">Open Search Console <span aria-hidden="true">↗</span></a>
      </section>
      <MetricRows title="How guests found you" subtitle="Referring websites and direct traffic" items={data.referrers || []} keyName="referrerHostname" />
      </div>
    </div>}
    {data?.connected && adminViews > 0 && <p className="px-1 text-[12px] leading-relaxed text-[#6D6057]">Admin workspace activity ({format(adminViews)} page views among the listed paths) is excluded from the popular public pages above. Overall site totals and device/referrer figures may still include internal activity.</p>}
    <div className="flex justify-end"><a href="https://vercel.com/tim-blewitts-projects/roamstead-v2/analytics" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[12px] font-medium text-[#4A6E57] underline underline-offset-4">Explore more insights <span aria-hidden="true">↗</span></a></div>
  </div>;
}
