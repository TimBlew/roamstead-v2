"use client";
import { useEffect, useMemo, useState } from "react";


type Metric = { timestamp?:string; visitors?:number; pageviews?:number; count?:number; total?:number; eventName?:string; requestPath?:string; referrerHostname?:string; deviceType?:string; name?:string };
type Payload = { connected?:boolean; message?:string; visits?:Metric[]; events?:Metric[]; pages?:Metric[]; referrers?:Metric[]; devices?:Metric[] };
const actionNames:Record<string,string>={
  availability_dates_selected:"Dates selected",
  hostaway_checkout_click:"Continue to booking",
  early_access_submission_accepted:"Early-access signups"
};
const format=(n:number)=>new Intl.NumberFormat("en-US").format(n);
function value(row:Metric){return Number(row.pageviews??row.count??row.total??row.visitors??0)}
function MetricRows({title,items,keyName}: {title:string;items:Metric[];keyName:"requestPath"|"referrerHostname"|"deviceType"}){
  const sorted=[...items].sort((a,b)=>value(b)-value(a)).slice(0,7),max=Math.max(...sorted.map(value),1);
  return <section className="self-start rounded-xl border border-[#D8CCC4] bg-[#FFFCFB] p-4 md:p-5">
    <h3 className="mb-3 font-heading text-[20px]">{title}</h3>
    {sorted.length?sorted.map((item,i)=>{
      const raw=item[keyName]||"Direct / unknown";
      const label=keyName==="requestPath"?(raw==="/"?"Homepage":raw.replace("/properties/","Stay: ").replace("/book/","Book: ").replace("/properties","All stays").replace("/book","Book direct")):keyName==="deviceType"?raw==="mobile"?"Phone":raw==="desktop"?"Computer":raw:raw;
      return <div key={i} className="mb-2.5 last:mb-0"><div className="mb-1 flex justify-between gap-2 text-[13px]"><span className="min-w-0 break-words">{label}</span><span className="tabular-nums text-[#6D6057]">{format(value(item))}</span></div><div className="h-[5px] overflow-hidden rounded-full bg-[#EAE4E0]"><div className="h-full rounded-full bg-[#A3B8A8]" style={{width:`${Math.max(3,value(item)/max*100)}%`}}/></div></div>
    }):<p className="text-[13px] text-[#6D6057]">Nothing to show for these dates yet.</p>}
  </section>
}
export default function AnalyticsPanel(){
  const [days,setDays]=useState<7|30|90>(30),[data,setData]=useState<Payload|null>(null);
  useEffect(()=>{let active=true;setData(null);fetch(`/admin/api/analytics?days=${days}`,{cache:"no-store"}).then(r=>r.json()).then(x=>{if(active)setData(x)}).catch(()=>{if(active)setData({connected:false,message:"Reporting is temporarily unavailable."})});return()=>{active=false}},[days]);
  const daily=data?.visits||[],events=data?.events||[];
  const pageviews=useMemo(()=>daily.reduce((s,d)=>s+(d.pageviews||0),0),[daily]);
  const visits=useMemo(()=>daily.reduce((s,d)=>s+(d.visitors||0),0),[daily]);
  const clicks=events.filter(x=>x.eventName==="hostaway_checkout_click").reduce((s,x)=>s+value(x),0);
  const dateSelections=events.filter(x=>x.eventName==="availability_dates_selected").reduce((s,x)=>s+value(x),0);
  const max=Math.max(...daily.map(x=>x.pageviews||0),1);
  return <div className="space-y-3">
    <section className="rounded-xl border border-[#D8CCC4] bg-[#FFFCFB] p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="font-heading text-[24px]">At a glance</h2><p className="mt-1 font-body text-[13px] text-[#6D6057]">Explore site visits and booking interest. A checkout click shows interest, rather than a confirmed stay.</p></div>
        <label className="text-[12px] text-[#6D6057]">Period <select value={days} onChange={e=>setDays(Number(e.target.value) as 7|30|90)} className="ml-2 rounded-lg border border-[#D8CCC4] bg-white px-3 py-2.5 text-[13px] text-[#1F3125]"><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select></label>
      </div>
      {!data?<p className="mt-6 text-[14px] text-[#6D6057]">Gathering your latest numbers...</p>:!data.connected?<p className="mt-6 rounded-lg bg-[#F4EFEC] p-4 text-[14px] text-[#6D6057]">{data.message||"Your site insights are temporarily unavailable."}</p>:<>
        <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {[["Page views",pageviews],["Visitors",visits],["Booking clicks",clicks],["Dates selected",dateSelections]].map(([label,n])=><div key={label} className="rounded-lg bg-[#F4EFEC] px-3 py-2.5"><strong className="block font-heading text-[25px] font-medium tabular-nums">{format(Number(n))}</strong><span className="mt-1 block font-body text-[12px] text-[#6D6057]">{label}</span></div>)}
        </div>
        <h3 className="mt-4 font-heading text-[19px]">Visits over time</h3>
        <div className="mt-2 flex h-[68px] items-end gap-[3px]" aria-label="Visits over time bar chart">{daily.map((day,i)=><div key={day.timestamp||i} className="group relative min-w-0 flex-1 rounded-t-sm bg-[#9AB5A0] hover:bg-[#4A6E57]" title={`${day.timestamp?.slice(0,10)||"Day"}: ${day.pageviews||0} views`} style={{height:`${Math.max((day.pageviews||0)>0?5:0,(day.pageviews||0)/max*100)}%`}}/>)}</div>
        <div className="mt-2 flex justify-between text-[11px] text-[#6D6057]"><span>{daily[0]?.timestamp?.slice(0,10)||""}</span><span>{daily.at(-1)?.timestamp?.slice(0,10)||""}</span></div>
        <div className="mt-3 border-t border-[#E7DFDB] pt-3"><h3 className="font-heading text-[19px]">How guests explored your site</h3><div className="mt-1 divide-y divide-[#E7DFDB]">{events.length?events.map((e,i)=><div key={i} className="flex justify-between gap-4 py-2 text-[13px]"><span>{actionNames[e.eventName||""]||e.eventName||"Other action"}</span><strong className="font-medium tabular-nums">{format(value(e))}</strong></div>):<p className="py-3 text-[13px] text-[#6D6057]">No tracked actions yet.</p>}</div></div>
      </>}
    </section>
    {data?.connected&&<div className="grid items-start gap-3 md:grid-cols-2"><MetricRows title="Pages guests visit most" items={data.pages||[]} keyName="requestPath"/><MetricRows title="How guests found you" items={data.referrers||[]} keyName="referrerHostname"/><MetricRows title="Devices guests use" items={data.devices||[]} keyName="deviceType"/><section className="self-start rounded-xl border border-[#D8CCC4] bg-[#FFFCFB] p-4 md:p-5"><h3 className="font-heading text-[21px]">Google search</h3><p className="mt-3 text-[13px] leading-relaxed text-[#6D6057]">Search Console is verified. Query and ranking data will appear here after a secure reporting connection is added.</p><a className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#D8CCC4] px-3 py-2 text-[12px]" href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">Open Search Console <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6M20 4 10 14"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/></svg></a></section></div>}
    <div className="text-right"><a href="https://vercel.com/tim-blewitts-projects/roamstead-v2/analytics" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#4A6E57] underline underline-offset-4">Explore more insights <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6M20 4 10 14"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/></svg></a></div>
  </div>
}
