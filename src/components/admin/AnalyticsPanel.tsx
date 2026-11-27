"use client";
import { useEffect, useMemo, useRef, useState } from "react";

import { pageLabel, sourceLabel } from "@/lib/analytics-labels";
import type { ReservationSummary } from "@/lib/hostaway-reservations";
import { deriveAcquisition, type AcquisitionMetric, deriveAdminAnalytics, metricValue as value, type AnalyticsMetric as Metric, type AnalyticsBreakdowns } from "@/lib/admin-analytics";

type SearchData = {connected?:boolean;message?:string;clicks?:number;impressions?:number;ctr?:number;position?:number;endDate?:string;previous?:{clicks?:number;impressions?:number;ctr?:number;position?:number}|null;queries?:{query:string;clicks:number;impressions:number;position:number;ctr:number}[];pages?:{page:string;clicks:number;impressions:number;position:number;ctr:number}[]};
type InspectionData = {connected?:boolean;inspection?:boolean;launchIndexingEnabled?:boolean;siteMap?:string;results?:{path:string;url:string;status:string;reason:string;lastCrawlTime?:string|null}[]};
type WeeklyPoint = {start:string;end:string;visitors:number;partial?:boolean};
type Payload = AnalyticsBreakdowns & { inferredAcquisitionSource?: AcquisitionMetric[] | null; inferredAcquisitionCampaign?: AcquisitionMetric[] | null; verifiedReservations?: ReservationSummary; connected?: boolean; message?: string; visits?: Metric[]; chart?: WeeklyPoint[] | null; reporting?: {startDate:string;endDate:string;timeZone:string}; previous?:{visits:Metric[];pages:Metric[];referrers:Metric[];devices:Metric[]}|null; weeklyError?: string };
const format = (n: number) => new Intl.NumberFormat("en-US").format(n);
const shortDate = (date: string) => {
  const d = new Date(date.slice(0, 10) + "T12:00:00");
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
const pct = (part:number,total:number) => total > 0 ? Math.round(100*part/total)+"%" : "—";
function MetricRows({ title, subtitle, items, keyName, emptyText, available = true, compact = false }: {
  title: string; subtitle?: string; items: Metric[]; keyName: "requestPath" | "referrerHostname" | "deviceType"; emptyText?: string; available?: boolean; compact?:boolean;
}) {
  const sorted = (available ? [...items] : []).sort((a, b) => value(b) - value(a)).slice(0, 6);
  const max = Math.max(...sorted.map(value), 1);
  const total = items.reduce((sum,item)=>sum+value(item),0);
  return <section className="min-w-0 rounded-2xl border border-[#D8CCC4] bg-[#FFFCFB] px-4 py-3 sm:px-5 sm:py-4">
    <h3 className="font-heading text-[19px] font-medium leading-[1.2] text-[#1F3125]">{title}</h3>
    {subtitle && <p className="mt-1 font-body text-[12px] leading-snug text-[#6D6057]">{subtitle}</p>}
    <div className={compact ? "mt-1.5 space-y-1.5" : "mt-3 space-y-2.5"}>
      {sorted.length ? sorted.map((item, i) => {
        const raw = item[keyName] || "Direct / unknown";
        const label = keyName === "requestPath" ? pageLabel(raw) : keyName === "deviceType" ? raw === "mobile" ? "Phone" : raw === "desktop" ? "Computer" : raw : raw;
        return <div key={raw + i}>
          <div className="mb-1 flex items-baseline justify-between gap-4 font-body text-[13px]">
            <span className="min-w-0 break-words text-[#1F3125]">{label}</span>
            <span className="shrink-0 tabular-nums text-[#6D6057]">{format(value(item))} <span className="text-[11px] text-[#78877B]">· {pct(value(item),total)}</span></span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#EAE4E0]">
            <div className="h-full rounded-full bg-[#9DB3A1]" style={{ width: `${Math.max(2, value(item) / max * 100)}%` }} />
          </div>
        </div>;
      }) : <p className="text-[13px] text-[#6D6057]">{!available ? "Temporarily unavailable." : emptyText || "Nothing to show for these dates yet."}</p>}
    </div>
  </section>;
}
function VisitsChart({ chart, days }: { chart?: WeeklyPoint[] | null; days:number }) {
  const isDaily = days === 7;
  const unit = days === 365 ? "month" : "week";
  const points = chart || [];
  const current = points.at(-1) || null;
  const completed = points.slice(0, -1);
  const [active, setActive] = useState<number | null>(null);
  const [compactChart, setCompactChart] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollIndicator, setScrollIndicator] = useState({left:0,width:100});
  const syncScrollIndicator = (el:HTMLDivElement) => {
    const total=el.scrollWidth;
    const visible=el.clientWidth;
    const width=total>0 ? Math.min(100,visible/total*100) : 100;
    const left=total>visible ? el.scrollLeft/(total-visible)*(100-width) : 0;
    setScrollIndicator({left,width});
  };
  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const sync = () => setCompactChart(media.matches);
    sync();
    media.addEventListener("change",sync);
    return () => media.removeEventListener("change",sync);
  }, []);
  useEffect(() => {
    if(!compactChart || !timelineRef.current) return;
    timelineRef.current.scrollLeft = timelineRef.current.scrollWidth - timelineRef.current.clientWidth;
    syncScrollIndicator(timelineRef.current);
  }, [compactChart, days, points.length]);
  const max = Math.max(1, ...points.map(w => w.visitors));
  const width = compactChart ? Math.max(520,points.length*94) : 600, height = points.length === 1 ? (compactChart ? 168 : 100) : (compactChart ? 185 : 170), left = compactChart ? 32 : 18, right = compactChart ? 32 : 18, top = compactChart ? 22 : 26, bottom = compactChart ? 30 : 30;
  const baseline = height - bottom;
  const coords = points.map((w, i) => ({
    x: points.length === 1 ? width / 2 : left + (width-left-right)*i/Math.max(1,points.length-1),
    y: points.length === 1 ? top + 12 : baseline - (baseline-top)*w.visitors/max,
    ...w
  }));
  const completedCoords = coords.slice(0,completed.length);
  const completePath = completedCoords.map((p,i) => `${i?"L":"M"} ${p.x} ${p.y}`).join(" ");
  const fill = completedCoords.length > 1 ? `${completePath} L ${completedCoords[completedCoords.length-1].x} ${baseline} L ${completedCoords[0].x} ${baseline} Z` : "";
  const priorPoint = completedCoords[completedCoords.length-1];
  const currentPoint = current ? coords[coords.length-1] : null;
  const labelEvery = Math.max(1, Math.ceil(points.length/(compactChart ? Math.max(7,points.length) : 6)));
  return <div className="mt-2 border-0 bg-transparent py-2 sm:rounded-xl sm:border sm:border-[#E7DFDB] sm:bg-[#FFFCFB] sm:px-4 sm:py-3">
    <div className="flex items-center justify-between gap-2">
      <p className="text-[11px] font-medium leading-snug text-[#4A6E57] sm:text-[12px]">{isDaily ? "LAST 7 DAYS" : days === 365 ? "SELECTED PERIOD · MONTHLY" : "SELECTED PERIOD · WEEKLY"}</p>
      <p className="text-right text-[10px] leading-snug tabular-nums text-[#4A6E57] sm:text-[12px]">{active !== null && points[active] ? `${shortDate(points[active].start)}–${shortDate(points[active].end)} · ${format(points[active].visitors)} visitors${points[active].partial ? (active === points.length-1 ? (isDaily ? " (today, partial)" : ` (this ${unit}, partial)`) : ` (partial ${unit})`) : ""}` : <span className="hidden sm:inline">Select a point for details</span>}</p>
    </div>
    <div ref={timelineRef} className="relative mt-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-0 sm:overflow-visible sm:pb-0" aria-label="Scrollable visitor timeline" tabIndex={0} onScroll={(event) => syncScrollIndicator(event.currentTarget)}>
    {points.length > 0 ? <svg role="img" aria-label={isDaily ? "Daily visitors over the last 7 days; today is outlined" : `${days === 365 ? "Monthly" : "Weekly"} visitors; current ${unit} is outlined`} viewBox={`0 0 ${width} ${height}`} className="block h-auto max-w-none sm:mt-2 sm:w-full" style={compactChart ? {width:`${width}px`} : {width:"100%"}} onMouseLeave={() => setActive(null)}>
      <path d={fill} fill="#4A6E57" fillOpacity=".08"/>
      <line x1={left} x2={width-right} y1={baseline} y2={baseline} stroke="#E7DFDB" />
      <path d={completePath} fill="none" stroke="#4A6E57" strokeWidth={compactChart ? 2.3 : 2} strokeLinecap="round" strokeLinejoin="round" />
      {priorPoint && currentPoint && <line x1={priorPoint.x} y1={priorPoint.y} x2={currentPoint.x} y2={currentPoint.y} stroke="#4A6E57" strokeWidth={compactChart ? 2.3 : 2.5} strokeDasharray="4 4" strokeLinecap="round"/>}
      {coords.map((p,i) => {
        const isCurrent = !!current && i === coords.length-1;
        return <g key={p.start}>
          <circle cx={p.x} cy={p.y} r={compactChart ? (isCurrent ? 4 : 3.5) : (isCurrent ? 3.5 : 3)} fill={isCurrent ? "#FFFCFB" : "#4A6E57"} stroke={isCurrent ? "#4A6E57" : "none"} strokeWidth={isCurrent ? 1.75 : 0}/>
          {(points.length <= 8 || i === points.length-1) && <text x={p.x} y={Math.max(12,p.y-11)} fontSize={compactChart ? 10 : 10} textAnchor={points.length===1?"middle":i===0?"start":i===points.length-1?"end":"middle"} fill="#1F3125">{format(p.visitors)}</text>}
          {(i%labelEvery===0 || i===points.length-1) && <text x={p.x} y={height-9} fontSize="10" textAnchor={points.length===1?"middle":i===0?"start":i===points.length-1?"end":"middle"} fill="#6D6057">{shortDate(p.start)}</text>}
          <circle cx={p.x} cy={p.y} r="11" fill="transparent" tabIndex={0} role="button" aria-label={`${shortDate(p.start)} to ${shortDate(p.end)}: ${p.visitors} visitors${isCurrent ? (isDaily ? ", today" : `, current incomplete ${unit}`) : ""}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} />
        </g>;
      })}
    </svg> : <p className="py-5 text-[13px] text-[#6D6057]">Visitor history is not available for these dates.</p>}
    </div>
    <div className="mt-2 h-[5px] w-full rounded-full bg-[#DEDCD8] sm:hidden" role="img" aria-label="Timeline scroll position">
      <div className="h-full rounded-full bg-[#959C97] transition-[width,left] duration-150" style={{width:`${scrollIndicator.width}%`,marginLeft:`${scrollIndicator.left}%`}} />
    </div>
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] text-[#6D6057] sm:text-[12px] ${!isDaily && current ? "mt-2 border-t border-[#E7DFDB] pt-2" : "hidden"}`}>
      {!isDaily && current && <span>This {unit} so far ({shortDate(current.start)}–{shortDate(current.end)}): <strong className="font-medium text-[#1F3125]">{format(current.visitors)} visitors</strong></span>}
    </div>
  </div>;
}
export default function AnalyticsPanel() {
  const [acquisitionDimension, setAcquisitionDimension] = useState<"utm_source" | "utm_campaign">("utm_source");
  const [days, setDays] = useState<7 | 30 | 90 | 365>(7);
  const [data, setData] = useState<Payload | null>(null);
  const [search, setSearch] = useState<SearchData | null>(null);
  const [inspection, setInspection] = useState<InspectionData | null>(null);
  const [inspecting, setInspecting] = useState(false);
  const [guestCount, setGuestCount] = useState<number | null>(null);
  useEffect(() => {
    let active = true; const controller = new AbortController(); setData(null);
    fetch(`/admin/api/analytics?days=${days}`, { cache: "no-store", signal: controller.signal })
      .then(r => r.json()).then(x => { if (active) setData(x); })
      .catch(() => { if (active) setData({ connected: false, message: "Reporting is temporarily unavailable." }); });
    return () => { active = false; controller.abort(); };
  }, [days]);
  useEffect(() => {
    let active = true; const controller = new AbortController(); setSearch(null);
    fetch(`/admin/api/search-console?days=${days}`, { cache: "no-store", signal: controller.signal }).then(r => r.json()).then(x => { if(active)setSearch(x); }).catch(() => { if(active)setSearch({connected:false,message:"Google Search reporting is temporarily unavailable."}); });
    return () => { active = false; controller.abort(); };
  }, [days]);
  useEffect(() => {
    let active = true;
    fetch("/admin/api/early-access", { cache: "no-store" })
      .then(r => { if (!r.ok) throw new Error("Guest directory unavailable"); return r.json(); })
      .then(result => {
        if (active) setGuestCount(result.connected && Array.isArray(result.entries) ? new Set(result.entries.map((entry: {email?:string}) => (entry.email || "").trim().toLowerCase()).filter(Boolean)).size : null);
      })
      .catch(() => { if (active) setGuestCount(null); });
    return () => { active = false; };
  }, []);
  const daily = data?.visits || [];
  const pageviews = useMemo(() => daily.reduce((s, d) => s + (d.pageviews || 0), 0), [daily]);
  const visits = useMemo(() => daily.reduce((s, d) => s + (d.visitors || 0), 0), [daily]);
  const { clicks, eventsAvailable, exploredRows, pagesAvailable, referrersAvailable, devicesAvailable } = deriveAdminAnalytics(data, visits);
  const acquisitionRows = deriveAcquisition(acquisitionDimension === "utm_source" ? data?.inferredAcquisitionSource : data?.inferredAcquisitionCampaign, acquisitionDimension);
  const pages = data?.pages || [];
  const publicPages = pages.filter(row => !(row.requestPath || "").startsWith("/admin"));
  return <div className="space-y-3">
    <section className="rounded-2xl border border-[#D8CCC4] bg-[#FFFCFB] px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0"><h2 className="font-heading text-[24px] font-medium leading-[1.15] text-[#1F3125]">Overview</h2></div>
        <div className="flex shrink-0 items-center gap-3 sm:pt-1">
          <label htmlFor="analytics-period" className="font-body text-[13px] font-medium leading-none text-[#6D6057]">Period</label>
          <div className="relative w-[205px] max-w-full">
            <select id="analytics-period" value={days} onChange={e => setDays(Number(e.target.value) as 7 | 30 | 90 | 365)} className="h-11 w-full appearance-none rounded-xl border border-[#D8CCC4] bg-white pl-4 pr-11 font-body text-[13px] font-medium text-[#1F3125] outline-none focus:border-[#4A6E57] focus:ring-2 focus:ring-[#4A6E57]/15">
              <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 3 months</option><option value={365}>Last 12 months</option>
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4A6E57]" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m5 9 7 7 7-7" /></svg>
          </div>
        </div>
      </div>
      {!data ? <p className="mt-6 text-[14px] text-[#6D6057]">Gathering your latest numbers...</p> : !data.connected ? <p className="mt-6 rounded-lg bg-[#F4EFEC] p-4 text-[14px] text-[#6D6057]">{data.message || "Your site insights are temporarily unavailable."}</p> : <>
        <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-3">
          {([
            {eyebrow:"REACH",label:"Visitors",value:format(visits),note:"People exploring the site",detail:null,accent:"#597761"},
            {eyebrow:"ENGAGEMENT",label:"Page views",value:format(pageviews),note:"Public pages viewed",detail:null,accent:"#9C826B"},

            {eyebrow:"AUDIENCE",label:"Guests on the list",value:guestCount===null?"—":format(guestCount),note:"Stored contacts · all time",detail:null,accent:"#A18A78"}
          ] as const).map((metric) => <div key={metric.label} className="relative flex min-w-0 flex-col rounded-xl border border-[#E8DFD8] bg-[#F8F5F2] px-3 pb-2.5 pt-3 sm:px-4 sm:pb-2.5 sm:pt-3">
            <div className="flex items-center gap-2">
              <span className="h-[6px] w-[6px] shrink-0 rounded-full" style={{backgroundColor:metric.accent}} aria-hidden="true" />
              <span className="font-body text-[9px] font-semibold uppercase tracking-[.12em] text-[#80766E] sm:text-[10px]">{metric.eyebrow}</span>
            </div>
            <strong className="mt-2 block font-heading text-[30px] font-medium leading-none tracking-[-.035em] tabular-nums text-[#1F3125] sm:text-[36px]">{metric.value}</strong>
            <span className="mt-1.5 block font-body text-[12px] font-semibold leading-snug text-[#374A3D]">{metric.label}</span>
            <span className="mt-0.5 hidden font-body text-[10px] leading-snug text-[#786E65] sm:block sm:text-[11px]">{metric.note}</span>
          </div>)}
        </div>
                <h3 className="mt-3 font-heading text-[18px] font-medium leading-tight text-[#1F3125] sm:mt-4 sm:text-[20px]">{days===7?"Daily visitor trend":days===365?"Monthly visitor trend":"Weekly visitor trend"}</h3>
        <p className="mt-1 text-[11px] text-[#6D6057]">{data.reporting ? `${data.reporting.startDate} – ${data.reporting.endDate} · Mountain Time · Today is partial` : ""}</p>
        {data.chart && <VisitsChart chart={data.chart} days={days} />}
        <details className="mt-2 text-[11px] leading-relaxed text-[#6D6057]"><summary className="cursor-pointer">About visitor counts</summary><p className="mt-2">Vercel estimates visitors using daily identifiers. Returning visitors can count again on another day. Each chart point is queried for its Mountain Time window; the first and last buckets may be partial. The annual view uses months; 30- and 90-day views use weeks. Counts can differ from a sum of shorter windows. Historical QA page views remain included because the current analytics plan cannot filter their campaign tags. Booking activity and campaign counts exclude known tagged test activity.</p></details>
        {data.weeklyError && <p className="mt-2 text-[13px] text-[#6D6057]">{data.weeklyError}</p>}
        <div className="mt-3 border-t border-[#E7DFDB] pt-3 sm:mt-4"><h3 className="font-heading text-[20px] font-medium text-[#1F3125]">Booking activity</h3><div className="mt-1 divide-y divide-[#E7DFDB]">{exploredRows?.length ? exploredRows.map((e, i) => <div key={i} className="flex justify-between gap-4 py-1.5 text-[13px]"><span>{e.label}</span><strong className="font-medium tabular-nums">{format(e.value)}</strong></div>) : <p className="py-2 text-[13px] text-[#6D6057]">{eventsAvailable ? "No tracked actions yet." : "Guest actions are temporarily unavailable."}</p>}</div><p className="mt-2 font-body text-[11px] leading-snug text-[#80766E]">A checkout handoff is a tap toward payment. It is not a confirmed reservation or revenue. Property page views are separate from automatic traffic page views.</p></div>
      </>}
    </section>
    <section aria-busy={!data} className="rounded-2xl border border-[#D8CCC4] bg-[#FFFCFB] px-4 py-3 sm:px-5 sm:py-4">
      <h3 className="font-heading text-[20px] font-medium text-[#1F3125]">Website bookings</h3>
      <p className="mt-1 text-[12px] text-[#6D6057]">All sources · Reservations created during the selected period</p>
      <div className="mt-3 grid grid-cols-1 gap-2.5 min-[400px]:grid-cols-2 lg:grid-cols-3">
        {[
          {label:"Confirmed website reservations",number:data?.verifiedReservations?.available ? format(data.verifiedReservations.count) : "—",note:!data ? "Loading…" : data.verifiedReservations?.available ? "Verified in Hostaway" : "Temporarily unavailable"},
          {label:"Website booking revenue",number:data?.verifiedReservations?.available ? Object.entries(data.verifiedReservations.revenue).map(([currency, amount]) => new Intl.NumberFormat("en-US", {style:"currency",currency,maximumFractionDigits:2}).format(amount)).join(" · ") || "0" : "—",note:!data ? "Loading…" : data.verifiedReservations?.available ? "Gross reservation total" : "Temporarily unavailable"},
          {label:"Checkout clicks",number:clicks === null ? "—" : format(clicks),note:!data ? "Loading…" : clicks === null ? "Temporarily unavailable" : "Clicks toward payment, not bookings"},
        ].map(metric => <div key={metric.label} className="min-w-0 rounded-xl border border-[#E8DFD8] bg-[#F8F5F2] px-4 py-3">
          <strong className="block break-words font-heading text-[30px] font-medium leading-tight tracking-[-.035em] tabular-nums text-[#1F3125] sm:text-[36px]">{metric.number}</strong>
          <span className="mt-1.5 block font-body text-[12px] font-semibold text-[#374A3D]">{metric.label}</span>
          <span className="mt-1 block text-[11px] text-[#786E65]">{metric.note}</span>
        </div>)}
      </div>
      <details className="mt-3 text-[12px] leading-relaxed text-[#6D6057]"><summary className="cursor-pointer">What these numbers include</summary>
        <p className="mt-2">Confirmed reservations made through the website checkout, from all sources. Hostaway does not record campaign tags, so these are not linked to any campaign.</p>
        <p className="mt-2">Booking revenue sums Hostaway’s total price, by currency. It includes only fees and taxes already included in that total; nothing is added again. The account’s fee and tax breakdown has not been verified. This is not net income or payment collected. Cancelled reservations are excluded.</p>
        <p className="mt-2">A checkout click is not a confirmed reservation. Booking conversion is not shown because website visitors and Hostaway reservations cannot be reliably matched.</p>
      </details>
      <div className="mt-3 border-t border-[#E7DFDB] pt-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-heading text-[16px] font-medium text-[#1F3125]">Campaign performance</h4>
        <select aria-label="Acquisition breakdown" value={acquisitionDimension} onChange={event => setAcquisitionDimension(event.target.value as "utm_source" | "utm_campaign")} className="rounded-lg border border-[#D8CCC4] bg-[#FFFCFB] px-3 py-2 text-[13px]">
          <option value="utm_source">Source</option><option value="utm_campaign">Campaign</option>
        </select>
      </div>
      <div className="mt-3 sm:overflow-x-auto">
        {acquisitionRows?.length ? <>
        <div className="divide-y divide-[#E7DFDB] sm:hidden">
          {acquisitionRows.map(row => <div key={row.label} className="py-3">
            <p className="[overflow-wrap:anywhere] text-[13px] font-medium">{acquisitionDimension === "utm_source" ? sourceLabel(row.label) : row.label}</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
              {([["Property views", row.views], ["Booking starts", row.guests], ["Checkout clicks", row.handoffs], ["Signups", row.signups]] as const).map(([label, count]) => <div key={label} className="min-w-0">
                <dt className="text-[11px] text-[#6D6057]">{label}</dt>
                <dd className="text-[13px] tabular-nums">{format(count)}</dd>
              </div>)}
            </dl>
          </div>)}
        </div>
        <table className="hidden w-full table-fixed text-left text-[13px] sm:table">
          <thead className="text-[#6D6057]"><tr>{[acquisitionDimension === "utm_source" ? "Source" : "Campaign", "Property views", "Booking starts", "Checkout clicks", "Signups"].map(label => <th key={label} className="px-2 py-3 text-right first:w-[32%] first:text-left text-[11px] font-medium">{label}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#E7DFDB]">{acquisitionRows.map(row => <tr key={row.label}><td className="[overflow-wrap:anywhere] px-2 py-3 font-medium text-[#1F3125]">{acquisitionDimension === "utm_source" ? sourceLabel(row.label) : row.label}</td>{[row.views, row.guests, row.handoffs, row.signups].map((n, i) => <td key={i} className="px-2 py-3 text-right tabular-nums text-[#374A3D]">{format(n)}</td>)}</tr>)}</tbody>
        </table>
        </> : <p className="text-[13px] text-[#6D6057]">{!data ? "Loading campaign activity…" : acquisitionRows ? "No tracked actions yet." : "Campaign reporting is temporarily unavailable."}</p>}
      </div>
      <details className="mt-3 text-[12px] leading-relaxed text-[#6D6057]"><summary className="cursor-pointer">How campaign activity is counted</summary><p className="mt-2">Counts of on-site actions grouped by the visitor's first-touch tags. These are inferred, are not linked to reservations, and do not show that a campaign generated a booking. A checkout handoff is not a reservation. Missing tags appear as Direct / Unknown.</p><p className="mt-2">Property views are tracked property and booking page views. Booking starts count the guest-step action after dates are chosen in guided booking; the standard flow does not emit this event. Signups count accepted submissions, not unique contacts. Known tagged test activity is excluded. Unidentified sources remain included. Source names alone do not prove guest engagement; automated link scanning may be included.</p></details>
      </div>
    </section>
    {data?.connected && <div className="grid items-start gap-3 lg:grid-cols-2">
      <MetricRows title="Pages guests visit most" compact available={pagesAvailable} items={publicPages} keyName="requestPath" />
      <div className="grid min-w-0 gap-3">
        <MetricRows title="Traffic sources" compact available={referrersAvailable} items={data.referrers || []} keyName="referrerHostname" />
        <MetricRows title="Visits by device type" compact available={devicesAvailable} items={data.devices || []} keyName="deviceType" />
      </div>
    </div>}
    {<section className="min-w-0 rounded-2xl border border-[#D8CCC4] bg-[#FFFCFB] px-4 pb-3 pt-2.5 sm:px-5 sm:py-4">
        <h3 className="font-heading text-[19px] font-medium leading-tight text-[#1F3125]">Google search performance</h3>
        {!search ? <p className="mt-3 text-[13px] text-[#6D6057]">Loading Google search data…</p> : !search.connected ? <p className="mt-3 text-[13px] text-[#6D6057]">{search.message || "Google Search reporting is temporarily unavailable."}</p> : <>
          <div className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {([["Search clicks",search.clicks||0],["Appearances",search.impressions||0],["Click rate",((search.ctr||0)*100).toFixed(1)+"%"],["Average position",(search.position||0)>0?(search.position||0).toFixed(1):"—"]] as const).map(([name,val],index)=><div key={name} className="relative min-w-0 overflow-hidden rounded-xl border border-[#E5DDD5] bg-[#F7F4F0] px-3 pb-2 pt-2.5 sm:px-3.5 sm:pb-2.5 sm:pt-3">
              <div className={`absolute inset-x-0 top-0 h-[2px] ${index<2?"bg-[#75947D]":"bg-[#B29C88]"}`} />
              <span className="block font-body text-[10px] font-medium tracking-[0.025em] text-[#6D6057]">{name}</span>
              <strong className="mt-0.5 block font-heading text-[25px] font-medium leading-none tabular-nums tracking-tight text-[#1F3125] sm:text-[27px]">{typeof val==="number"?format(val):val}</strong>
            </div>)}
          </div>
          <div className="mt-3 grid gap-2.5 lg:grid-cols-[1fr_1fr_1.3fr] lg:gap-4">
          <div className="min-w-0 border-t border-[#E7DFDB] pt-2.5 lg:border-t-0 lg:border-r lg:pr-4 lg:pt-0">
            <h4 className="font-heading text-[16px] font-medium text-[#1F3125]">Google searches</h4>
            <div className="mt-2 divide-y divide-[#EEE8E4]">
              {(search.queries||[]).filter(q=>q.impressions>0).slice(0,10).map(q=><div key={q.query} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-1 text-[12px] leading-[1.4]">
                <span className="min-w-0 overflow-wrap-anywhere break-words text-[#1F3125]">{q.query}</span><span className="shrink-0 tabular-nums text-[#6D6057]">{format(q.impressions)}</span>
              </div>)}
              {!search.queries?.length && <p className="py-2 text-[12px] text-[#6D6057]">Search terms will appear once Google has enough data.</p>}
            </div>
          </div>
          <div className="min-w-0 border-t border-[#E7DFDB] pt-2.5 lg:border-t-0 lg:border-r lg:pr-4 lg:pt-0">
            <h4 className="font-heading text-[16px] font-medium text-[#1F3125]">Google rankings</h4>
            <div className="mt-2 divide-y divide-[#EEE8E4]">
              {[...(search.queries||[])].filter(q=>q.impressions>0&&q.position>0).sort((a,b)=>a.position-b.position).slice(0,10).map(q=><div key={q.query} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-1.5 text-[12px] leading-[1.4]">
                <span className="min-w-0 overflow-wrap-anywhere break-words text-[#1F3125]">{q.query}</span><span className="shrink-0 font-medium tabular-nums text-[#597761]">{q.position.toFixed(1)}</span>
              </div>)}
            </div>
          </div>
          <div className="min-w-0 border-t border-[#E7DFDB] pt-2.5 lg:border-t-0 lg:pt-0">
            <h4 className="font-heading text-[16px] font-medium text-[#1F3125]">Pages found on Google</h4>
            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_40px_40px_46px] gap-1 text-[10px] text-[#80766E]">
              <span>Page</span><span className="text-right">Clicks</span><span className="text-right">Views</span><span className="text-right">Rank</span>
            </div>
            <div className="mt-2 divide-y divide-[#EEE8E4]">
              {(search.pages||[]).slice(0,10).map(p=><div key={p.page} className="grid grid-cols-[minmax(0,1fr)_40px_40px_46px] items-start gap-1 py-1.5 text-[11px] leading-[1.4]">
                <span className="min-w-0 overflow-wrap-anywhere break-words text-[#1F3125]">{pageLabel((()=>{try{return new URL(p.page).pathname}catch{return p.page}})())}</span>
                <span className="text-right tabular-nums text-[#6D6057]">{format(p.clicks)}</span>
                <span className="text-right tabular-nums text-[#6D6057]">{format(p.impressions)}</span>
                <span className="text-right tabular-nums text-[#6D6057]">{p.position>0?p.position.toFixed(1):"—"}</span>
              </div>)}
              {!search.pages?.length && <p className="py-2 text-[12px] text-[#6D6057]">No page data available for this period.</p>}
            </div>
          </div>
          </div>
          <p className="mt-1.5 text-[10px] leading-snug text-[#80766E]">Google data through {search.endDate} · Pacific Time · Three-day reporting delay · Positions are averages.</p>
          <div className="mt-2 border-t border-[#E7DFDB] pt-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-heading text-[16px] font-medium text-[#1F3125]">Google indexing</h4>
              <button type="button" disabled={inspecting} onClick={async()=>{
                setInspecting(true);
                try{
                  const response=await fetch("/admin/api/search-console?inspection=1",{cache:"no-store"});
                  const result=await response.json();
                  setInspection(response.ok?result:{connected:false});
                }catch{setInspection({connected:false});}
                finally{setInspecting(false);}
              }} className="rounded-lg border border-[#D8CCC4] px-3 py-1.5 font-body text-[12px] font-medium text-[#1F3125] transition hover:bg-[#F4EFEC] disabled:opacity-50">
                {inspecting?"Checking Google…":inspection?"Check again":"Check indexing"}
              </button>
            </div>

            {inspection?.results && <div className="mt-1 divide-y divide-[#EEE8E4]">
              {inspection.results.map(item=><div key={item.path} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-1.5 text-[12px]">
                <span className="min-w-0 text-[#1F3125]">{pageLabel(item.path)}</span>
                <span className={item.status==="indexed"?"text-[#4A6E57]":item.status==="not_indexed"?"text-[#906954]":"text-[#80766E]"}>
                  {item.status==="indexed"?"Indexed":item.status==="not_indexed"?"Not indexed":"Not confirmed"}
                </span>
              </div>)}
            </div>}
            {inspection && !inspection.connected && <p className="mt-2 text-[11px] text-[#906954]">Google indexing checks are currently unavailable.</p>}
            {inspection?.results?.some(item=>item.status==="unavailable") && <p className="mt-1 text-[11px] text-[#80766E]">Some results could not be inspected with current Google permissions.</p>}
            {inspection?.launchIndexingEnabled===false && <p className="mt-1 text-[11px] text-[#906954]">Production indexing configuration needs review.</p>}
          </div>

        </>}
      </section>}
  </div>;
}
