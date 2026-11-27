const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const vm=require('node:vm');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
(async()=>{
 const analytics=await import('../src/lib/admin-analytics.ts');
 const labels=await import('../src/lib/analytics-labels.ts');
 const periods=await import('../src/lib/analytics-period.ts');
 const code=ts.transpileModule(fs.readFileSync('src/components/admin/AnalyticsPanel.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
 function render(data,search,days=7){
  let i=0;const effects=[],requests=[],exports={};const states=['utm_source',days,data,search,null,false,null];
  vm.runInNewContext(code,{exports,URL,Intl,Date,AbortController,console,fetch:async(url,options)=>{requests.push({url,options});return {ok:true,json:async()=>({})};},require(name){
   if(name==='react')return {...React,useState:initial=>[i<states.length?states[i++]:initial,()=>{}],useMemo:f=>f(),useRef:()=>({current:null}),useEffect:f=>effects.push(f)};
   if(name==='react/jsx-runtime')return require(name);
   if(name==='@/lib/admin-analytics')return analytics;
   if(name==='@/lib/analytics-labels')return labels;
   throw Error(name);
  }});
  const html=renderToStaticMarkup(React.createElement(exports.default));
  const cleanup=effects.slice(0,3).map(f=>f());
  assert.equal(requests.length,3);assert.equal(requests.filter(r=>r.url.includes('inspection')).length,0);
  cleanup.forEach(f=>f?.());
  assert.equal(requests[0].options.signal.aborted,true);assert.equal(requests[1].options.signal.aborted,true);
  return html;
 }
 const zero={connected:true,visits:[],events:[],eventsAvailable:true,verifiedReservations:{available:true,count:0,revenue:{},byListing:{}}};
 const loading=render(null,null);assert.match(loading,/Loading…/);assert.match(loading,/Loading Google search data/);assert.doesNotMatch(loading,/Verified in Hostaway/);
 const valid=render(zero,{connected:true,clicks:0,impressions:0,queries:[],pages:[]});assert.match(valid,/Verified in Hostaway/);assert.match(valid,/Search clicks/);
 const unavailable=render({connected:false,verifiedReservations:{available:false}},{connected:false});assert.match(unavailable,/Temporarily unavailable/);assert.match(unavailable,/Google Search reporting is temporarily unavailable/);assert.doesNotMatch(unavailable,/Search clicks|Verified in Hostaway/);
 const independent=render({connected:false,verifiedReservations:{available:false}},{connected:true,clicks:12,queries:[],pages:[]});assert.match(independent,/Search clicks/);assert.match(independent,/>12</);
 const annual=render({...zero,chart:periods.chartWindows(365,new Date('2026-11-27T02:00:00Z')).map(w=>({...w,visitors:1}))},{connected:false},365);
 assert.match(annual,/Monthly visitor trend/);assert.match(annual,/current month is outlined/);assert.doesNotMatch(annual,/This week so far/);
 console.log('PASS: rendered loading/zero/unavailable, independent Google reporting, monthly labels, three initial requests, stale-request cancellation');
})().catch(error=>{console.error(error);process.exitCode=1;});
