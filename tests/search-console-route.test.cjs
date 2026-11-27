const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const vm=require('node:vm');
(async()=>{
 const periods=await import('../src/lib/analytics-period.ts');
 const analytics=await import('../src/lib/admin-analytics.ts');
 const source=ts.transpileModule(fs.readFileSync('src/app/admin/api/search-console/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 async function run(days,{authorized=true,oidc=true,fail=''}={}){
  const exports={},calls=[];
  vm.runInNewContext(source,{exports,URL,URLSearchParams,Date,AbortSignal,console:{error(){}},require(name){
   if(name==='next/server')return {NextResponse:{json:(body,options)=>({body,...options})}};
   if(name==='@/lib/admin-auth')return {adminAuthenticated:async()=>authorized};
   if(name==='@/lib/site')return {canonical:p=>'https://www.roamstead-co.com'+p,launchIndexingEnabled:true};
   if(name==='@/lib/analytics-period')return periods;
   if(name==='@/lib/admin-analytics')return analytics;
   throw Error(name);
  },fetch:async(url,options)=>{
   calls.push({url,options});
   if(fail==='network')throw Error('private diagnostic must not escape');
   const auth=url.includes('sts.googleapis'),impersonation=url.includes('iamcredentials');
   const failed=(fail==='federation'&&auth)||(fail==='permission'&&impersonation)||(fail==='query'&&!auth&&!impersonation)||(fail==='previous'&&calls.length===6);
   return {ok:!failed,status:403,json:async()=>failed?{error:{status:'PERMISSION_DENIED'}}:auth?{access_token:'fixture'}:impersonation?{accessToken:'fixture'}:{rows:[]}};
  }});
  const result=await exports.GET({nextUrl:new URL('http://fixture/admin/api/search-console?days='+days),headers:{get:()=>oidc?'fixture':null}});
  return {result,calls};
 }
 for(const days of [7,30,90,365]){
  const {result,calls}=await run(days);
  assert.equal(result.body.connected,true);assert.equal(result.body.clicks,0);assert.equal(result.body.impressions,0);
  assert.equal(calls.length,6);assert.equal(result.headers['Cache-Control'],'private, no-store');
  assert.equal((Date.parse(result.body.endDate)-Date.parse(result.body.startDate))/86400000,days-1);
 }
 for(const fail of ['network','federation','permission','query']){
  const {result,calls}=await run(7,{fail});assert.equal(result.body.connected,false);
  assert.equal(result.body.clicks,undefined);assert.ok(result.body.message);assert.ok(calls.length<=6);
  assert.equal(JSON.stringify(result).includes('private diagnostic'),false);
 }
 const previous=await run(7,{fail:'previous'});assert.equal(previous.result.body.connected,true);assert.equal(previous.result.body.previous,null);
 const missing=await run(7,{oidc:false});assert.equal(missing.result.body.connected,false);assert.equal(missing.calls.length,0);
 const denied=await run(7,{authorized:false});assert.equal(denied.result.status,401);assert.equal(denied.calls.length,0);
 console.log('PASS: GSC zero, missing identity, federation/permission/query/network failures, optional comparison, all periods and request budgets');
})().catch(error=>{console.error(error);process.exitCode=1;});
