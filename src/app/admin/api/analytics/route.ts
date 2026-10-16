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
export async function GET(req:NextRequest){
  if(!await adminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});
  const token=process.env.ROAMSTEAD_ANALYTICS_VERCEL_TOKEN;
  if(!token)return NextResponse.json({connected:false,message:"Vercel reporting token not yet configured. The external Analytics dashboard remains available."},{headers:{"Cache-Control":"private, no-store"}});
  const days=Number(req.nextUrl.searchParams.get("days"));
  const range=days===7||days===90?days:30;
  const since=new Date(Date.now()-range*86400000).toISOString(),until=new Date().toISOString();
  try{
    const [visits,events,pages,referrers,devices]=await Promise.all([
      query(token,"/visits/aggregate",{since,until,by:"day",limit:"40"}),
      query(token,"/events/aggregate",{since,until,by:"eventName",limit:"30"}),
      query(token,"/visits/aggregate",{since,until,by:"requestPath",limit:"15"}),
      query(token,"/visits/aggregate",{since,until,by:"referrerHostname",limit:"12"}),
      query(token,"/visits/aggregate",{since,until,by:"deviceType",limit:"8"})
    ]);
    return NextResponse.json({connected:true,period:`Past ${range} days`,visits:visits.data||[],events:events.data||[],pages:pages.data||[],referrers:referrers.data||[],devices:devices.data||[]},{headers:{"Cache-Control":"private, no-store"}});
  }catch{return NextResponse.json({connected:false,message:"Unable to retrieve Vercel Analytics data. Check the reporting token permissions and Vercel API access."},{headers:{"Cache-Control":"private, no-store"}})}
}
