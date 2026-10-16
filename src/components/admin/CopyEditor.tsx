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
  const [values,setValues]=useState<Record<string,string>>({});
  const [base,setBase]=useState<Record<string,string>>({});
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");
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
      setSource({...source,sha:j.sha});setBase({...values});setNotice("Saved. Publishing to the live site; allow about a minute, then verify the page.");
    }catch(e){setNotice(e instanceof Error?e.message:"Save failed")}finally{setBusy(false)}
  }
  return <section className="mt-7 rounded-xl border border-[#D8CCC4] bg-[#FFFCFB] p-5 md:p-7">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="font-body text-[12px] font-semibold uppercase tracking-[.12em] text-[#4A6E57]">Website content</p><h2 className="mt-1 font-heading text-[27px]">Edit approved copy</h2><p className="mt-2 font-body text-[14px] text-[#6D6057]">Changes are committed to the website repository and published through Vercel. Booking details and prices remain in Hostaway.</p></div>
      <span className="rounded-lg bg-[#F4EFEC] px-3 py-2 font-body text-[12px] text-[#6D6057]">{source?.editing?"Editor connected":"Read-only"}</span>
    </div>
    {!source?<p className="mt-6 font-body text-sm">Loading content...</p>:<>
      {!source.editing&&<p className="mt-4 rounded-lg border border-[#D8CCC4] bg-[#F4EFEC] p-3 font-body text-[13px]">{source.message||source.error||"Editing isn't configured yet. Ask Castlehead to connect a repository-scoped publishing credential."}</p>}
      {sections.map(s=><details key={s.title} open className="mt-5 rounded-lg border border-[#E7DFDB] p-4">
        <summary className="cursor-pointer font-heading text-[21px] text-[#1F3125]">{s.title}</summary>
        <div className="mt-4 grid gap-4">{s.fields.map(([key,label])=><label key={key} className="block font-body text-[13px] font-medium text-[#1F3125]">{label}<textarea value={values[key]||""} disabled={!source.editing||busy} onChange={e=>setValues(p=>({...p,[key]:e.target.value}))} rows={key.includes("description")||key==="properties.intro"?3:2} className="mt-2 block w-full resize-y rounded-lg border border-[#D8CCC4] bg-white p-3 font-body text-[14px] leading-relaxed focus:outline-[#4A6E57] disabled:opacity-75"/>{changed.includes(key)&&<span className="mt-1 block text-[11px] text-[#4A6E57]">Unsaved change</span>}</label>)}</div>
      </details>)}
      <div className="sticky bottom-3 z-10 mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#D8CCC4] bg-[#FFFCFB] p-3 shadow-md">
        <p role="status" className="font-body text-[12px] text-[#6D6057]">{notice||`${changed.length} unsaved changes`}</p>
        <div className="flex gap-2"><button type="button" disabled={!changed.length||busy} onClick={()=>{setValues({...base});setNotice("Changes discarded.")}} className="rounded-lg border border-[#D8CCC4] px-4 py-2 text-[13px] disabled:opacity-40">Discard</button><button type="button" disabled={!source.editing||!changed.length||busy} onClick={save} className="rounded-lg bg-[#4A6E57] px-5 py-2 font-body text-[13px] font-medium text-white disabled:opacity-40">{busy?"Saving...":"Save & publish"}</button></div>
      </div>
    </>}
  </section>
}
