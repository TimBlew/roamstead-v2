const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
(async()=>{
 const periods=await import(pathToFileURL(process.cwd()+'/src/lib/analytics-period.ts'));
 const analytics=await import(pathToFileURL(process.cwd()+'/src/lib/admin-analytics.ts'));
 const source=ts.transpileModule(fs.readFileSync('src/app/admin/api/analytics/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 async function run(days,{authorized=true,token='fixture',fail='',reservations={available:true,count:0,revenue:{},byListing:{}}}={}) {
  const calls=[],reservationCalls=[],exports={};
  const context={exports,URL,Date,AbortSignal,console:{warn(){},error(){}},process:{env:{ROAMSTEAD_ANALYTICS_VERCEL_TOKEN:token}},require(name){
   if(name==='next/server')return {NextResponse:{json:(body,options)=>({body,...options})}};
   if(name==='@/lib/admin-auth')return {adminAuthenticated:async()=>authorized};
   if(name==='@/lib/analytics-period')return periods;
   if(name==='@/lib/admin-analytics')return analytics;
   if(name==='@/lib/hostaway-reservations')return {websiteReservations:async(...args)=>{reservationCalls.push(args);return reservations;}};
   throw Error(name);
  },fetch:async(url)=>{
   calls.push(url); const event=url.pathname.includes('/events/');
   if(fail==='all'||(fail==='events'&&event))throw Error('fixture unavailable');
   return {ok:true,json:async()=>fail==='malformed'?{unexpected:true}:{data:[event?{eventName:'hostaway_checkout_click',count:2,visitors:1}:{visitors:3,pageviews:4}]}};
  }};
  vm.runInNewContext(source,context);
  return {result:await exports.GET({nextUrl:new URL('http://localhost/admin/api/analytics?days='+days)}),calls,reservationCalls};
 }
 for(const days of [7,30,90,365]) {
  const {result,calls,reservationCalls}=await run(days);
  assert.equal(result.body.connected,true);
  assert.equal(result.body.chart.length,periods.chartWindows(days).length);
  assert.equal(result.body.verifiedReservations.count,0);
  assert.equal(reservationCalls[0][0],result.body.reporting.since);
  assert.equal(reservationCalls[0][1],result.body.reporting.until);
  assert.equal(calls[0].searchParams.get('by'),'environment');
  assert.equal(calls[0].searchParams.get('since'),result.body.reporting.since);
  for(const u of calls){
   assert.match(u.searchParams.get('filter'),/environment eq 'production'/);
   assert.match(u.searchParams.get('filter'),/requestPath ne '\/admin'/);
   if(u.pathname.includes('/events/'))assert.match(u.searchParams.get('filter'),/pr20_live_check/);
  }
  const isHeadline=u=>u.searchParams.get('by')==='environment' && u.searchParams.get('since')===result.body.reporting.since && Date.parse(u.searchParams.get('until'))+1===Date.parse(result.body.reporting.until);
  assert.equal(calls.filter(isHeadline).length,1);
  const chartCalls=calls.filter(u=>u.searchParams.get('by')==='environment'&&!isHeadline(u)).sort((a,b)=>a.searchParams.get('since').localeCompare(b.searchParams.get('since')));
  for(let i=1;i<chartCalls.length;i++)assert.equal(Date.parse(chartCalls[i-1].searchParams.get('until'))+1,Date.parse(chartCalls[i].searchParams.get('since')));
 }
 for(const fail of ['all','malformed'])assert.equal((await run(7,{fail})).result.body.connected,false);
 const failedEvents=(await run(7,{fail:'events'})).result.body;
 assert.equal(failedEvents.connected,true);assert.equal(failedEvents.eventsAvailable,false);assert.equal(failedEvents.inferredAcquisitionSource,null);
 assert.equal((await run(7,{reservations:{available:false}})).result.body.verifiedReservations.available,false);
 const unavailable=(await run(7,{token:''})).result.body;assert.equal(unavailable.connected,false);assert.equal(unavailable.verifiedReservations.available,true);
 const denied=await run(7,{authorized:false});assert.equal(denied.result.status,401);assert.equal(denied.calls.length,0);assert.equal(denied.reservationCalls.length,0);
 console.log('PASS: all reporting periods, query boundaries/filters, optional failures, zero reservations, auth isolation');
})().catch(e=>{console.error(e);process.exitCode=1;});
