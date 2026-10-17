import { NextRequest, NextResponse } from "next/server";
import { adminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
const projectId = "prj_CjF9I7Fk1MyrSkKgcPAPogf6NAvD";
const endpoint = "https://api.vercel.com/v1/query/web-analytics";
const teamId = "team_GQt5Mp5AL3n7sjv7QSTNQPig";
async function query(token:string,resource:string,params:Record<string,string>){
  const u=new URL(endpoint+resource);
  for(const [key,value] of Object.entries({...params,projectId,teamId}))u.searchParams.set(key,value);
  const r=await fetch(u,{headers:{Authorization:`Bearer ${token}`},cache:"no-store",signal:AbortSignal.timeout(9000)});
  if(!r.ok)throw new Error("Analytics API unavailable: "+r.status);
  return r.json();
}
type Daily = {timestamp?:string;visitors?:number;pageviews?:number};
const DAY = 86400000;
const iso = (d:Date) => d.toISOString().slice(0,10);
const utcDay = (date:string) => new Date(date.slice(0,10)+"T00:00:00.000Z");
async function dailyRows(token:string,start:Date,end:Date) {
  const windows:{since:string;until:string}[]=[];
  for(let cursor=start.getTime();cursor<end.getTime();cursor+=50*DAY){
    windows.push({since:new Date(cursor).toISOString(),until:new Date(Math.min(cursor+50*DAY,end.getTime())).toISOString()});
  }
  const batches=await Promise.all(windows.map(w=>query(token,"/visits/aggregate",{...w,by:"day",limit:"100"})));
  const byDay=new Map<string,Daily>();
  for(const batch of batches)for(const row of (batch.data||[]) as Daily[]){
    if(!row.timestamp)continue;
    const date=row.timestamp.slice(0,10);
    const previous=byDay.get(date);
    // Shared boundary dates can be returned by neighboring windows.
    // Retain the newer result instead of counting the boundary twice.
    if(!previous || (row.timestamp||"")>=(previous.timestamp||""))byDay.set(date,{...row,timestamp:date});
  }
  return [...byDay.values()].sort((a,b)=>(a.timestamp||"").localeCompare(b.timestamp||""));
}
function weeklySeries(rows:Daily[],now:Date){
  const map=new Map(rows.map(d=>[d.timestamp?.slice(0,10)||"",d]));
  const first=rows.find(d=>(d.pageviews||0)>0 || (d.visitors||0)>0)?.timestamp;
  if(!first)return {weeks:[],current:null};
  const firstDay=utcDay(first);
  const firstSunday=new Date(firstDay);
  firstSunday.setUTCDate(firstSunday.getUTCDate()+((7-firstSunday.getUTCDay())%7));
  const today=utcDay(iso(now));
  const currentSunday=new Date(today);
  currentSunday.setUTCDate(currentSunday.getUTCDate()-currentSunday.getUTCDay());
  const weeks:{start:string;end:string;visitors:number}[]=[];
  for(let cursor=firstSunday.getTime();cursor+6*DAY<currentSunday.getTime();cursor+=7*DAY){
    let visitors=0;
    for(let i=0;i<7;i++)visitors+=map.get(iso(new Date(cursor+i*DAY)))?.visitors||0;
    weeks.push({start:iso(new Date(cursor)),end:iso(new Date(cursor+6*DAY)),visitors});
  }
  // The partial launch week isn't a completed week, but the current week should
  // always be visible as a live outlined point even before the first Sunday.
  let currentVisitors=0;
  for(let cursor=currentSunday.getTime();cursor<=today.getTime();cursor+=DAY)
    currentVisitors+=map.get(iso(new Date(cursor)))?.visitors||0;
  return {weeks,current:{start:iso(currentSunday),end:iso(today),visitors:currentVisitors}};
}
export async function GET(req:NextRequest){
  if(!await adminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});
  const token=process.env.ROAMSTEAD_ANALYTICS_VERCEL_TOKEN;
  if(!token)return NextResponse.json({connected:false,message:"Vercel reporting token not yet configured. The external Analytics dashboard remains available."},{headers:{"Cache-Control":"private, no-store"}});
  const days=Number(req.nextUrl.searchParams.get("days"));
  const range=days===7||days===90||days===365?days:30;
  const now=new Date(), since=new Date(now.getTime()-range*DAY).toISOString(),until=now.toISOString();
  const previousSince=new Date(now.getTime()-2*range*DAY).toISOString();
  try{
    const [visits,events,pages,referrers,devices,yearRows,previous]=await Promise.all([
      dailyRows(token,new Date(since),now),
      query(token,"/events/aggregate",{since,until,by:"eventName",limit:"30"}),
      query(token,"/visits/aggregate",{since,until,by:"requestPath",limit:"15"}),
      query(token,"/visits/aggregate",{since,until,by:"referrerHostname",limit:"12"}),
      query(token,"/visits/aggregate",{since,until,by:"deviceType",limit:"8"}),
      dailyRows(token,new Date(now.getTime()-364*DAY),new Date(now.getTime()+DAY)).catch(() => null),
      Promise.all([
        dailyRows(token,new Date(previousSince),new Date(since)),
        query(token,"/visits/aggregate",{since:previousSince,until:since,by:"requestPath",limit:"15"}),
        query(token,"/visits/aggregate",{since:previousSince,until:since,by:"referrerHostname",limit:"12"}),
        query(token,"/visits/aggregate",{since:previousSince,until:since,by:"deviceType",limit:"8"})
      ]).then(([daily,p,r,d])=>({visits:daily,pages:p.data||[],referrers:r.data||[],devices:d.data||[]})).catch(()=>null)
    ]);
    return NextResponse.json({connected:true,period:`Past ${range} days`,visits,previous,weekly:weeklySeries(yearRows || visits,now),weeklyError:yearRows ? undefined : "Full-year history is temporarily unavailable; showing the available reporting period.",events:events.data||[],pages:pages.data||[],referrers:referrers.data||[],devices:devices.data||[]},{headers:{"Cache-Control":"private, no-store"}});
  }catch{return NextResponse.json({connected:false,message:"Unable to retrieve Vercel Analytics data. Check the reporting token permissions and Vercel API access."},{headers:{"Cache-Control":"private, no-store"}})}
}
