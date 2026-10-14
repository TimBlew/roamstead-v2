"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

export const CommunityCTA = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [audienceStored, setAudienceStored] = useState(false);
  const [message, setMessage] = useState("");
  const [season, setSeason] = useState("");
  const [home, setHome] = useState("");
  const [showResult, setShowResult] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeResult = () => { setShowResult(false); setMessage(""); setStatus("idle"); };
  useEffect(() => {
    if (!showResult) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeResult();
      if (event.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
        if (focusables?.length) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", handleKey); previousFocus?.focus(); };
  }, [showResult]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const email = String(values.get("email") || "").trim();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("That email doesn't look right. Mind checking it?");
      setStatus("error");
      setShowResult(true);
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/early-access", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, season: values.get("season"), home: values.get("home"), consent: true }),
      });
      if (!response.ok) {
        throw new Error(response.status === 400 ? "Please check your selections and try again." : "We couldn't complete your signup. Please try again.");
      }
      const result = await response.json() as { audienceStored?: boolean };
      setAudienceStored(result.audienceStored === true);
      form.reset();
      setSeason("");
      setHome("");
      setStatus("success");
      setMessage("You're on the list. We'll be in touch when it opens.");
      setShowResult(true);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We couldn't complete your signup. Please try again.");
      setShowResult(true);
    }
  }
  return (
    <section className="bg-[#F4EFEC] px-3 pb-7 pt-3 text-center md:px-6 md:pt-[40px] md:pb-[44px]">
      <div className="mx-auto w-full max-w-[860px]">
        <img src="/roamstead-collective-logo.svg" alt="Roamstead Collective" className="mx-auto w-[195px] md:w-[232px]" />
        <p className="mt-1.5 font-body text-[11px] font-semibold uppercase leading-5 tracking-[0.23em] text-[#4A6E57] md:text-[12px] md:tracking-[0.26em]">Coming soon</p>
        <h2 className="mx-auto mt-2.5 max-w-[800px] font-heading text-[31px] font-medium leading-[1.12] tracking-[-0.04em] text-[#1F3125] [text-wrap:balance] sm:text-[39px] md:mt-[14px] md:text-[44px]">For people who come back</h2>
        <p className="mx-auto mt-3 max-w-[660px] font-body text-[15px] leading-[1.5] text-[#6D6057] [text-wrap:balance] md:mt-[18px] md:text-[16px] md:leading-[1.6]">We're building a membership for the 4-Seasoners, the people who'd rather know one place well than see a new one every trip. Get on the early list and you'll hear first when it opens.</p>
        <p className="mx-auto mt-2 max-w-[660px] font-body text-[15px] leading-[1.5] text-[#6D6057] [text-wrap:balance] md:mt-[12px] md:text-[16px] md:leading-[1.6]">What we're planning: member rates on stays, deals for valley locals, first invites to events, and a newsletter worth opening.</p>
        <form onSubmit={submit} noValidate className="mx-auto mt-4 grid w-full max-w-[690px] gap-x-5 gap-y-3 text-left sm:grid-cols-2 md:mt-[28px] md:gap-y-[14px]">
          <label className="block font-body text-[13px] font-medium tracking-[-0.01em] text-[#1F3125] sm:col-span-2">
            Email <span aria-hidden="true" className="text-[#4A6E57]">*</span>
            <input name="email" type="email" autoComplete="email" required placeholder="Your email address" className="mt-1.5 block h-[48px] md:mt-2 md:h-[52px] w-full rounded-[8px] border border-[#CFC4BC] bg-[#FFFCFB] px-4 font-body text-[15px] text-[#1F3125] shadow-[0_1px_2px_rgba(31,49,37,0.035)] outline-none transition-colors placeholder:text-[#978C84] hover:border-[#AFA69C] focus:border-[#4A6E57] focus:ring-2 focus:ring-[#4A6E57]/15" />
          </label>
          <label className="block min-w-0 font-body text-[13px] font-medium leading-5 tracking-[-0.01em] text-[#1F3125]">
            Which season brings you up here? <span className="font-normal text-[#8A8078]">(optional)</span>
            <span className="relative mt-1.5 block md:mt-2">
              <select name="season" value={season} onChange={(event) => setSeason(event.target.value)} aria-label="Which season brings you up here?" className="peer absolute inset-0 z-10 h-[48px] md:h-[52px] w-full cursor-pointer appearance-none opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57]">
                <option value="">Select a season</option>
                <option value="Winter">Winter</option><option value="Spring">Spring</option><option value="Summer">Summer</option><option value="Fall">Fall</option><option value="All Four">All Four</option>
              </select>
              <span aria-hidden="true" className={`peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#4A6E57] flex h-[48px] md:h-[52px] w-full items-center rounded-[8px] border border-[#CFC4BC] bg-[#FFFCFB] py-3 pl-4 pr-11 font-body text-[15px] shadow-[0_1px_2px_rgba(31,49,37,0.035)] ${season ? "text-[#1F3125]" : "text-[#978C84]"}`}>
                {season || "Select a season"}
              </span>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#4A6E57]"><path d="m6 9 6 6 6-6" /></svg>
            </span>
          </label>
          <label className="block min-w-0 font-body text-[13px] font-medium leading-5 tracking-[-0.01em] text-[#1F3125]">
            Where's home? <span className="font-normal text-[#8A8078]">(optional)</span>
            <span className="relative mt-1.5 block md:mt-2">
              <select name="home" value={home} onChange={(event) => setHome(event.target.value)} aria-label="Where's home?" className="absolute inset-0 z-10 h-[48px] md:h-[52px] w-full cursor-pointer appearance-none opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57]">
                <option value="">Select an area</option>
                <option value="Heber Valley / Wasatch Back">Heber Valley / Wasatch Back</option><option value="Salt Lake or Provo area">Salt Lake or Provo area</option><option value="Somewhere else">Somewhere else</option>
              </select>
              <span aria-hidden="true" className={`peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#4A6E57] flex h-[48px] md:h-[52px] w-full items-center rounded-[8px] border border-[#CFC4BC] bg-[#FFFCFB] py-3 pl-4 pr-11 font-body text-[15px] shadow-[0_1px_2px_rgba(31,49,37,0.035)] ${home ? "text-[#1F3125]" : "text-[#978C84]"}`}>
                {home || "Select an area"}
              </span>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#4A6E57]"><path d="m6 9 6 6 6-6" /></svg>
            </span>
          </label>
          <div className="pt-0 text-center sm:col-span-2 md:pt-[12px]">
            <button type="submit" disabled={status === "sending"} className="inline-flex h-[48px] min-w-[192px] items-center justify-center rounded-[8px] bg-[#4A6E57] px-[28px] font-body text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_4px_12px_rgba(31,49,37,0.12)] transition-[background-color,box-shadow] duration-200 hover:bg-[#3C6049] hover:shadow-[0_6px_16px_rgba(31,49,37,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] disabled:cursor-not-allowed disabled:opacity-60 md:h-[52px] md:min-w-[206px]">{status === "sending" ? "Sending…" : "Get early access"}</button>
            <div className="mx-auto mt-[8px] max-w-[620px] font-body text-[11.5px] leading-[1.45] md:text-[12px] text-[#6D6057]">
              <p>Free to join the list. Unsubscribe anytime.</p>
              <p>By joining, you agree to receive early-access news and member offers by email.</p>
            </div>
          </div>
        </form>
      </div>
      {showResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1F3125]/55 px-5 py-8 backdrop-blur-[4px]" onMouseDown={(event) => { if (event.target === event.currentTarget) closeResult(); }}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="early-access-result-title" className="relative w-full max-w-[360px] rounded-[16px] border border-[#E7DFDB] bg-[#FFFCFB] px-6 pb-6 pt-7 text-center shadow-[0_24px_80px_rgba(31,49,37,0.19)] sm:px-8">
            <button ref={closeButtonRef} type="button" onClick={closeResult} aria-label="Close message" className="absolute right-[8px] top-[8px] flex h-[40px] w-[40px] items-center justify-center rounded-[8px] text-[#6D6057] transition-colors hover:bg-[#F4EFEC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57]">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="h-3.5 w-3.5"><path d="M5 5 19 19M19 5 5 19" /></svg>
            </button>
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5EC] text-[#4A6E57]">
              {status === "success" ? (
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m5 12 4.5 4.5L19 7" /></svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" /></svg>
              )}
            </div>
            <h3 id="early-access-result-title" className="font-heading text-[26px] font-medium leading-[1.14] tracking-[-0.035em] text-[#1F3125]">{status === "success" ? (audienceStored ? "You’re on the list." : "We’ve received your request.") : "One more thing."}</h3>
            {status !== "success" && <p id="early-access-result-message" className="mx-auto mt-2 max-w-[290px] font-body text-[14px] leading-[1.5] text-[#6D6057]">{message}</p>}
            <button type="button" onClick={closeResult} className="mt-4 inline-flex min-h-[44px] min-w-[130px] items-center justify-center rounded-[8px] bg-[#4A6E57] px-5 font-body text-[14px] font-semibold text-white shadow-[0_3px_10px_rgba(31,49,37,0.10)] transition-[background-color,box-shadow] duration-200 hover:bg-[#3C6049] hover:shadow-[0_5px_14px_rgba(31,49,37,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57]">{status === "success" ? "Keep exploring" : "Try again"}</button>
          </div>
        </div>
      )}
    </section>
  );
};
