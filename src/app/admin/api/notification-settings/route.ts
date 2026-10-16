import { NextRequest, NextResponse } from "next/server";
import { adminAuthenticated } from "@/lib/admin-auth";
import localSettings from "@/data/early-access-settings.json";

export const dynamic = "force-dynamic";
const FILE = "src/data/early-access-settings.json";
const GITHUB_URL = "https://api.github.com/repos/TimBlew/roamstead-v2/contents/" + FILE;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function reply(data:unknown,status=200){return NextResponse.json(data,{status,headers:{"Cache-Control":"private, no-store"}})}
function token(){return process.env.ROAMSTEAD_EDITOR_GITHUB_TOKEN||""}
function isSameOrigin(req:NextRequest){
 const origin=req.headers.get("origin");
 if(!origin)return false;
 try {const u=new URL(origin);return u.protocol==="https:"&&u.host===req.headers.get("host");}catch{return false;}
}
async function readCurrent(){
 const res=await fetch(GITHUB_URL+"?ref=main",{headers:{"Authorization":"Bearer "+token(),"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"},cache:"no-store",signal:AbortSignal.timeout(8000)});
 if(!res.ok)throw new Error("Settings read failed: "+res.status);
 const item=await res.json() as {sha:string;content:string};
 const data=JSON.parse(Buffer.from(item.content.replace(/\n/g,""),"base64").toString("utf8")) as {notificationEmail:string};
 if(!data.notificationEmail||!EMAIL.test(data.notificationEmail))throw new Error("Invalid saved recipient");
 return {sha:item.sha,email:data.notificationEmail};
}
export async function GET(){
 if(!await adminAuthenticated())return reply({error:"Unauthorized"},401);
 if(!token())return reply({email:localSettings.notificationEmail,editable:false,message:"Editor token unavailable."});
 try {const current=await readCurrent();return reply({email:current.email,editable:true});}
 catch{return reply({email:localSettings.notificationEmail,editable:false,message:"Unable to retrieve the latest notification setting."},503)}
}
export async function PUT(req:NextRequest){
 if(!await adminAuthenticated())return reply({error:"Unauthorized"},401);
 if(!isSameOrigin(req))return reply({error:"Origin verification failed."},403);
 if(!token())return reply({error:"Editor token unavailable."},503);
 let payload:{email?:unknown};
 try {payload=await req.json()}catch{return reply({error:"Invalid request."},400)}
 const email=typeof payload.email==="string"?payload.email.trim().toLowerCase():"";
 if(!email||email.length>254||!EMAIL.test(email)||/[<>\r\n]/.test(email))return reply({error:"Enter a valid email address."},400);
 try{
  const current=await readCurrent();
  if(email===current.email.toLowerCase())return reply({saved:true,email,unchanged:true,message:"This address is already saved."});
  const content=Buffer.from(JSON.stringify({notificationEmail:email},null,2)+"\n").toString("base64");
  const response=await fetch(GITHUB_URL,{method:"PUT",headers:{"Authorization":"Bearer "+token(),"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"},body:JSON.stringify({message:"Update Roamstead early access notification email",content,sha:current.sha,branch:"main"}),cache:"no-store",signal:AbortSignal.timeout(10000)});
  if(response.status===409||response.status===422)return reply({error:"The setting changed. Refresh and try again."},409);
  if(!response.ok){console.error("Roamstead notification setting update failed",response.status);return reply({error:"Unable to publish the new address."},503)}
  return reply({saved:true,email,message:"Saved. Vercel is deploying your new notification address."});
 }catch(e){console.error("Roamstead notification setting failed",e instanceof Error?e.message:"unknown");return reply({error:"Unable to save notification address."},503)}
}
