import { NextRequest, NextResponse } from "next/server";
import { adminAuthenticated } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
type ResendContact={ id:string; email:string; created_at:string; unsubscribed?:boolean; properties?:Record<string,unknown> };
export async function GET(req:NextRequest){
  if(!await adminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401,headers:{"Cache-Control":"private, no-store"}});
  const token=process.env.RESEND_CONTACTS_API_KEY;
  const segment=process.env.RESEND_ROAMSTEAD_SEGMENT_ID;
  if(!token||!segment)return NextResponse.json({connected:false,message:"Resend contacts are not configured. Check the contact-management key and Roamstead segment."},{headers:{"Cache-Control":"private, no-store"}});
  const after=req.nextUrl.searchParams.get("after")||"";
  if(after.length>150)return NextResponse.json({error:"Invalid cursor"},{status:400});
  const url=new URL("https://api.resend.com/segments/"+encodeURIComponent(segment)+"/contacts");
  url.searchParams.set("limit","50");
  if(after)url.searchParams.set("after",after);
  try{
    const response=await fetch(url,{headers:{Authorization:"Bearer "+token},cache:"no-store",signal:AbortSignal.timeout(10000)});
    if(!response.ok){
      console.error("Roamstead contact directory fetch failed",response.status);
      return NextResponse.json({connected:false,message:"Unable to load stored contacts from Resend. Review the contacts API key permissions."},{status:502,headers:{"Cache-Control":"private, no-store"}});
    }
    const payload=await response.json() as {data?:ResendContact[];has_more?:boolean};
    const contacts=await Promise.all((payload.data||[]).map(async c=>{
      try {
        const detail=await fetch("https://api.resend.com/contacts/"+encodeURIComponent(c.id),{headers:{Authorization:"Bearer "+token},cache:"no-store",signal:AbortSignal.timeout(8000)});
        if(!detail.ok){console.error("Roamstead contact preferences lookup failed",detail.status);return {...c,properties:c.properties||{},preferencesUnavailable:true};}
        const full=await detail.json() as ResendContact;
        return {...c,properties:full.properties||c.properties||{},preferencesUnavailable:false};
      }catch{console.error("Roamstead contact preferences lookup unavailable");return {...c,properties:c.properties||{},preferencesUnavailable:true};}
    }));
    const entries=contacts.map(c=>({
      id:c.id,email:c.email,createdAt:c.created_at,unsubscribed:Boolean(c.unsubscribed),
      preferencesUnavailable:Boolean(c.preferencesUnavailable),
      season:typeof c.properties?.roamstead_season==="string"?c.properties.roamstead_season:"",
      home:typeof c.properties?.roamstead_home_area==="string"?c.properties.roamstead_home_area:""
    }));
    return NextResponse.json({connected:true,entries,hasMore:Boolean(payload.has_more),nextCursor:payload.has_more?entries.at(-1)?.id||null:null},{headers:{"Cache-Control":"private, no-store"}});
  }catch(e){
    console.error("Roamstead directory request failed",e instanceof Error?e.message:"unknown");
    return NextResponse.json({connected:false,message:"Contact directory is temporarily unavailable."},{status:502,headers:{"Cache-Control":"private, no-store"}});
  }
}
