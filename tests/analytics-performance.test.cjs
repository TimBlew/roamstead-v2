// Offline route benchmark: no network, credentials, guest data or production calls.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const {performance} = require('node:perf_hooks');
(async () => {
 const periods = await import('../src/lib/analytics-period.ts');
 const analytics = await import('../src/lib/admin-analytics.ts');
 const fixed = '2026-11-27T02:00:00Z';
 class Clock extends Date { constructor(...args) { super(...(args.length ? args : [fixed])); } }
 const sources = {
  production: execFileSync('git',['show','da1410d:src/app/admin/api/analytics/route.ts'],{encoding:'utf8'}),
  initialDraft: execFileSync('git',['show','1593693:src/app/admin/api/analytics/route.ts'],{encoding:'utf8'}),
  revised: fs.readFileSync('src/app/admin/api/analytics/route.ts','utf8')
 };
 const originalPeriods = {};
 vm.runInNewContext(ts.transpileModule(execFileSync("git",["show","1593693:src/lib/analytics-period.ts"],{encoding:"utf8"}),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:originalPeriods,Date,Intl});
 const results = [];
 for (const latency of [100,250]) for (const days of [7,30,90,365]) for (const [version,source] of Object.entries(sources)) {
  let requests=0,active=0,peak=0,reservationCalls=0;
  const exports={};
  const wait=()=>new Promise(resolve=>setTimeout(resolve,latency));
  vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{
   exports,URL,Date:Clock,AbortSignal,console,process:{env:{ROAMSTEAD_ANALYTICS_VERCEL_TOKEN:'offline-fixture'}},
   require(name){
    if(name==='next/server')return {NextResponse:{json:body=>body}};
    if(name==='@/lib/admin-auth')return {adminAuthenticated:async()=>true};
    if(name==='@/lib/analytics-period')return version==='initialDraft'?originalPeriods:periods;
    if(name==='@/lib/admin-analytics')return analytics;
    if(name==='@/lib/hostaway-reservations')return {websiteReservations:async()=>{reservationCalls++;await wait();await wait();return {available:true,count:0,revenue:{},byListing:{}};}};
    throw Error(name);
   },
   fetch:async url=>{
    requests++;active++;peak=Math.max(peak,active);await wait();active--;
    return {ok:true,json:async()=>({data:[url.pathname.includes('/events/')?{eventName:'hostaway_checkout_click',count:0,visitors:0}:{timestamp:'2026-11-26',visitors:0,pageviews:0}]})};
   }
  });
  const start=performance.now();
  const body=await exports.GET({nextUrl:new URL('http://fixture/admin/api/analytics?days='+days)});
  const elapsedMs=Math.round(performance.now()-start);
  assert.equal(body.connected,true);assert.equal(reservationCalls,1);
  if(version==='revised'){
   assert.equal(requests,7+periods.chartWindows(days,new Clock()).length);
   assert.ok(requests<=21,'bounded query count');assert.ok(peak<=14,'bounded concurrency');
   assert.equal(body.verifiedReservations.count,0);
  }
  results.push({latency,days,version,requests,peak,elapsedMs});
 }
 console.table(results);
 for(const row of results.filter(r=>r.version==='revised')){
  const base=results.find(r=>r.version==='production'&&r.days===row.days&&r.latency===row.latency);
  assert.ok(row.elapsedMs<=base.elapsedMs*1.35+50,'no material controlled-latency regression');
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
