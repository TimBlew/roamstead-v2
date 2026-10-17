"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Metric = { timestamp?: string; visitors?: number; pageviews?: number; count?: number; total?: number; eventName?: string; requestPath?: string; referrerHostname?: string; deviceType?: string };
type SearchData = {connected?:boolean;message?:string;clicks?:number;impressions?:number;ctr?:number;position?:number;endDate?:string;previous?:{clicks?:number;impressions?:number;ctr?:number;position?:number}|null;queries?:{query:string;clicks:number;impressions:number;position:number;ctr:number}[];pages?:{page:string;clicks:number;impressions:number;position:number;ctr:number}[]};
type WeeklyPoint = {start:string;end:string;visitors:number};
type Weekly = {weeks:WeeklyPoint[];current:WeeklyPoint|null};
type Payload = { connected?: boolean; message?: string; visits?: Metric[]; previous?:{visits:Metric[];pages:Metric[];referrers:Metric[];devices:Metric[]}|null; weekly?: Weekly; events?: Metric[]; pages?: Metric[]; referrers?: Metric[]; devices?: Metric[] };
const actionNames: Record<string, string> = {
  availability_dates_selected: "Dates selected",
  hostaway_checkout_click: "Continue to booking",
  early_access_submission_accepted: "Signup submissions"
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
const pct = (part:number,total:number) => total > 0 ? Math.round(100*part/total)+"%" : "—";
function changeLabel(current:number,previous:number|undefined){
  if(previous===undefined)return null;
  if(previous<=0)return null;
  const percent=(current-previous)/previous*100;
  return (percent>0?"+":"")+percent.toFixed(0)+"% vs prior";
}
function MetricRows({ title, subtitle, items, keyName, emptyText, previousItems, compact = false }: {
  title: string; subtitle?: string; items: Metric[]; keyName: "requestPath" | "referrerHostname" | "deviceType"; emptyText?: string; previousItems?:Metric[]; compact?:boolean;
}) {
  const sorted = [...items].sort((a, b) => value(b) - value(a)).slice(0, 6);
  const max = Math.max(...sorted.map(value), 1);
  const total = items.reduce((sum,item)=>sum+value(item),0);
  return <section className={`min-w-0 rounded-2xl border border-[#D8CCC4] bg-[#FFFCFB] ${compact ? "px-4 pb-2.5 pt-2 sm:px-5 sm:pb-3 sm:pt-2.5" : "p-4 sm:p-5"}`}>
    <h3 className="font-heading text-[19px] font-medium leading-[1.2] text-[#1F3125]">{title}</h3>
    {subtitle && <p className="mt-1 font-body text-[12px] leading-snug text-[#6D6057]">{subtitle}</p>}
    <div className={compact ? "mt-1.5 space-y-1.5" : "mt-3 space-y-2.5"}>
      {sorted.length ? sorted.map((item, i) => {
        const raw = item[keyName] || "Direct / unknown";
        const prior=previousItems?.find(x=>(x[keyName] || "Direct / unknown")===raw);
        const delta=previousItems && prior && value(prior)>0 ? changeLabel(value(item),value(prior)) : null;
        const label = keyName === "requestPath" ? pageLabel(raw) : keyName === "deviceType" ? raw === "mobile" ? "Phone" : raw === "desktop" ? "Computer" : raw : raw;
        return <div key={raw + i}>
          <div className="mb-1 flex items-baseline justify-between gap-4 font-body text-[13px]">
            <span className="min-w-0 break-words text-[#1F3125]">{label}</span>
            <span className="shrink-0 tabular-nums text-[#6D6057]">{format(value(item))} <span className="text-[11px] text-[#78877B]">· {pct(value(item),total)}</span></span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#EAE4E0]">
            <div className="h-full rounded-full bg-[#9DB3A1]" style={{ width: `${Math.max(2, value(item) / max * 100)}%` }} />
          </div>
          {delta && <p className="mt-1 text-[11px] leading-tight text-[#6D6057]">{delta}</p>}
        </div>;
      }) : <p className="text-[13px] text-[#6D6057]">{emptyText || "Nothing to show for these dates yet."}</p>}
    </div>
  </section>;
}
function VisitsChart({ weekly, daily, days }: { weekly?: Weekly; daily:Metric[]; days:number }) {
  const isDaily = days === 7;
  const today = new Date();
  const dailyMap = new Map(daily.map(row => [row.timestamp?.slice(0,10), row.visitors || 0]));
  const dailyPoints = Array.from({length:7},(_,i)=>{
    const date = new Date(Date.UTC(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate()-6+i)).toISOString().slice(0,10);
    return {start:date,end:date,visitors:dailyMap.get(date)||0};
  });
  const completed = isDaily ? dailyPoints.slice(0,6) : weekly?.weeks || [];
  const current = isDaily ? dailyPoints[6] : weekly?.current || null;
  const points = [...completed, ...(current ? [current] : [])];
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
  const previous = completed.length > 1 ? completed[completed.length-2] : null;
  const latest = completed.length ? completed[completed.length-1] : null;
  const change = previous && previous.visitors > 0 && latest ? (latest.visitors-previous.visitors)/previous.visitors*100 : null;
  return <div className="mt-2 border-0 bg-transparent py-2 sm:rounded-xl sm:border sm:border-[#E7DFDB] sm:bg-[#FFFCFB] sm:px-4 sm:py-3">
    <div className="flex items-center justify-between gap-2">
      <p className="text-[11px] font-medium leading-snug text-[#4A6E57] sm:text-[12px]">{isDaily ? "LAST 7 DAYS" : "WEEKLY HISTORY"}</p>
      <p className="text-right text-[10px] leading-snug tabular-nums text-[#4A6E57] sm:text-[12px]">{active !== null && points[active] ? `${shortDate(points[active].start)}–${shortDate(points[active].end)} · ${format(points[active].visitors)} visitors${current && active === points.length-1 ? (isDaily ? " (today)" : " (this week)") : ""}` : <span className="hidden sm:inline">Select a point for details</span>}</p>
    </div>
    <div ref={timelineRef} className="relative mt-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-0 sm:overflow-visible sm:pb-0" aria-label="Scrollable visitor timeline" tabIndex={0} onScroll={(event) => syncScrollIndicator(event.currentTarget)}>
    {points.length > 0 ? <svg role="img" aria-label={isDaily ? "Daily visitors over the last 7 days; today is outlined" : "Weekly visitors; current week is outlined"} viewBox={`0 0 ${width} ${height}`} className="block h-auto max-w-none sm:mt-2 sm:w-full" style={compactChart ? {width:`${width}px`} : {width:"100%"}} onMouseLeave={() => setActive(null)}>
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
          <circle cx={p.x} cy={p.y} r="11" fill="transparent" tabIndex={0} role="button" aria-label={`${shortDate(p.start)} to ${shortDate(p.end)}: ${p.visitors} visitors${isCurrent ? (isDaily ? ", today" : ", current incomplete week") : ""}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} />
        </g>;
      })}
    </svg> : <p className="py-5 text-[13px] text-[#6D6057]">{points.length === 1 ? `${current ? "This week so far" : "First complete week"}: ${format(points[0].visitors)} visitors (${shortDate(points[0].start)}–${shortDate(points[0].end)}).` : "Weekly history will appear once tracking has a full week of data."}</p>}
    </div>
    <div className="mt-2 h-[5px] w-full rounded-full bg-[#DEDCD8] sm:hidden" role="img" aria-label="Timeline scroll position">
      <div className="h-full rounded-full bg-[#959C97] transition-[width,left] duration-150" style={{width:`${scrollIndicator.width}%`,marginLeft:`${scrollIndicator.left}%`}} />
    </div>
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] text-[#6D6057] sm:text-[12px] ${!isDaily && ((latest && previous && change !== null) || current) ? "mt-2 border-t border-[#E7DFDB] pt-2" : "hidden"}`}>
      {!isDaily && latest && previous && change !== null && <span>Latest completed week <strong className="font-medium text-[#1F3125]">{format(latest.visitors)}</strong> <span className={change>0?"text-[#4A6E57]":change<0?"text-[#9A5B55]":"text-[#6D6057]"}>({change>0?"+":""}{change.toFixed(1)}% vs prior week)</span></span>}
      {!isDaily && current && <span>This week so far ({shortDate(current.start)}–{shortDate(current.end)}): <strong className="font-medium text-[#1F3125]">{format(current.visitors)} visitors</strong></span>}
    </div>
  </div>;
}
export default function AnalyticsPanel() {
  const [days, setDays] = useState<7 | 30 | 90 | 365>(7);
  const [data, setData] = useState<Payload | null>(null);
  const [search, setSearch] = useState<SearchData | null>(null);
  const [guestCount, setGuestCount] = useState<number | null>(null);
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
  const daily = data?.visits || [], events = data?.events || [];
  const pageviews = useMemo(() => daily.reduce((s, d) => s + (d.pageviews || 0), 0), [daily]);
  const visits = useMemo(() => daily.reduce((s, d) => s + (d.visitors || 0), 0), [daily]);
  const clicks = events.filter(x => x.eventName === "hostaway_checkout_click").reduce((s, x) => s + value(x), 0);
  const dateSelections = events.filter(x => x.eventName === "availability_dates_selected").reduce((s, x) => s + value(x), 0);
  const signups = events.filter(x => x.eventName === "early_access_submission_accepted").reduce((s, x) => s + value(x), 0);
  const pages = data?.pages || [];
  const publicPages = pages.filter(row => !(row.requestPath || "").startsWith("/admin"));
  const previousVisits=data?.previous?.visits;
  const previousPageviews=previousVisits?.reduce((sum,row)=>sum+(row.pageviews||0),0);
  const previousVisitors=previousVisits?.reduce((sum,row)=>sum+(row.visitors||0),0);
  return <div className="space-y-3">
    <section className="rounded-2xl border border-[#D8CCC4] bg-[#FFFCFB] p-4 sm:p-5">
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
        <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {([
            {eyebrow:"REACH",label:"Visitors",value:format(visits),note:"People exploring the site",detail:changeLabel(visits,previousVisitors),accent:"#597761"},
            {eyebrow:"BOOKING",label:"Checkout clicks",value:format(clicks),note:"Continue to booking actions",detail:null,accent:"#9C826B"},
            {eyebrow:"ENGAGEMENT",label:"Checkout click rate",value:visits>0?((clicks/visits)*100).toFixed(1)+"%":"—",note:"Checkout clicks ÷ visitors",detail:null,accent:"#82917B"},
            {eyebrow:"AUDIENCE",label:"Guests on the list",value:guestCount===null?"—":format(guestCount),note:"Stored contacts · all time",detail:null,accent:"#A18A78"}
          ] as const).map((metric) => <div key={metric.label} className="relative flex min-w-0 flex-col rounded-xl border border-[#E8DFD8] bg-[#F8F5F2] px-3 pb-2.5 pt-3 sm:px-4 sm:pb-2.5 sm:pt-3">
            <div className="flex items-center gap-2">
              <span className="h-[6px] w-[6px] shrink-0 rounded-full" style={{backgroundColor:metric.accent}} aria-hidden="true" />
              <span className="font-body text-[9px] font-semibold uppercase tracking-[.12em] text-[#80766E] sm:text-[10px]">{metric.eyebrow}</span>
            </div>
            <strong className="mt-2 block font-heading text-[30px] font-medium leading-none tracking-[-.035em] tabular-nums text-[#1F3125] sm:text-[36px]">{metric.value}</strong>
            <span className="mt-1.5 block font-body text-[12px] font-semibold leading-snug text-[#374A3D]">{metric.label}</span>
            <span className="mt-0.5 hidden font-body text-[10px] leading-snug text-[#786E65] sm:block sm:text-[11px]">{metric.note}</span>
            {metric.detail && <span className="mt-1.5 block font-body text-[11px] leading-snug text-[#4A6E57]">{metric.detail}</span>}
          </div>)}
        </div>
                <h3 className="mt-4 font-heading text-[18px] font-medium leading-tight text-[#1F3125] sm:mt-5 sm:text-[20px]">{days===7?"Daily visitor trend":"Weekly visitor trend"}</h3>
        <VisitsChart weekly={data.weekly} daily={daily} days={days} />
        <div className="mt-4 border-t border-[#E7DFDB] pt-3.5 sm:mt-5"><h3 className="font-heading text-[20px] font-medium text-[#1F3125]">How guests explored your site</h3><div className="mt-1 divide-y divide-[#E7DFDB]">{events.length ? events.map((e, i) => <div key={i} className="flex justify-between gap-4 py-1.5 text-[13px]"><span>{actionNames[e.eventName || ""] || e.eventName || "Other action"}</span><strong className="font-medium tabular-nums">{format(value(e))}</strong></div>) : <p className="py-2 text-[13px] text-[#6D6057]">No tracked actions yet.</p>}</div></div>
      </>}
    </section>
    {data?.connected && <div className="grid items-start gap-3 lg:grid-cols-2">
      <MetricRows title="Pages guests visit most" compact items={publicPages} keyName="requestPath" previousItems={data.previous?.pages} />
      <div className="grid min-w-0 gap-3">
        <MetricRows title="Referring websites and direct traffic" compact items={data.referrers || []} keyName="referrerHostname" previousItems={data.previous?.referrers} />
        <MetricRows title="Visits by device type" compact items={data.devices || []} keyName="deviceType" previousItems={data.previous?.devices} />
      </div>
    </div>}
    {data?.connected && <section className="min-w-0 rounded-2xl border border-[#D8CCC4] bg-[#FFFCFB] px-4 pb-3 pt-2.5 sm:px-5 sm:pb-3 sm:pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-heading text-[19px] font-medium text-[#1F3125]">Google search performance</h3>
          <span className="font-body text-[11px] text-[#6D6057]">Organic Google search</span>
        </div>
        {!search ? <p className="mt-3 text-[13px] text-[#6D6057]">Loading Google search data…</p> : !search.connected ? <p className="mt-3 text-[13px] text-[#6D6057]">{search.message}</p> : <>
          <div className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {([["Search clicks",search.clicks||0],["Appearances",search.impressions||0],["Click rate",((search.ctr||0)*100).toFixed(1)+"%"],["Average position",(search.position||0)>0?(search.position||0).toFixed(1):"—"]] as const).map(([name,val],index)=><div key={name} className="relative min-w-0 overflow-hidden rounded-xl border border-[#E5DDD5] bg-[#F7F4F0] px-3 pb-2.5 pt-3 sm:px-3.5">
              <div className={`absolute inset-x-0 top-0 h-[2px] ${index<2?"bg-[#75947D]":"bg-[#B29C88]"}`} />
              <span className="block font-body text-[10px] font-medium tracking-[0.025em] text-[#6D6057]">{name}</span>
              <strong className="mt-1 block font-heading text-[25px] font-medium leading-none tabular-nums tracking-tight text-[#1F3125] sm:text-[27px]">{typeof val==="number"?format(val):val}</strong>
            </div>)}
          </div>
          {search.previous && (search.previous.impressions||0)>0 && <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#597761]">
            <span>Appearances: {changeLabel(search.impressions||0,search.previous.impressions)}</span>
            {(search.previous.clicks||0)>0 && <span>Clicks: {changeLabel(search.clicks||0,search.previous.clicks)}</span>}
          </div>}
          <div className="mt-3 grid gap-2.5 lg:grid-cols-[1fr_1fr_1.3fr] lg:gap-4">
          <div className="min-w-0 border-t border-[#E7DFDB] pt-2.5 lg:border-t-0 lg:border-r lg:pr-4 lg:pt-0">
            <h4 className="font-heading text-[16px] font-medium text-[#1F3125]">How guests find you on Google</h4>
            <p className="mt-0.5 font-body text-[11px] leading-[1.35] text-[#6D6057]">Search appearances by query</p>
            <div className="mt-1 divide-y divide-[#EEE8E4]">
              {(search.queries||[]).filter(q=>q.impressions>0).slice(0,10).map(q=><div key={q.query} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-1.5 text-[12px] leading-[1.4]">
                <span className="min-w-0 overflow-wrap-anywhere break-words text-[#1F3125]">{q.query}</span><span className="shrink-0 tabular-nums text-[#6D6057]">{format(q.impressions)}</span>
              </div>)}
              {!search.queries?.length && <p className="py-2 text-[12px] text-[#6D6057]">Search terms will appear once Google has enough data.</p>}
            </div>
          </div>
          <div className="min-w-0 border-t border-[#E7DFDB] pt-2.5 lg:border-t-0 lg:border-r lg:pr-4 lg:pt-0">
            <h4 className="font-heading text-[16px] font-medium text-[#1F3125]">Where you rank on Google</h4>
            <p className="mt-0.5 font-body text-[11px] leading-[1.35] text-[#6D6057]">Average position by query</p>
            <div className="mt-1 divide-y divide-[#EEE8E4]">
              {[...(search.queries||[])].filter(q=>q.impressions>0&&q.position>0).sort((a,b)=>a.position-b.position).slice(0,10).map(q=><div key={q.query} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-1.5 text-[12px] leading-[1.4]">
                <span className="min-w-0 overflow-wrap-anywhere break-words text-[#1F3125]">{q.query}</span><span className="shrink-0 font-medium tabular-nums text-[#597761]">{q.position.toFixed(1)}</span>
              </div>)}
            </div>
          </div>
          <div className="min-w-0 border-t border-[#E7DFDB] pt-2.5 lg:border-t-0 lg:pt-0">
            <h4 className="font-heading text-[16px] font-medium text-[#1F3125]">Pages appearing in Google</h4>
            <p className="mt-0.5 font-body text-[11px] leading-[1.35] text-[#6D6057]">Organic search landing pages</p>
            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_40px_40px_46px] gap-1 text-[10px] text-[#80766E]">
              <span>Page</span><span className="text-right">Clicks</span><span className="text-right">Views</span><span className="text-right">Rank</span>
            </div>
            <div className="mt-1 divide-y divide-[#EEE8E4]">
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
          <p className="mt-1.5 text-[10px] leading-snug text-[#80766E]">Google data through {search.endDate} · Positions are averages.</p>
        </>}
      </section>}
    {data?.connected && <p className="px-1 text-[11px] leading-snug text-[#6D6057]">Site totals may include historical workspace visits.</p>}
  </div>;
}
