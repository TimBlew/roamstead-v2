"use client";
import { useEffect, useState } from "react";

type Daily = {timestamp?:string; visitors?:number; pageviews?:number; count?:number};
type Event = {eventName?:string; name?:string; count?:number; total?:number; visitors?:number};
type Payload = {connected?:boolean; message?:string; period?:string; visits?:Daily[]; events?:Event[]};
export default function AnalyticsPanel(){
  const [data,setData]=useState<Payload|null>(null);
  useEffect(()=>{fetch("/admin/api/analytics",{cache:"no-store"}).then(x=>x.json()).then(setData).catch(()=>setData({connected:false,message:"Reporting is temporarily unavailable."}));},[]);
  const days=data?.visits||[];
  const views=days.reduce((sum,day)=>sum+(day.pageviews||0),0);
  const events=data?.events||[];
  return <section className="mt-6 rounded-xl border border-[#D8CCC4] bg-[#FFFCFB] p-5 md:p-7">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="font-body text-[12px] font-semibold uppercase tracking-[.14em] text-[#4A6E57]">Performance</p><h2 className="mt-2 font-heading text-[28px]">Website activity</h2><p className="mt-2 font-body text-[13px] text-[#6D6057]">Live analytics for the last 30 days, excluding completed booking revenue.</p></div>
      <a className="rounded-lg border border-[#D8CCC4] px-4 py-3 font-body text-[13px] text-[#1F3125]" target="_blank" rel="noopener noreferrer" href="https://vercel.com/tim-blewitts-projects/roamstead-v2/analytics">Full analytics ↗</a>
    </div>
    {!data?<p className="mt-5 text-[14px]">Loading reporting...</p>:!data.connected?<p className="mt-6 rounded-lg bg-[#F4EFEC] p-4 font-body text-[14px] text-[#6D6057]">{data.message||"Analytics reporting is not connected yet."}</p>:<>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-[#F4EFEC] p-5"><p className="font-body text-[12px] text-[#6D6057]">Pageviews · 30 days</p><strong className="mt-2 block font-heading text-[32px] font-medium">{views.toLocaleString()}</strong></div>
        <div className="rounded-lg bg-[#F4EFEC] p-5"><p className="font-body text-[12px] text-[#6D6057]">Days with traffic</p><strong className="mt-2 block font-heading text-[32px] font-medium">{days.filter(d=>(d.pageviews||0)>0).length}</strong></div>
      </div>
      <h3 className="mt-6 font-heading text-[21px]">Visitor actions</h3>
      <div className="mt-3 divide-y divide-[#E7DFDB]">
        {events.length?events.map((event,i)=><div key={i} className="flex justify-between gap-4 py-3 font-body text-[13px]"><span className="break-all text-[#1F3125]">{event.eventName||event.name||"Event"}</span><span className="shrink-0 text-[#4A6E57]">{event.count??event.total??0}</span></div>):<p className="py-3 font-body text-[13px] text-[#6D6057]">No tracked actions in the selected period.</p>}
      </div>
    </>}
  </section>
}
