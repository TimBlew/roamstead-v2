import "server-only";
import { createSign } from "node:crypto";
const SCOPE="https://www.googleapis.com/auth/spreadsheets";
const sheetId="1I8c3eefg2R0brmbxSqoyT-JIVqt8ydbZsi4Lz3BWiRo";
const range="Submissions!A:K";
export type SignupRecord={id:string;createdAt:string;email:string;season:string;home:string;consent:boolean;notificationStatus:string;contactStatus:string;contactId:string;source:string;updatedAt:string};
export function sheetConfigured(){return Boolean(process.env.ROAMSTEAD_SHEETS_CLIENT_EMAIL && process.env.ROAMSTEAD_SHEETS_PRIVATE_KEY)}
async function accessToken(){
 const email=process.env.ROAMSTEAD_SHEETS_CLIENT_EMAIL;
 const privateKey=process.env.ROAMSTEAD_SHEETS_PRIVATE_KEY?.replace(/\\n/g,"\n");
 if(!email||!privateKey)throw Error("Google Sheets service credentials not configured");
 const now=Math.floor(Date.now()/1000);
 const encode=(o:object)=>Buffer.from(JSON.stringify(o)).toString("base64url");
 const header=encode({alg:"RS256",typ:"JWT"}),body=encode({iss:email,scope:SCOPE,aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600});
 const signer=createSign("RSA-SHA256");signer.update(header+"."+body);signer.end();
 const assertion=header+"."+body+"."+signer.sign(privateKey,"base64url");
 const response=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion}),cache:"no-store",signal:AbortSignal.timeout(9000)});
 if(!response.ok)throw Error("Google Sheets authentication failed "+response.status);
 const result=await response.json() as {access_token?:string};
 if(!result.access_token)throw Error("Google Sheets did not return an access token");
 return result.access_token;
}
async function googleRequest(url:string,opts:RequestInit={}){
 const token=await accessToken();
 const response=await fetch(url,{...opts,headers:{"Authorization":"Bearer "+token,...opts.headers},cache:"no-store",signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw Error("Google Sheets request failed "+response.status);
 return response.json();
}
export async function appendSignup(record:SignupRecord){
 const url="https://sheets.googleapis.com/v4/spreadsheets/"+sheetId+"/values/"+encodeURIComponent(range)+":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS";
 await googleRequest(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({majorDimension:"ROWS",values:[[record.id,record.createdAt,record.email,record.season,record.home,record.consent?"Yes":"No",record.notificationStatus,record.contactStatus,record.contactId,record.source,record.updatedAt]]})});
}
export async function readSignups():Promise<SignupRecord[]>{
 const url="https://sheets.googleapis.com/v4/spreadsheets/"+sheetId+"/values/"+encodeURIComponent(range)+"?valueRenderOption=UNFORMATTED_VALUE";
 const data=await googleRequest(url) as {values?:unknown[][]};
 return (data.values||[]).slice(1).filter(r=>typeof r[0]==="string"&&typeof r[2]==="string").map(r=>({
 id:String(r[0]||""),createdAt:String(r[1]||""),email:String(r[2]||""),season:String(r[3]||""),home:String(r[4]||""),consent:String(r[5]||"").toLowerCase()==="yes",notificationStatus:String(r[6]||""),contactStatus:String(r[7]||""),contactId:String(r[8]||""),source:String(r[9]||""),updatedAt:String(r[10]||"")
 }));
}
