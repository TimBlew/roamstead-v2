import { NextRequest, NextResponse } from "next/server";
import { adminAuthenticated } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const site = "sc-domain:roamstead-co.com";
const headers = { "Cache-Control": "private, no-store" };
const serviceAccount = "roamstead-search-analytics@roamstead-website-operations.iam.gserviceaccount.com";
const provider = "//iam.googleapis.com/projects/708214299024/locations/global/workloadIdentityPools/roamstead-vercel/providers/roamstead-vercel-production";
async function token(request: NextRequest) {
 const oidc = request.headers.get("x-vercel-oidc-token");
 if (!oidc) return null;
 const exchange = await fetch("https://sts.googleapis.com/v1/token", {
  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    audience: provider,
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    requested_token_type: "urn:ietf:params:oauth:token-type:access_token",
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    subject_token: oidc,
    scope: "https://www.googleapis.com/auth/webmasters.readonly"
  }),
  cache: "no-store", signal: AbortSignal.timeout(10000)
 });
 if (!exchange.ok) throw Error("federation_exchange_" + exchange.status);
 const federated = await exchange.json() as { access_token?: string };
 if (!federated.access_token) throw Error("Google federation access token missing");
 const impersonation = await fetch("https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/" + encodeURIComponent(serviceAccount) + ":generateAccessToken", {
  method: "POST", headers: { Authorization: "Bearer " + federated.access_token, "Content-Type": "application/json" },
  body: JSON.stringify({ scope: ["https://www.googleapis.com/auth/webmasters.readonly"], lifetime: "1800s" }),
  cache: "no-store", signal: AbortSignal.timeout(10000)
 });
 if (!impersonation.ok) {
  const details = await impersonation.json().catch(() => null) as {error?: {status?:string; message?:string; details?: Array<{"@type"?:string;reason?:string}>}} | null;
  const reason = details?.error?.details?.find(d => d.reason)?.reason;
  const status = details?.error?.status;
  const safe = (reason || status || "unknown").replace(/[^A-Za-z0-9_]/g, "").slice(0, 80);
  throw Error("service_account_impersonation_" + impersonation.status + "_" + safe);
 }
 const result = await impersonation.json() as { accessToken?: string };
 if (!result.accessToken) throw Error("Google service account token missing");
 return result.accessToken;
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
  const access=await token(request);
  if(!access)return NextResponse.json({connected:false,message:"Production OIDC identity token is unavailable. Check Vercel federation configuration."},{headers});
  const [totals,queries,pages]=await Promise.all([query(access,date(start),date(end),[],1),query(access,date(start),date(end),["query"],8),query(access,date(start),date(end),["page"],5)]);
  const total=totals[0]||{};
  return NextResponse.json({connected:true,startDate:date(start),endDate:date(end),clicks:total.clicks||0,impressions:total.impressions||0,ctr:total.ctr||0,position:total.position||0,queries:queries.map(r=>({query:r.keys?.[0]||"",clicks:r.clicks||0})),pages:pages.map(r=>({page:r.keys?.[0]||"",clicks:r.clicks||0}))},{headers});
 }catch(error){ const raw=error instanceof Error ? error.message : "unknown"; const diagnostic=/^(federation_exchange|service_account_impersonation|search_console)_[0-9]{3}(?:_[A-Za-z0-9_]{1,80})?$/.test(raw) ? raw : "unexpected_error"; console.error("Roamstead Search Console reporting failed", diagnostic); return NextResponse.json({connected:false,diagnostic,message:"Google reporting connection is not yet ready ("+diagnostic.replaceAll("_"," ")+")."},{headers});}
}