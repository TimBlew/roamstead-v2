import { NextRequest, NextResponse } from "next/server";
import { adminAuthenticated } from "@/lib/admin-auth";

import { websiteReservations } from "@/lib/hostaway-reservations";
import { chartWindows, reportingPeriod } from "@/lib/analytics-period";
import { analyticsQueryParams } from "@/lib/admin-analytics";

export const dynamic = "force-dynamic";
const projectId = "prj_CjF9I7Fk1MyrSkKgcPAPogf6NAvD";
const endpoint = "https://api.vercel.com/v1/query/web-analytics";
const teamId = "team_GQt5Mp5AL3n7sjv7QSTNQPig";
async function query(token:string,resource:string,params:Record<string,string|string[]>){
  const u=new URL(endpoint+resource);
  // Vercel rounds inclusive until up to the next hour; subtract 1ms at boundaries.
  const until = new Date(Date.parse(String(params.until)) - 1).toISOString();
  u.search = analyticsQueryParams(resource,{...params,until,projectId,teamId}).toString();
  const r=await fetch(u,{headers:{Authorization:`Bearer ${token}`},cache:"no-store",signal:AbortSignal.timeout(9000)});
  if(!r.ok)throw new Error("Analytics API unavailable: "+r.status);
  const payload = await r.json();
  const measure = resource === "/events/aggregate" ? "count" : "pageviews";
  if (!Array.isArray(payload.data) || payload.data.some((row:any) => !row || typeof row !== "object" || !Number.isFinite(row[measure]) || row[measure] < 0 || !Number.isFinite(row.visitors) || row.visitors < 0)) throw new Error("Malformed analytics response");
  return payload;
}
// Aggregate each calendar window directly. Summing hourly visitors double-counts people.
async function trafficWindows(token: string, range: number, now: Date) {
  const windows = chartWindows(range, now);
  const points: {start:string;end:string;visitors:number;pageviews:number;partial:boolean}[] = [];
  // Bound concurrent requests; annual reporting uses at most 13 monthly buckets.
  for (let i = 0; i < windows.length; i += 8) {
    points.push(...await Promise.all(windows.slice(i, i + 8).map(async w => {
      const result = await query(token, "/visits/aggregate", { since:w.since, until:w.until, by:"environment", limit:"100" });
      return { start:w.start, end:w.end, partial:w.partial, visitors:result.data.reduce((s:number,r:any)=>s+(r.visitors||0),0), pageviews:result.data.reduce((s:number,r:any)=>s+(r.pageviews||0),0) };
    })));
  }
  return points;
}
export async function GET(req:NextRequest){
  if(!await adminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});
  const token=process.env.ROAMSTEAD_ANALYTICS_VERCEL_TOKEN;
  const days=Number(req.nextUrl.searchParams.get("days"));
  const range=days===7||days===90||days===365?days:30;
  const now = new Date(), reporting = reportingPeriod(range, now);
  const { since, until } = reporting;
  const reservationResult = websiteReservations(since, until);
  if(!token)return NextResponse.json({connected:false,reporting,verifiedReservations:await reservationResult,message:"Website traffic is temporarily unavailable."},{headers:{"Cache-Control":"private, no-store"}});
  try{
    const chartResult = trafficWindows(token, range, now).then(value => ({value}), () => ({value:null}));
    const totals = await query(token,"/visits/aggregate",{since,until,by:"environment",limit:"100"});
    const visits = totals.data;
    // Keep essential traffic visible if a breakdown, event aggregation, or
    // independent historical query is temporarily unavailable.
    const acquisition = (dimension: string) => query(token, "/events/aggregate", {
      since, until, by: ["eventName", `eventData/${dimension}`], limit: "100",
      filter: "eventName in ('booking_page_view','booking_guest_step','hostaway_checkout_click','early_access_submission_accepted')",
    });
    const optional = await Promise.allSettled([
      query(token,"/events/aggregate",{since,until,by:"eventName",limit:"30"}),
      query(token,"/visits/aggregate",{since,until,by:"requestPath",limit:"15"}),
      query(token,"/visits/aggregate",{since,until,by:"referrerHostname",limit:"12"}),
      query(token,"/visits/aggregate",{since,until,by:"deviceType",limit:"8"}),
      chartResult.then(result => result.value),
      acquisition("utm_source"),
      acquisition("utm_campaign"),
      reservationResult
    ]);
    const available = (index:number) => optional[index].status==="fulfilled" ? (optional[index] as PromiseFulfilledResult<any>).value : null;
    const events=available(0), pages=available(1), referrers=available(2), devices=available(3);
    const points=available(4);
    optional.forEach((result,index) => {
      if(result.status==="rejected") console.warn("Roamstead analytics optional query failed",index,String(result.reason));
    });
    return NextResponse.json({connected:true,inferredAcquisitionSource:available(5)?.data ?? null,inferredAcquisitionCampaign:available(6)?.data ?? null,verifiedReservations:available(7) ?? {available:false},reporting,period:`Past ${range} days`,visits,chart:points,weeklyError:points ? undefined : "Visitor trend is temporarily unavailable.",events:events ? events.data||[] : null,eventsAvailable:events!==null,pages:pages ? pages.data||[] : null,pagesAvailable:pages!==null,referrers:referrers ? referrers.data||[] : null,referrersAvailable:referrers!==null,devices:devices ? devices.data||[] : null,devicesAvailable:devices!==null},{headers:{"Cache-Control":"private, no-store"}});
  }catch(error){
    const detail=error instanceof Error ? error.message : "Unknown analytics error";
    console.error("Roamstead analytics main query failed",detail);
    const accessDenied=/\b(401|403)\b/.test(detail);
    return NextResponse.json({connected:false,reporting,verifiedReservations:await reservationResult,message:accessDenied ? "Analytics reporting access needs attention. The reporting token may have expired or lost permission." : "Analytics reporting is temporarily unavailable. Please try again shortly."},{headers:{"Cache-Control":"private, no-store"}});
  }
}
