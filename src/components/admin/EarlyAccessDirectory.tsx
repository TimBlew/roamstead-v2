"use client";
// Deployment trigger: rebuild corrected early-access directory from current main.
import {useCallback,useEffect,useMemo,useState} from "react";
type Entry={id:string;email:string;createdAt:string;unsubscribed:boolean;season:string;home:string;preferencesUnavailable?:boolean;subscriptionKnown?:boolean;notificationStatus?:string;contactStatus?:string};
type Response={connected?:boolean;source?:"sheets"|"resend";entries?:Entry[];hasMore?:boolean;nextCursor?:string|null;message?:string};
let cachedDirectory: Response | null = null;
export default function EarlyAccessDirectory(){
  const [entries,setEntries]=useState<Entry[]>(()=>cachedDirectory?.entries||[]);
  const [dataSource,setDataSource]=useState<"sheets"|"resend">(()=>cachedDirectory?.source||"resend");
  const [cursor,setCursor]=useState<string|null>(null);
  const [hasMore,setHasMore]=useState(false);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");
  const [initialLoaded,setInitialLoaded]=useState(()=>Boolean(cachedDirectory));
  const [search,setSearch]=useState("");
  const [season,setSeason]=useState("all");
  const [selected,setSelected]=useState<string|null>(null);
  const [notificationEmail,setNotificationEmail]=useState("");
  const [savedEmail,setSavedEmail]=useState("");
  const [settingEnabled,setSettingEnabled]=useState(false);
  const [settingBusy,setSettingBusy]=useState(false);
  const [settingNotice,setSettingNotice]=useState("");
  useEffect(()=>{
    let mounted=true;
    fetch("/admin/api/notification-settings",{cache:"no-store"})
      .then(async r=>{const data=await r.json();if(!r.ok)throw Error(data.message||"Unable to load notification address.");return data})
      .then(data=>{if(mounted){setNotificationEmail(data.email||"");setSavedEmail(data.email||"");setSettingEnabled(Boolean(data.editable))}})
      .catch(e=>{if(mounted)setSettingNotice(e instanceof Error?e.message:"Unable to load notification settings.")});
    return ()=>{mounted=false};
  },[]);
  async function saveNotification(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    setSettingBusy(true);setSettingNotice("");
    try{
      const response=await fetch("/admin/api/notification-settings",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:notificationEmail})});
      const data=await response.json();
      if(!response.ok)throw Error(data.error||"Unable to save.");
      setSavedEmail(data.email);
      setNotificationEmail(data.email);
      setSettingNotice(data.message||"Saved.");
    }catch(e){setSettingNotice(e instanceof Error?e.message:"Unable to save.");}
    finally{setSettingBusy(false)}
  }

  const load=useCallback(async(after:string|null=null)=>{
    setLoading(true);setMessage("");
    try{
      const url="/admin/api/early-access"+(after?"?after="+encodeURIComponent(after):"");
      const r=await fetch(url,{cache:"no-store"});
      const data=await r.json() as Response;
      if(!r.ok||!data.connected)throw Error(data.message||"Unable to load signups.");
      setEntries(prev=>after?[...prev,...(data.entries||[])]:data.entries||[]);
      if(!after){cachedDirectory=data;setInitialLoaded(true)}
      setDataSource(data.source||"resend");
      setCursor(data.nextCursor||null);setHasMore(Boolean(data.hasMore));
    }catch(e){setMessage(e instanceof Error?e.message:"Unable to load signups.");}
    finally{setLoading(false)}
  },[]);
  useEffect(()=>{void load()},[load]);
  const filtered=useMemo(()=>entries.filter(e=>(season==="all"||e.season===season)&&[e.email,e.season,e.home].join(" ").toLowerCase().includes(search.trim().toLowerCase())),[entries,search,season]);
  const seasons=useMemo(()=>[...new Set(entries.map(e=>e.season).filter(Boolean))].sort(),[entries]);
  const detail=entries.find(e=>e.id===selected);
  const displayDate=(value:string)=>{const d=new Date(value);return Number.isNaN(d.getTime())?value:d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})};
  return <div className="space-y-3">
    <section className="rounded-xl border border-[#D8CCC4] bg-[#FFFCFB] p-3 sm:p-5">
      <div><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#4A6E57]">Notifications</p><h2 className="mt-0.5 font-heading text-[20px] leading-tight sm:text-[23px]">Where signup emails go</h2><p className="mt-1 font-body text-[12px] leading-[1.5] text-[#6D6057]">Choose who receives an email when someone joins your early-access list.</p></div>
      <form onSubmit={saveNotification} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1 font-body text-[12px] font-medium text-[#1F3125]">Send notifications to
          <input type="email" required autoComplete="email" maxLength={254} value={notificationEmail} onChange={e=>setNotificationEmail(e.target.value)} disabled={!settingEnabled||settingBusy} placeholder="email@example.com" className="mt-1 block h-[39px] w-full rounded-lg border border-[#D8CCC4] bg-white px-3 font-body text-[13px] outline-[#4A6E57] disabled:opacity-55"/>
        </label>
        <button type="submit" disabled={!settingEnabled||settingBusy||!notificationEmail.trim()||notificationEmail.trim().toLowerCase()===savedEmail.toLowerCase()} className="h-[39px] shrink-0 rounded-lg bg-[#4A6E57] px-4 font-body text-[12px] font-medium text-white disabled:opacity-40">{settingBusy?"Saving...":"Save email"}</button>
      </form>
      {settingNotice&&<p role="status" className="mt-2 text-[12px] text-[#4A6E57]">{settingNotice}</p>}
      <p className="mt-2 font-body text-[11px] leading-[1.45] text-[#6D6057]">Your new email address will take effect once the website update is live.</p>
    </section>
    <section className="rounded-xl border border-[#D8CCC4] bg-[#FFFCFB] p-3 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#4A6E57]">Guest interest</p><h2 className="mt-0.5 font-heading text-[22px] leading-tight sm:text-[25px]">Your early-access list</h2><p className="mt-1 max-w-[65ch] font-body text-[12px] leading-[1.45] text-[#6D6057]">{dataSource==="sheets"?"Everyone who’s joined the list, along with their preferred season and home area.":"Your early-access contacts are being loaded from the mailing list."}</p></div>
        <button type="button" onClick={()=>void load()} disabled={loading} className="inline-flex h-[33px] items-center rounded-md border border-[#D8CCC4] px-3 text-[12px] text-[#1F3125] disabled:opacity-40">Refresh</button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-[#F4EFEC] px-4 py-3">
        <div><strong className="block font-heading text-[25px] leading-tight tabular-nums">{initialLoaded?entries.length:"—"}</strong><span className="block text-[11px] text-[#6D6057]">{hasMore?"Records loaded":"Guests on the list"}</span></div>
        <span className="text-right text-[11px] leading-snug text-[#6D6057]">{loading? "Refreshing list…" : dataSource==="sheets" ? "Mailing status is available in guest details" : "Subscription status is available in guest details"}</span>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="min-w-0 flex-1"><span className="sr-only">Find a contact</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search guests by email, season, or area" className="h-[40px] w-full rounded-lg border border-[#D8CCC4] bg-white px-3 font-body text-[13px] outline-[#4A6E57]"/></label>
        <label><span className="sr-only">Filter by preferred season</span><select value={season} onChange={e=>setSeason(e.target.value)} className="h-[40px] w-full rounded-lg border border-[#D8CCC4] bg-white px-3 font-body text-[13px] sm:w-[170px]"><option value="all">All seasons</option>{seasons.map(s=><option key={s} value={s}>{s}</option>)}</select></label>
      </div>
      {message&&<p role="alert" className="mt-3 rounded-md bg-[#F4EFEC] px-3 py-2 text-[12px] text-[#6D6057]">{message}</p>}
      <div className="mt-3 overflow-hidden rounded-lg border border-[#E7DFDB]">
        <div className="hidden grid-cols-[minmax(0,1.6fr)_1fr_1fr_90px] gap-3 bg-[#F4EFEC] px-3 py-2 text-[11px] font-semibold text-[#6D6057] sm:grid"><span>Email</span><span>Preferred season</span><span>Home area</span><span>Added</span></div>
        {filtered.map(e=><button key={e.id} type="button" onClick={()=>setSelected(selected===e.id?null:e.id)} className={"block w-full border-t border-[#E7DFDB] px-3 py-3 text-left hover:bg-[#F7F3F0] sm:grid sm:grid-cols-[minmax(0,1.6fr)_1fr_1fr_90px] sm:gap-3 sm:py-2.5 "+(selected===e.id?"bg-[#F4EFEC]":"")}>
          <span className="block min-w-0 break-all text-[13px] font-medium text-[#1F3125]">{e.email}</span>
          <span className="mt-1 block text-[11px] text-[#6D6057] sm:mt-0 sm:text-[12px]">{e.preferencesUnavailable?"Unavailable":e.season||"Not provided"}</span>
          <span className="block text-[11px] text-[#6D6057] sm:text-[12px]">{e.preferencesUnavailable?"Unavailable":e.home||"Not provided"}</span>
          <span className="block text-[11px] text-[#6D6057] sm:text-[12px]">{displayDate(e.createdAt)}</span>
        </button>)}
        {initialLoaded&&!loading&&!filtered.length&&<p className="px-3 py-5 text-center text-[13px] text-[#6D6057]">{entries.length?"No guests match that search.":"No signups yet. New guests will appear here."}</p>}
        {!initialLoaded&&loading&&<p className="px-3 py-4 text-[13px] text-[#6D6057]">Loading your list...</p>}
      </div>
      {hasMore&&<div className="mt-3 text-center"><button type="button" disabled={loading||!cursor} onClick={()=>void load(cursor)} className="h-[36px] rounded-lg border border-[#D8CCC4] px-4 text-[12px] disabled:opacity-40">Load more</button></div>}
    </section>
    {detail&&<section className="rounded-xl border border-[#D8CCC4] bg-[#FFFCFB] p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-heading text-[20px]">Guest details</h3><button className="text-[12px] text-[#6D6057] underline" onClick={()=>setSelected(null)}>Close</button></div><dl className="mt-3 grid gap-3 text-[13px] sm:grid-cols-2">{[["Email",detail.email],["Date added",displayDate(detail.createdAt)],["Preferred season",detail.preferencesUnavailable?"Could not load preferences":detail.season||"Not provided"],["Home area",detail.preferencesUnavailable?"Could not load preferences":detail.home||"Not provided"],["Mailing list status",detail.subscriptionKnown===false?(detail.contactStatus==="stored"?"Contact saved":"Not yet confirmed"):detail.unsubscribed?"Unsubscribed":"Subscribed"]].map(([label,value])=><div key={label}><dt className="text-[11px] text-[#6D6057]">{label}</dt><dd className="mt-0.5 break-words font-medium">{value}</dd></div>)}</dl><a href={"mailto:"+detail.email} className="mt-4 inline-flex h-[34px] items-center rounded-md bg-[#4A6E57] px-3 text-[12px] font-medium text-white">Send an email</a></section>}
  </div>;
}
