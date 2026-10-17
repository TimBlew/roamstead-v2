import { NextRequest, NextResponse } from "next/server";
import { createSign } from "node:crypto";
import { adminAuthenticated } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
const site = "sc-domain:roamstead-co.com";
const headers = { "Cache-Control": "private, no-store" };
async function token() {
 const email=process.env.ROAMSTEAD_GSC_CLIENT_EMAIL, key=process.env.ROAMSTEAD_GSC_PRIVATE_KEY?.replace(/\\n/g,"\n");
 if(!email||!key)return null;
 const now=Math.floor(Date.now()/1000), enc=(s:string)=>Buffer.from(s).toString("base64url");
 const input=enc(JSON.stringify({alg:"RS256",typ:"JWT"}))+"."+enc(JSON.stringify({iss:email,scope:"https://www.googleapis.com/auth/webmasters.readonly",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3500}));
 const signer=createSign("RSA-SHA256");signer.update(input);signer.end();
 const resp=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:input+"."+signer.sign(key).toString("base64url")}),cache:"no-store",signal:AbortSignal.timeout(9000)});
 if(!resp.ok)throw Error("Google authentication failed");
 return (await resp.json() as {access_token:string}).access_token;
}
type Row={keys?:string[];clicks?:number;impressions?:number;ctr?:number;position?:number};
async function query(access:string,startDate:string,endDate:string,dimensions:string[],rowLimit:number):Promise<Row[]>{
 const resp=await fetch("https://www.googleapis.com/webmasters/v3/sites/"+encodeURIComponent(site)+"/searchAnalytics/query",{method:"POST",headers:{Authorization:"Bearer "+access,"Content-Type":"application/json"},body:JSON.stringify({startDate,endDate,dimensions,rowLimit,type:"web"}),cache:"no-store",signal:AbortSignal.timeout(12000)});
 if(!resp.ok)throw Error("GSC status "+resp.status);
 return (await resp.json() as {rows?:Row[]}).rows||[];
}
export async function GET(request:NextRequest){
 if(!await adminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401,headers});
 const n=Number(request.nextUrl.searchParams.get("days")),days=n===7||n===90?n:30;
 const end=new Date(Date.now()-3*86400000),start=new Date(end.getTime()-(days-1)*86400000),date=(d:Date)=>d.toISOString().slice(0,10);
 try{
  const access=await token();
  if(!access)return NextResponse.json({connected:false,message:"Search Console reporting credentials are not configured yet."},{headers});
  const [totals,queries,pages]=await Promise.all([query(access,date(start),date(end),[],1),query(access,date(start),date(end),["query"],8),query(access,date(start),date(end),["page"],5)]);
  const total=totals[0]||{};
  return NextResponse.json({connected:true,startDate:date(start),endDate:date(end),clicks:total.clicks||0,impressions:total.impressions||0,ctr:total.ctr||0,position:total.position||0,queries:queries.map(r=>({query:r.keys?.[0]||"",clicks:r.clicks||0})),pages:pages.map(r=>({page:r.keys?.[0]||"",clicks:r.clicks||0}))},{headers});
 }catch{return NextResponse.json({connected:false,message:"Search Console data unavailable. Check the reporting service account and property access."},{headers});}
}