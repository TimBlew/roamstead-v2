import "server-only";
import { createHmac } from "node:crypto";
const SHEET_ID="1I8c3eefg2R0brmbxSqoyT-JIVqt8ydbZsi4Lz3BWiRo";
export type SignupRecord={id:string;createdAt:string;email:string;season:string;home:string;consent:boolean;notificationStatus:string;contactStatus:string;contactId:string;source:string;updatedAt:string};
export function sheetConfigured(){return Boolean(process.env.ROAMSTEAD_SHEETS_SCRIPT_URL?.startsWith("https://script.google.com/macros/s/") && (process.env.ROAMSTEAD_SHEETS_SHARED_SECRET||"").length>=32)}
async function request(action:"append"|"list",record?:SignupRecord){
 const url=process.env.ROAMSTEAD_SHEETS_SCRIPT_URL;
 const secret=process.env.ROAMSTEAD_SHEETS_SHARED_SECRET;
 if(!url||!secret||!sheetConfigured())throw new Error("Roamstead Sheets integration not configured");
 const payload=Buffer.from(JSON.stringify({action,record:record||null,ts:Date.now(),sheetId:SHEET_ID})).toString("base64url");
 const signature=createHmac("sha256",secret).update(payload).digest("base64url");
 const response=await fetch(url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({payload,signature}),cache:"no-store",redirect:"follow",signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw new Error("Roamstead Sheets bridge HTTP "+response.status);
 const data=await response.json() as {ok?:boolean;error?:string;records?:SignupRecord[];saved?:boolean};
 if(!data.ok)throw new Error("Roamstead Sheets bridge: "+(data.error||"unknown error"));
 return data;
}
export async function appendSignup(record:SignupRecord){const result=await request("append",record);if(!result.saved)throw Error("Roamstead Sheet did not confirm write")}
export async function readSignups(){const result=await request("list");if(!Array.isArray(result.records))throw Error("Invalid Roamstead Sheets records");return result.records}
