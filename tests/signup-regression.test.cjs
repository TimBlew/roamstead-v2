// Modern module-aware regression harness. The original failing legacy test stays unchanged.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
(async()=>{
 const booking=await import('../src/lib/booking-analytics.ts'),inquiry=await import('../src/lib/inquiry-attribution.ts');
 const source=ts.transpileModule(fs.readFileSync('src/app/api/early-access/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 async function run({emailStatus=200,contactStatus=200,membershipStatus=200,env=true,payload={email:'fixture@example.invalid',season:'Winter',home:'',consent:true,attribution:{utm_source:'parkcitysport',utm_campaign:'castlehead_sprint1'}}}={}){
  const calls=[],rows=[],exports={};
  const context={exports,URL,AbortSignal,Date,encodeURIComponent,console:{error(){}},process:{env:env?{RESEND_API_KEY:'fixture',EARLY_ACCESS_FROM:'fixture@example.invalid',RESEND_CONTACTS_API_KEY:'fixture',RESEND_ROAMSTEAD_SEGMENT_ID:'fixture'}:{}},require(name){
   if(name==='next/server')return {NextResponse:{json:(body,opts)=>({body,status:opts?.status||200})}};
   if(name==='@/lib/booking-analytics')return booking;
   if(name==='@/lib/inquiry-attribution')return inquiry;
   if(name==='node:crypto')return {randomUUID:()=> 'fixture-id'};
   if(name==='@/lib/signup-sheet')return {sheetConfigured:()=>true,appendSignup:async row=>rows.push(row)};
   if(name==='@/data/early-access-settings.json')return {default:{notificationEmail:'fixture@example.invalid'}};
   throw Error(name);
  },fetch:async(url,options)=>{
   calls.push({url,options});
   let status=url.endsWith('/emails')?emailStatus:url.endsWith('/contacts')?contactStatus:url.includes('/segments/')?membershipStatus:200;
   return {ok:status<300,status,json:async()=>({data:[{key:'roamstead_season'},{key:'roamstead_home_area'}]})};
  }};
  vm.runInNewContext(source,context);return {result:await exports.POST({json:async()=>payload}),calls,rows};
 }
 const good=await run();assert.equal(good.result.body.audienceStored,true);assert.match(good.rows[0].source,/s=parkcitysport/);assert.match(JSON.parse(good.calls[0].options.body).text,/parkcitysport/);
 const duplicate=await run({contactStatus:409});assert.equal(duplicate.result.body.audienceStored,true);assert.equal('unsubscribed' in JSON.parse(duplicate.calls.at(-1).options.body),false);
 assert.equal((await run({contactStatus:500})).result.body.audienceStored,false);
 assert.equal((await run({contactStatus:409,membershipStatus:500})).result.body.audienceStored,false);
 const failure=await run({emailStatus:500});assert.equal(failure.result.status,502);assert.equal(failure.rows.length,0);
 assert.equal((await run({env:false})).result.status,503);
 const invalid=await run({payload:{email:'bad',consent:true}});assert.equal(invalid.result.status,400);assert.equal(invalid.calls.length,0);
 console.log('PASS: signup success, attribution ledger, existing opt-out, provider/storage failures, validation; all integrations stubbed');
})().catch(error=>{console.error(error);process.exitCode=1});
