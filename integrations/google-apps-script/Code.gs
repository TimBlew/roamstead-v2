/**
 * Roamstead early access bridge.
 * Deploy as web app: Execute as Me, access Anyone.
 * Required Script Property: ROAMSTEAD_BRIDGE_SECRET, 32+ random characters.
 * This endpoint is public but every operation is authenticated with a short-lived HMAC.
 * Never log visitor email addresses or secret values.
 */
const SHEET_ID = "1I8c3eefg2R0brmbxSqoyT-JIVqt8ydbZsi4Lz3BWiRo";
const TAB = "Submissions";
const HEADERS = ["Submission ID","Submitted at (UTC)","Email","Preferred season","Home area","Consent","Notification status","Contact sync status","Resend contact ID","Source","Last updated (UTC)"];
function respond(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)}
function safeString(s,max){return typeof s==="string"?s.slice(0,max):""}
function verify(request){
 const secret=PropertiesService.getScriptProperties().getProperty("ROAMSTEAD_BRIDGE_SECRET");
 if(!secret||secret.length<32)throw Error("Bridge secret not configured");
 const payload=safeString(request.payload,16000),signature=safeString(request.signature,100);
 if(!payload||!signature)throw Error("Missing signature");
 const bytes=Utilities.computeHmacSha256Signature(payload,secret);
 const expected=Utilities.base64EncodeWebSafe(bytes).replace(/=+$/,"");
 if(signature.length!==expected.length)throw Error("Invalid signature");
 let diff=0;for(let i=0;i<expected.length;i++)diff|=expected.charCodeAt(i)^signature.charCodeAt(i);
 if(diff!==0)throw Error("Invalid signature");
 const obj=JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(payload)).getDataAsString());
 if(obj.sheetId!==SHEET_ID||typeof obj.ts!=="number"||Math.abs(Date.now()-obj.ts)>300000)throw Error("Expired or invalid request");
 return obj;
}
function getSheet(){
 const sheet=SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB);
 if(!sheet)throw Error("Submissions tab missing");
 return sheet;
}
function cleanCell(value,max){return safeString(value,max).replace(/^[=+@\-\t\r]/,"' $&").replace(/[\r\n]/g," ")}
function doPost(e){
 try{
  const request=JSON.parse(e.postData.contents);
  const call=verify(request),sheet=getSheet();
  if(call.action==="append"){
   const r=call.record;
   if(!r||typeof r.id!=="string"||!/^[0-9a-f-]{36}$/i.test(r.id)||typeof r.email!=="string"||r.email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)||r.consent!==true)throw Error("Invalid submission");
   const lock=LockService.getScriptLock();
   if(!lock.tryLock(15000))throw Error("Write temporarily busy");
   try {
    const finder=sheet.createTextFinder(r.id).matchEntireCell(true);
    if(finder.findNext())return respond({ok:true,saved:true,duplicate:true});
    sheet.appendRow([cleanCell(r.id,60),cleanCell(r.createdAt,40),cleanCell(r.email,254),cleanCell(r.season,100),cleanCell(r.home,150),"Yes",cleanCell(r.notificationStatus,50),cleanCell(r.contactStatus,50),cleanCell(r.contactId,100),cleanCell(r.source,100),cleanCell(r.updatedAt,40)]);
    SpreadsheetApp.flush();
    return respond({ok:true,saved:true});
   }finally{lock.releaseLock()}
  }
  if(call.action==="list"){
   const rows=sheet.getDataRange().getValues().slice(1);
   const records=rows.filter(r=>r[0]&&r[2]).map(r=>({id:String(r[0]),createdAt:String(r[1]),email:String(r[2]),season:String(r[3]||""),home:String(r[4]||""),consent:String(r[5]).toLowerCase()==="yes",notificationStatus:String(r[6]||""),contactStatus:String(r[7]||""),contactId:String(r[8]||""),source:String(r[9]||""),updatedAt:String(r[10]||"")}));
   return respond({ok:true,records});
  }
  throw Error("Invalid action");
 }catch(err){
  const msg=err instanceof Error?err.message:"Request failed";
  return respond({ok:false,error:msg});
 }
}
