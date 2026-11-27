// Module-aware regression harness; all external integrations are stubbed.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
(async()=>{
 const booking=await import('../src/lib/booking-analytics.ts'),inquiry=await import('../src/lib/inquiry-attribution.ts');
 const source=ts.transpileModule(fs.readFileSync('src/app/api/early-access/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 async function run({emailStatus=200,contactStatus=200,membershipStatus=200,sheetReady=true,appendFails=false,alertStatus=200,alertThrows=false,contactsConfigured=true,env=true,payload={email:'fixture@example.invalid',season:'Winter',home:'',consent:true,attribution:{utm_source:'parkcitysport',utm_campaign:'castlehead_sprint1'}}}={}){
  const calls=[],rows=[],errors=[],exports={};
  let emailCalls=0;
  const context={exports,URL,AbortSignal,Date,encodeURIComponent,console:{error(...args){errors.push(args)}},process:{env:env?{RESEND_API_KEY:'fixture',EARLY_ACCESS_FROM:'fixture@example.invalid',...(contactsConfigured?{RESEND_CONTACTS_API_KEY:'fixture',RESEND_ROAMSTEAD_SEGMENT_ID:'fixture'}:{})}:{}},require(name){
   if(name==='next/server')return {NextResponse:{json:(body,opts)=>({body,status:opts?.status||200})}};
   if(name==='@/lib/booking-analytics')return booking;
   if(name==='@/lib/inquiry-attribution')return inquiry;
   if(name==='node:crypto')return {randomUUID:()=> 'fixture-id'};
   if(name==='@/lib/signup-sheet')return {sheetConfigured:()=>sheetReady,appendSignup:async row=>{rows.push(row);if(appendFails)throw Error('private-provider-detail fixture@example.invalid')}};
   if(name==='@/data/early-access-settings.json')return {default:{notificationEmail:'fixture@example.invalid'}};
   throw Error(name);
  },fetch:async(url,options)=>{
   calls.push({url,options});
   const isAlert=url.endsWith('/emails') && ++emailCalls>1;
   if(isAlert && alertThrows)throw Error('private-provider-detail fixture@example.invalid');
   let status=url.endsWith('/emails')?(isAlert?alertStatus:emailStatus):url.endsWith('/contacts')?contactStatus:url.includes('/segments/')?membershipStatus:200;
   return {ok:status<300,status,json:async()=>({data:[{key:'roamstead_season'},{key:'roamstead_home_area'}]})};
  }};
  vm.runInNewContext(source,context);return {result:await exports.POST({json:async()=>payload}),calls,rows,errors};
 }
 const good=await run();assert.equal(good.result.body.audienceStored,true);assert.match(good.rows[0].source,/s=parkcitysport/);assert.match(JSON.parse(good.calls[0].options.body).text,/parkcitysport/);
 const duplicate=await run({contactStatus:409});assert.equal(duplicate.result.body.audienceStored,true);assert.equal('unsubscribed' in JSON.parse(duplicate.calls.at(-1).options.body),false);
 assert.equal((await run({contactStatus:500})).result.body.audienceStored,false);
 assert.equal((await run({contactStatus:409,membershipStatus:500})).result.body.audienceStored,false);
 const failure=await run({emailStatus:500});assert.equal(failure.result.status,502);assert.equal(failure.rows.length,0);
 assert.equal((await run({env:false})).result.status,503);
 const invalid=await run({payload:{email:'bad',consent:true}});assert.equal(invalid.result.status,400);assert.equal(invalid.calls.length,0);
 const emailBodies = run => run.calls.filter(call=>call.url.endsWith('/emails')).map(call=>JSON.parse(call.options.body));
 assert.equal(good.result.status,200);assert.equal(good.result.body.ok,true);assert.equal(good.result.body.ledgerStored,true);assert.equal(emailBodies(good).length,1);
 const notificationOnly=await run({contactsConfigured:false});assert.equal(notificationOnly.result.body.audienceStored,false);assert.equal(notificationOnly.result.body.ledgerStored,true);
 for(const options of [{appendFails:true},{sheetReady:false},{appendFails:true,contactStatus:500}]){
  const failed=await run(options);
  assert.equal(failed.result.status,200);assert.equal(failed.result.body.ok,true);assert.equal(failed.result.body.ledgerStored,false);
  const [notification,alert]=emailBodies(failed);assert.equal(emailBodies(failed).length,2);
  assert.deepEqual(notification,emailBodies(good)[0], 'Original notification must remain unchanged');
  assert.deepEqual(alert.to,notification.to);assert.equal(alert.from,notification.from);
  assert.equal(alert.subject,'Roamstead early-access ledger append failed');
  assert.match(alert.text,/Submission id: fixture-id/);assert.match(alert.text,/Timestamp \(UTC\): \d{4}-\d{2}-\d{2}T/);
  assert.ok(alert.text.includes(`Contact storage: ${failed.result.body.audienceStored?'confirmed':'unconfirmed'}`));
  assert.match(alert.text,/Email: fixture@example\.invalid/);assert.match(alert.text,/Roamstead early access signup/);
  assert.equal(failed.rows.length,options.sheetReady===false?0:1);
  if(failed.rows.length){assert.ok(alert.text.includes(failed.rows[0].createdAt));assert.equal(failed.rows[0].id,'fixture-id');}
  assert.ok(failed.errors.some(args=>/ledger (append failed|is not configured)/.test(args[0])));
  assert.doesNotMatch(JSON.stringify(failed.errors),/private-provider-detail|@/);
  assert.equal(failed.calls.at(-1).options.headers.Authorization,good.calls[0].options.headers.Authorization);
 }
 for(const options of [{alertStatus:500},{alertThrows:true}]){
  const failed=await run({appendFails:true,...options});
  assert.equal(failed.result.status,200);assert.equal(failed.result.body.ok,true);assert.equal(failed.result.body.ledgerStored,false);
  assert.equal(emailBodies(failed).length,2);
  assert.ok(failed.errors.some(args=>/ledger failure alert (rejected|could not be sent)/.test(args[0])));
  assert.doesNotMatch(JSON.stringify(failed.errors),/private-provider-detail|@/);
 }
 console.log('PASS: ledger success, append/configuration failures, alert rejection/network failure; signup success, attribution ledger, existing opt-out, provider/storage failures, validation; all integrations stubbed');
})().catch(error=>{console.error(error);process.exitCode=1});
