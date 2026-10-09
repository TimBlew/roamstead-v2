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
        <p className="mt-1 font-body text-[13px] font-medium text-[#4A6E57]">Coming soon</p>
        <h2 className="mt-2 font-heading text-[34px] leading-[1.12] tracking-[-0.04em] text-[#1F3125] md:text-[48px]">For people who come back</h2>
        <p className="mt-3 font-body text-[16px] leading-[1.55] text-[#6D6057]">We're building a membership for the 4-Seasoners, the people who'd rather know one place well than see a new one every trip. Get on the early list and you'll hear first when it opens.</p>
        <p className="mt-3 font-body text-[14px] leading-[1.5] text-[#6D6057]">What we're planning: member rates on stays, deals for valley locals, first invites to events, and a newsletter worth opening.</p>
        <form onSubmit={submit} noValidate className="mx-auto mt-5 grid max-w-[580px] gap-3 text-left md:grid-cols-2">
          <label className="font-body text-[13px] text-[#1F3125] md:col-span-2">Email <span aria-hidden="true">*</span><input name="email" type="email" required placeholder="Your email" className="mt-2 w-full rounded-[7px] border border-[#CFC4BC] bg-white px-4 py-3 text-[15px] outline-offset-2" /></label>
          <label className="font-body text-[13px] text-[#1F3125]">Which season brings you up here? (optional)<select name="season" defaultValue="" className="mt-2 w-full rounded-[7px] border border-[#CFC4BC] bg-white px-3 py-3 text-[14px]"><option value="">Select a season</option><option>Winter</option><option>Summer</option><option>Fall</option><option>All 4</option></select></label>
          <label className="font-body text-[13px] text-[#1F3125]">Where's home? (optional)<select name="home" defaultValue="" className="mt-2 w-full rounded-[7px] border border-[#CFC4BC] bg-white px-3 py-3 text-[14px]"><option value="">Select an area</option><option>Heber Valley / Wasatch Back</option><option>Salt Lake or Provo area</option><option>Somewhere else</option></select></label>
          <div className="text-center md:col-span-2"><button type="submit" disabled={status === "sending"} className="rounded-[7px] bg-[#4A6E57] px-8 py-3 font-body font-medium text-white disabled:opacity-60">{status === "sending" ? "Sending…" : "Get early access"}</button><p className="mt-3 text-[12px] text-[#6D6057]">Free to join the list. Unsubscribe anytime.</p>{message && <p role="status" className="mt-3 text-[14px] text-[#1F3125]">{message}</p>}</div>
        </form>
      </div>
    </section>
  );
};
