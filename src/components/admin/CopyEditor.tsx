"use client";
import { useEffect, useMemo, useState } from "react";

type Source = { sha?: string; copy?: Record<string,unknown>; editing?:boolean; message?:string; error?:string };
type Section = { title:string; fields: [string,string][] };
const sections:Record<"home"|"properties",Section[]> = {
 home:[
 {title:"Hero",fields:[["homepage.headline.0","Headline · first line"],["homepage.headline.1","Headline · second line"],["homepage.description.0","Introduction"],["homepage.description.1","Closing line"]]},
 {title:"Book with the locals",fields:[["homepage.intro.title","Heading"],["homepage.intro.body","Description"]]},
 {title:"What makes Roamstead",fields:[["homepage.pillars.0.title","Gather round · heading"],["homepage.pillars.0.body","Gather round · description"],["homepage.pillars.1.title","Four seasons · heading"],["homepage.pillars.1.body","Four seasons · description"],["homepage.pillars.2.title","Local by nature · heading"],["homepage.pillars.2.body","Local by nature · description"]]},
 {title:"Featured stays",fields:[["homepage.featuredHeading","Section heading"]]},
 {title:"Hygge House card",fields:[["homepage.cards.hygge-house.name","Property name"],["hooks.hygge-house","Hook"],["homepage.cards.hygge-house.highlight","Feature highlights"]]},
 {title:"Granary card",fields:[["homepage.cards.granary.name","Property name"],["hooks.granary","Hook"],["homepage.cards.granary.highlight","Feature highlights"]]},
 {title:"The Lowell card",fields:[["homepage.cards.lowell.name","Property name"],["hooks.lowell","Hook"],["homepage.cards.lowell.highlight","Feature highlights"]]},
 {title:"Powder Room card",fields:[["homepage.cards.powder-room.name","Property name"],["hooks.powder-room","Hook"],["homepage.cards.powder-room.highlight","Feature highlights"]]},
 {title:"The Heber Senator",fields:[["shared.senator.eyebrow","Eyebrow"],["shared.senator.headline","Heading"],["shared.senator.body","Description"]]},
 {title:"Early access",fields:[["shared.community.eyebrow","Eyebrow"],["shared.community.headline","Heading"],["shared.community.body","Description"],["shared.community.perks","Member benefits"]]}
 ],
 properties:[
 {title:"Page hero",fields:[["properties.hero.eyebrow","Eyebrow"],["properties.hero.headline","Heading"],["properties.hero.body","Description"],["properties.hero.accent","Emphasized ending"]]},
 {title:"Find your fit",fields:[["properties.listHeading","Section heading"],["properties.intro","Description"]]},
 {title:"Property cards",fields:[["hooks.hygge-house","Hygge House"],["hooks.granary","Granary"],["hooks.lowell","The Lowell"],["hooks.powder-room","Powder Room"]]},
 {title:"The Heber Senator",fields:[["shared.senator.eyebrow","Eyebrow"],["shared.senator.headline","Heading"],["shared.senator.body","Description"]]},
 {title:"Early access",fields:[["shared.community.eyebrow","Eyebrow"],["shared.community.headline","Heading"],["shared.community.body","Description"],["shared.community.perks","Member benefits"]]}
 ]
};
function flatten(value:unknown,prefix="",out:Record<string,string>={}):Record<string,string>{
 if(typeof value==="string"){out[prefix]=value;return out;}
 if(Array.isArray(value)) value.forEach((v,i)=>flatten(v,prefix?prefix+"."+i:String(i),out));
 else if(value&&typeof value==="object")Object.entries(value).forEach(([k,v])=>flatten(v,prefix?prefix+"."+k:k,out));
 return out;
}
export default function CopyEditor() {
  const [source,setSource]=useState<Source|null>(null);
  const [page,setPage]=useState<"home"|"properties">("home");
  const [values,setValues]=useState<Record<string,string>>({});
  const [base,setBase]=useState<Record<string,string>>({});
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");
  const [publishing,setPublishing]=useState(false);
  const changed=useMemo(()=>Object.keys(values).filter(k=>values[k]!==base[k]),[values,base]);
  useEffect(()=>{fetch("/admin/api/content",{cache:"no-store"}).then(r=>r.json()).then((s:Source)=>{setSource(s);if(s.copy){const v=flatten(s.copy);setValues(v);setBase(v);}}).catch(()=>setNotice("Editor is temporarily unavailable."));},[]);
  useEffect(()=>{function warn(e:BeforeUnloadEvent){if(changed.length){e.preventDefault();e.returnValue="";}}window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn)},[changed.length]);
  async function save(){
    if(!source?.sha||busy||!changed.length)return;
    setBusy(true);setNotice("Saving approved copy...");
    try{
      const r=await fetch("/admin/api/content",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({sha:source.sha,values})});
      const j=await r.json();
      if(!r.ok)throw Error(j.error||"Save failed");
      setSource({...source,sha:j.sha});setBase({...values});
      setNotice("Saved to GitHub. Waiting for the live site...");
      setPublishing(true);
      const key=changed[0], expected=values[key];
      let verified=false;
      for(let attempt=0;attempt<24;attempt++){
        await new Promise(resolve=>setTimeout(resolve,5000));
        const result=await fetch("/admin/api/publish-status?"+new URLSearchParams({field:key,expected}),{cache:"no-store"}).then(x=>x.json()).catch(()=>({status:"unknown"}));
        if(result.status==="live"){verified=true;break;}
      }
      setPublishing(false);
      setNotice(verified?"Published. Your change is live on the website.":"Saved. Publishing is taking longer than expected. You can check Vercel deployment status.");
    }catch(e){setNotice(e instanceof Error?e.message:"Save failed")}finally{setBusy(false)}
  }
  const [expanded,setExpanded]=useState<string|null>("Hero");
  return <section className="rounded-xl border border-[#D8CCC4] bg-[#FFFCFB] px-2.5 py-3 sm:px-4 md:px-5">
    <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="font-body text-[11px] font-semibold uppercase tracking-[.12em] text-[#4A6E57]">Your website</p>
        <h2 className="mt-0.5 font-heading text-[22px] leading-tight sm:text-[24px]">Update your website copy</h2>
        <p className="mt-1 font-body text-[12px] leading-[1.45] text-[#6D6057]">Find a page, make your changes, then save to publish them to your site.</p>
      </div>
      <span className="inline-flex h-[27px] w-fit items-center justify-center rounded-md bg-[#F4EFEC] px-2.5 font-body text-[11px] leading-none text-[#6D6057]">{source?.editing?"Editor connected":"Read-only"}</span>
    </header>
    {!source?<p className="mt-4 text-sm">Loading content...</p>:<>
      {!source.editing&&<p className="mt-3 rounded-lg bg-[#F4EFEC] p-3 font-body text-[13px]">{source.message||source.error||"Editing is temporarily unavailable. Please contact Castlehead."}</p>}
      <label className="mt-3 block font-body text-[12px] font-semibold text-[#1F3125]">Page
        <span className="relative mt-1 block">
          <select aria-label="Choose site page" value={page} onChange={e=>{const next=e.target.value as "home"|"properties";setPage(next);setExpanded(next==="home"?"Hero":"Page hero")}} className="absolute inset-0 z-10 h-[40px] w-full cursor-pointer opacity-0">
            <option value="home">Home page</option>
            <option value="properties">Properties page</option>
          </select>
          <span aria-hidden="true" className="flex h-[40px] w-full items-center rounded-lg border border-[#D8CCC4] bg-white pl-3 pr-10 font-body text-[13px] font-medium text-[#1F3125]">{page==="home"?"Home page":"Properties page"}</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute right-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#4A6E57]"><path d="m5 7 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </label>
      <div className="mt-2 space-y-1.5">
        {sections[page].map(section=><section key={section.title} className="overflow-hidden rounded-lg border border-[#E7DFDB] bg-[#FFFCFB]">
          <button type="button" aria-expanded={expanded===section.title} onClick={()=>setExpanded(expanded===section.title?null:section.title)} className="flex min-h-[42px] w-full items-center justify-between gap-3 px-2.5 py-2 text-left font-heading text-[15px] leading-[1.25] text-[#1F3125] hover:bg-[#F7F3F0] sm:text-[17px]">
            <span>{section.title}</span><span className="flex shrink-0 items-center gap-2 whitespace-nowrap font-body text-[11px] leading-none text-[#6D6057]">{section.fields.length} fields <span className="inline-flex w-3 justify-center">{expanded===section.title?"−":"+"}</span></span>
          </button>
          {expanded===section.title&&<div className="grid gap-2 border-t border-[#E7DFDB] px-2.5 pb-2.5 pt-2">
            {section.fields.map(([key,label])=><label key={key} className="block font-body text-[12px] font-medium text-[#1F3125]">
              {label}
              {values[key]?.length>105?<textarea rows={2} value={values[key]||""} disabled={!source.editing||busy} onChange={e=>setValues(v=>({...v,[key]:e.target.value}))} className="mt-1 block min-h-[40px] w-full resize-y rounded-md border border-[#D8CCC4] bg-white px-3 py-2 font-body text-[13px] font-normal leading-[1.4] [field-sizing:content] focus:outline-[#4A6E57] disabled:opacity-75"/>:<input type="text" value={values[key]||""} disabled={!source.editing||busy} onChange={e=>setValues(v=>({...v,[key]:e.target.value}))} className="mt-1 block h-[38px] w-full rounded-md border border-[#D8CCC4] bg-white px-3 font-body text-[13px] font-normal focus:outline-[#4A6E57] disabled:opacity-75"/>}
              {changed.includes(key)&&<span className="block pt-1 text-[11px] text-[#4A6E57]">Not saved yet</span>}
            </label>)}
          </div>}
        </section>)}
      </div>
      <div className="sticky bottom-2 z-10 mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 rounded-lg border border-[#D8CCC4] bg-[#FFFCFB] px-2.5 py-2 shadow-sm">
        <p role="status" className="font-body text-[12px] text-[#6D6057]">{notice||`${changed.length} unsaved changes`}</p>
        <div className="ml-auto flex shrink-0 items-center gap-1.5"><button type="button" disabled={!changed.length||busy} onClick={()=>{setValues({...base});setNotice("Your changes were discarded.")}} className="h-[32px] rounded-md border border-[#D8CCC4] px-2.5 text-[11px] disabled:opacity-40">Discard</button><button type="button" disabled={!source.editing||!changed.length||busy||publishing} onClick={save} className="h-[32px] whitespace-nowrap rounded-md bg-[#4A6E57] px-3 font-body text-[11px] font-medium text-white disabled:opacity-40">{busy?"Saving...":publishing?"Checking live site...":"Save & publish"}</button></div>
      </div>
    </>}
  </section>;
}
