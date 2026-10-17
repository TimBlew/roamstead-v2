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
  const first=rows.find(d=>(d.pageviews||0)>0)?.timestamp;
  if(!first)return {weeks:[],current:null};
  const start=utcDay(first);
  start.setUTCDate(start.getUTCDate()+((7-start.getUTCDay())%7));
  const today=utcDay(iso(now));
  const weeks:{start:string;end:string;visitors:number}[]=[];
  let current:{start:string;end:string;visitors:number}|null=null;
  for(let cursor=start.getTime();cursor<=today.getTime();cursor+=7*DAY){
    let visitors=0;
    for(let i=0;i<7;i++)visitors+=map.get(iso(new Date(cursor+i*DAY)))?.visitors||0;
    const week={start:iso(new Date(cursor)),end:iso(new Date(cursor+6*DAY)),visitors};
    if(cursor+6*DAY<today.getTime())weeks.push(week);
    else {current={...week,end:iso(today)};break;}
  }
  return {weeks,current};
}
export async function GET(req:NextRequest){
  if(!await adminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});
  const token=process.env.ROAMSTEAD_ANALYTICS_VERCEL_TOKEN;
  if(!token)return NextResponse.json({connected:false,message:"Vercel reporting token not yet configured. The external Analytics dashboard remains available."},{headers:{"Cache-Control":"private, no-store"}});
  const days=Number(req.nextUrl.searchParams.get("days"));
  const range=days===7||days===90||days===365?days:30;
  const now=new Date(), since=new Date(now.getTime()-range*DAY).toISOString(),until=now.toISOString();
  try{
    const [visits,events,pages,referrers,devices,yearRows]=await Promise.all([
      dailyRows(token,new Date(since),now),
      query(token,"/events/aggregate",{since,until,by:"eventName",limit:"30"}),
      query(token,"/visits/aggregate",{since,until,by:"requestPath",limit:"15"}),
      query(token,"/visits/aggregate",{since,until,by:"referrerHostname",limit:"12"}),
      query(token,"/visits/aggregate",{since,until,by:"deviceType",limit:"8"}),
      dailyRows(token,new Date(now.getTime()-364*DAY),new Date(now.getTime()+DAY)).catch(() => null)
    ]);
    return NextResponse.json({connected:true,period:`Past ${range} days`,visits,weekly:yearRows ? weeklySeries(yearRows,now) : undefined,weeklyError:yearRows ? undefined : "Weekly visitor history is temporarily unavailable.",events:events.data||[],pages:pages.data||[],referrers:referrers.data||[],devices:devices.data||[]},{headers:{"Cache-Control":"private, no-store"}});
  }catch{return NextResponse.json({connected:false,message:"Unable to retrieve Vercel Analytics data. Check the reporting token permissions and Vercel API access."},{headers:{"Cache-Control":"private, no-store"}})}
}
