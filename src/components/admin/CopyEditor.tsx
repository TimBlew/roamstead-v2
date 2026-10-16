"use client";
import { useEffect, useMemo, useState } from "react";

type Source = { sha?: string; copy?: { homepage: { headline: string[]; description: string[] }; properties: { intro: string }; hooks: Record<string,string> }; editing?: boolean; message?: string; error?: string };
const sections = [
  { title: "Homepage hero", fields: [["homepage.headline.0","First headline line"],["homepage.headline.1","Second headline line"],["homepage.description.0","Intro paragraph"],["homepage.description.1","Closing paragraph"]] },
  { title: "Properties introduction", fields: [["properties.intro","Collection introduction"]] },
  { title: "Property card hooks", fields: [["hooks.hygge-house","Hygge House"],["hooks.granary","Granary"],["hooks.lowell","The Lowell"],["hooks.powder-room","Powder Room"]] }
];
function flatten(copy: NonNullable<Source["copy"]>) {
  return Object.fromEntries([...copy.homepage.headline.map((s,i)=>[`homepage.headline.${i}`,s]),...copy.homepage.description.map((s,i)=>[`homepage.description.${i}`,s]),["properties.intro",copy.properties.intro],...Object.entries(copy.hooks).map(([k,v])=>[`hooks.${k}`,v])]) as Record<string,string>;
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
  return <section className="rounded-xl border border-[#D8CCC4] bg-[#FFFCFB] p-4 md:p-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div><p className="font-body text-[11px] font-semibold uppercase tracking-[.12em] text-[#4A6E57]">Website content</p><h2 className="mt-0.5 font-heading text-[25px] leading-tight">Edit approved copy</h2><p className="mt-1 font-body text-[13px] leading-[1.45] text-[#6D6057]">Changes are committed to the website repository and published through Vercel. Booking details and prices remain in Hostaway.</p></div>
      <span className="rounded-lg bg-[#F4EFEC] px-3 py-1.5 font-body text-[11px] text-[#6D6057]">{source?.editing?"Editor connected":"Read-only"}</span>
    </div>
    {!source?<p className="mt-6 font-body text-sm">Loading content...</p>:<>
      {!source.editing&&<p className="mt-4 rounded-lg border border-[#D8CCC4] bg-[#F4EFEC] p-3 font-body text-[13px]">{source.message||source.error||"Editing isn't configured yet. Ask Castlehead to connect a repository-scoped publishing credential."}</p>}
      <label className="mt-3 block font-body text-[12px] font-medium text-[#6D6057]">Page<div className="relative mt-1"><select value={page} onChange={e=>setPage(e.target.value as "home"|"properties")} className="block h-[42px] w-full appearance-none rounded-lg border border-[#D8CCC4] bg-white py-2 pl-3 pr-10 font-body text-[13px] text-[#1F3125] focus:outline-[#4A6E57]"><option value="home">Home page</option><option value="properties">Properties page</option></select><span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-[7px] w-[7px] -translate-y-[65%] rotate-45 border-b border-r border-[#4A6E57]" /></div></label>
      {sections.filter(s=>page==="home"?s.title==="Homepage hero":s.title!=="Homepage hero").map(s=><details key={s.title} open className="mt-2 rounded-lg border border-[#E7DFDB] p-3 md:p-4">
        <summary className="cursor-pointer font-heading text-[18px] leading-tight text-[#1F3125]">{s.title}</summary>
        <div className="mt-3 grid gap-3">{s.fields.map(([key,label])=><label key={key} className="block font-body text-[13px] font-medium text-[#1F3125]">{label}{key.includes("headline")||key.startsWith("hooks.")?<input type="text" value={values[key]||""} disabled={!source.editing||busy} onChange={e=>setValues(p=>({...p,[key]:e.target.value}))} className="mt-1 block h-[42px] w-full rounded-lg border border-[#D8CCC4] bg-white px-3 font-body text-[13px] font-normal focus:outline-[#4A6E57] disabled:opacity-75"/>:<textarea value={values[key]||""} disabled={!source.editing||busy} onChange={e=>setValues(p=>({...p,[key]:e.target.value}))} rows={2} className="mt-1 block min-h-[46px] w-full resize-y rounded-lg border border-[#D8CCC4] bg-white px-3 py-2 font-body text-[13px] font-normal leading-[1.5] [field-sizing:content] focus:outline-[#4A6E57] disabled:opacity-75"/>}{changed.includes(key)&&<span className="mt-1 block text-[11px] text-[#4A6E57]">Unsaved change</span>}</label>)}</div>
      </details>)}
      <div className="sticky bottom-2 z-10 mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#D8CCC4] bg-[#FFFCFB] p-2.5 shadow-sm">
        <p role="status" className="font-body text-[12px] text-[#6D6057]">{notice||`${changed.length} unsaved changes`}</p>
        <div className="flex gap-2"><button type="button" disabled={!changed.length||busy} onClick={()=>{setValues({...base});setNotice("Changes discarded.")}} className="rounded-lg border border-[#D8CCC4] px-4 py-2 text-[13px] disabled:opacity-40">Discard</button><button type="button" disabled={!source.editing||!changed.length||busy||publishing} onClick={save} className="rounded-lg bg-[#4A6E57] px-5 py-2 font-body text-[13px] font-medium text-white disabled:opacity-40">{busy?"Saving...":publishing?"Checking live site...":"Save & publish"}</button></div>
      </div>
    </>}
  </section>
}
