"use client";

import { useState, type FormEvent } from "react";

export const CommunityCTA = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const email = String(values.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("That email doesn't look right. Mind checking it?");
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/early-access", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, season: values.get("season"), home: values.get("home") }),
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      setStatus("success");
      setMessage("You're on the list. We'll be in touch when it opens.");
    } catch {
      setStatus("error");
      setMessage("We couldn't send that right now. Please try again.");
    }
  }
  return (
    <section className="bg-[#F4EFEC] px-5 py-9 text-center md:px-6 md:py-16">
      <div className="mx-auto max-w-[720px]">
        <img src="/roamstead-collective-logo.svg" alt="Roamstead Collective" className="mx-auto w-[226px] md:w-[286px]" />
        <p className="mt-1 font-body text-[12px] font-semibold uppercase leading-5 tracking-[0.24em] text-[#4A6E57] md:text-[14px] md:tracking-[0.3em]">Coming soon</p>
        <h2 className="mt-2 font-heading text-[34px] leading-[1.12] tracking-[-0.04em] text-[#1F3125] md:text-[48px]">For people who come back</h2>
        <p className="mt-3 font-body text-[16px] leading-[1.55] text-[#6D6057]">We're building a membership for the 4-Seasoners, the people who'd rather know one place well than see a new one every trip. Get on the early list and you'll hear first when it opens.</p>
        <p className="mt-3 font-body text-[14px] leading-[1.5] text-[#6D6057]">What we're planning: member rates on stays, deals for valley locals, first invites to events, and a newsletter worth opening.</p>
        <form onSubmit={submit} noValidate className="mx-auto mt-7 grid max-w-[620px] gap-x-4 gap-y-4 text-left md:grid-cols-2">
          <label className="block font-body text-[13px] font-medium tracking-[-0.01em] text-[#1F3125] md:col-span-2">
            Email <span aria-hidden="true" className="text-[#4A6E57]">*</span>
            <input name="email" type="email" autoComplete="email" required placeholder="Your email address" className="mt-2 block h-[52px] w-full rounded-[8px] border border-[#CFC4BC] bg-[#FFFCFB] px-4 font-body text-[15px] text-[#1F3125] shadow-[0_1px_2px_rgba(31,49,37,0.035)] outline-none transition-colors placeholder:text-[#978C84] hover:border-[#AFA69C] focus:border-[#4A6E57] focus:ring-2 focus:ring-[#4A6E57]/15" />
          </label>
          <label className="block min-w-0 font-body text-[13px] font-medium tracking-[-0.01em] text-[#1F3125]">
            Which season brings you up here? <span className="font-normal text-[#8A8078]">(optional)</span>
            <span className="relative mt-2 block">
              <select name="season" defaultValue="" className="block h-[52px] w-full appearance-none rounded-[8px] border border-[#CFC4BC] bg-[#FFFCFB] py-3 pl-4 pr-11 font-body text-[15px] font-normal text-[#1F3125] shadow-[0_1px_2px_rgba(31,49,37,0.035)] outline-none transition-colors hover:border-[#AFA69C] focus:border-[#4A6E57] focus:ring-2 focus:ring-[#4A6E57]/15">
                <option value="">Select a season</option>
                <option>Winter</option><option>Summer</option><option>Fall</option><option>All 4</option>
              </select>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-2.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#4A6E57]"><path d="m6 9 6 6 6-6" /></svg>
            </span>
          </label>
          <label className="block min-w-0 font-body text-[13px] font-medium tracking-[-0.01em] text-[#1F3125]">
            Where's home? <span className="font-normal text-[#8A8078]">(optional)</span>
            <span className="relative mt-2 block">
              <select name="home" defaultValue="" className="block h-[52px] w-full appearance-none rounded-[8px] border border-[#CFC4BC] bg-[#FFFCFB] py-3 pl-4 pr-11 font-body text-[15px] font-normal text-[#1F3125] shadow-[0_1px_2px_rgba(31,49,37,0.035)] outline-none transition-colors hover:border-[#AFA69C] focus:border-[#4A6E57] focus:ring-2 focus:ring-[#4A6E57]/15">
                <option value="">Select an area</option>
                <option>Heber Valley / Wasatch Back</option><option>Salt Lake or Provo area</option><option>Somewhere else</option>
              </select>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-2.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#4A6E57]"><path d="m6 9 6 6 6-6" /></svg>
            </span>
          </label>
          <div className="pt-2 text-center md:col-span-2">
            <button type="submit" disabled={status === "sending"} className="inline-flex h-12 min-w-[190px] items-center justify-center rounded-[8px] bg-[#4A6E57] px-7 font-body text-[15px] font-medium text-white transition-colors hover:bg-[#3C6049] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] disabled:opacity-60">{status === "sending" ? "Sending…" : "Get early access"}</button>
            <p className="mt-1.5 font-body text-[12px] leading-5 text-[#6D6057]">Free to join the list. Unsubscribe anytime.</p>
            {message && <p role="status" className="mt-3 font-body text-[14px] text-[#1F3125]">{message}</p>}
          </div>
        </form>
      </div>
    </section>
  );
};
