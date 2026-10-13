"use client";

import { useEffect, useMemo, useState } from "react";
import { HostawayBooking } from "./HostawayBooking";

type Day = { date: string; available: boolean; minimumStay: number; maximumStay: number; arrivalAllowed: boolean; departureAllowed: boolean };
type CalendarResponse = { days: Day[]; configured?: boolean; error?: string };
const monthText = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const dateText = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
function key(date: Date) { return date.toISOString().slice(0, 10); }
function parse(value: string) { return new Date(value + "T12:00:00Z"); }
function startMonth(date: Date) { return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)); }
function shift(date: Date, months: number) { return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1)); }
function addDays(date: Date, days: number) { return new Date(date.getTime() + days * 86400000); }
function monthDays(month: Date) {
  const count = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
  return [...Array(month.getUTCDay()).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)] as (number | null)[];
}
export function RoamsteadBooking({ listingId, fallbackUrl }: { listingId: number; fallbackUrl: string }) {
  const today = useMemo(() => new Date(new Date().toISOString().slice(0, 10) + "T12:00:00Z"), []);
  const [month, setMonth] = useState(() => startMonth(new Date()));
  const [data, setData] = useState<Record<string, Day>>({});
  const [mode, setMode] = useState<"checking" | "custom" | "fallback">("checking");
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestEmail, setGuestEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [quote, setQuote] = useState<{ totalPrice: number; currency: string; components: { label: string; amount: number }[] } | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [quoteKey, setQuoteKey] = useState("");
  const currentQuoteKey = [listingId, checkIn, checkOut, adults, children].join(":");
  const quoteIsCurrent = Boolean(quote && quoteKey === currentQuoteKey);
  const maxGuests = ({455635: 10, 455631: 4, 455632: 8, 455633: 4} as Record<number, number>)[listingId] ?? 4;
  const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: quote?.currency || "USD" }).format(value);
  useEffect(() => {
    if (!checkIn || !checkOut || step < 1) return;
    const controller = new AbortController();
    setQuote(null); setQuoteKey(""); setQuoteError(""); setQuoteLoading(true);
    fetch("/api/hostaway/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listingId, checkIn, checkOut, adults, children }), signal: controller.signal })
      .then(async response => { const result = await response.json(); if (!response.ok) throw new Error(result.error || "Pricing unavailable"); setQuote(result); setQuoteKey([listingId, checkIn, checkOut, adults, children].join(":")); })
      .catch(error => { if (!controller.signal.aborted) setQuoteError(error instanceof Error ? error.message : "Pricing unavailable"); })
      .finally(() => { if (!controller.signal.aborted) setQuoteLoading(false); });
    return () => controller.abort();
  }, [listingId, checkIn, checkOut, adults, children, step > 0]);
  const lastMonth = shift(startMonth(today), 11);
  useEffect(() => {
    const controller = new AbortController();
    const startDate = key(month);
    const endDate = key(addDays(shift(month, 2), -1));
    setLoading(true);
    fetch(`/api/hostaway/availability?listingId=${listingId}&startDate=${startDate}&endDate=${endDate}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as CalendarResponse;
        if (!response.ok || !Array.isArray(payload.days)) throw new Error(payload.error || "Availability unavailable");
        const next: Record<string, Day> = {};
        for (const day of payload.days) next[day.date] = day;
        setData(next);
        setMode("custom");
        setMessage("");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setMode("fallback");
        setMessage(error instanceof Error ? error.message : "Availability unavailable");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [listingId, month]);
  const validDeparture = (start: string, end: string) => {
    const arrival = data[start], departure = data[end];
    if (!arrival || !departure || end <= start || !departure.departureAllowed) return false;
    const nights = Math.round((parse(end).getTime() - parse(start).getTime()) / 86400000);
    if (nights < Math.max(1, arrival.minimumStay || 1) || (arrival.maximumStay > 0 && nights > arrival.maximumStay)) return false;
    for (let n = 0; n < nights; n++) if (!data[key(addDays(parse(start), n))]?.available) return false;
    return true;
  };
  const selectDate = (value: string) => {
    const day = data[value];
    if (!day) return;
    if (!checkIn || checkOut || value <= checkIn) {
      if (!day.available || !day.arrivalAllowed) return;
      setCheckIn(value); setCheckOut(null); setMessage(""); return;
    }
    if (validDeparture(checkIn, value)) { setCheckOut(value); setMessage(""); }
    else setMessage("Those dates cannot be booked together. Choose another check-out date.");
  };
  const renderMonth = (value: Date) => (
    <div className="min-w-0 flex-1 self-start" key={key(value)}>
      <h3 className="mb-1.5 text-center font-heading text-[19px] md:text-[20px] font-medium tracking-[-0.04em] text-[#1F3125]">{monthText.format(value)}</h3>
      <div className="grid grid-cols-7 auto-rows-[33px] content-start gap-y-0 md:auto-rows-[38px] md:gap-y-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day} className="flex h-[26px] items-center justify-center text-center font-body text-[12px] font-semibold text-[#786D65]">{day}</span>)}
        {monthDays(value).map((n, index) => {
          if (n === null) return <span key={`empty-${index}`} />;
          const date = key(new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), n)));
          const item = data[date];
          const past = date < key(today);
          const available = !past && item?.available;
          const selected = date === checkIn || date === checkOut;
          const inRange = checkIn && checkOut && date > checkIn && date < checkOut;
          const canClick = !loading && (Boolean(available && item?.arrivalAllowed) || Boolean(checkIn && !checkOut && validDeparture(checkIn, date)));
          return <button key={date} type="button" aria-label={dateText.format(parse(date)) + (available ? " available" : " unavailable")} aria-pressed={Boolean(selected)} disabled={!canClick} onClick={() => selectDate(date)}
            style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, maxWidth: 32, maxHeight: 32, padding: 0, alignSelf: "center", justifySelf: "center" }} className={`inline-flex shrink-0 items-center justify-center rounded-[8px] font-body text-[14px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] ${selected ? "bg-[#4A6E57] text-white" : inRange ? "bg-[#E5EDE7] text-[#1F3125]" : available ? "text-[#1F3125] hover:bg-[#E5EDE7]" : "cursor-not-allowed text-[#B5ADA7] line-through"}`}>{n}</button>;
        })}
      </div>
    </div>
  );
  if (mode === "fallback") return <div><HostawayBooking listingId={listingId} fallbackUrl={fallbackUrl} /></div>;
  return (
    <div className="mx-auto w-full max-w-[720px]">
      {mode === "custom" && <div className="mb-4 flex justify-between border-b border-[#E7DFDB] pb-3 font-body text-[12px] text-[#4A6E57]"><span>Dates</span><span>Guests</span><span>Details</span><span>Review</span></div>}
      {step > 0 && mode === "custom" ? <div className="space-y-5">
        <button type="button" onClick={() => setStep(step-1)} className="font-body text-[14px] text-[#4A6E57]">← Back</button>
        <p className="rounded-[10px] bg-[#F4EFEC] p-3 font-body text-[14px]">{checkIn && dateText.format(parse(checkIn))} – {checkOut && dateText.format(parse(checkOut))}</p>
        {step === 1 && <div className="space-y-4"><h3 className="font-heading text-[26px] text-[#1F3125]">Who's coming?</h3><div className="flex items-center justify-between border-b border-[#E7DFDB] py-3"><span>Adults</span><div className="flex items-center gap-5"><button type="button" onClick={() => setAdults(Math.max(1,adults-1))}>−</button>{adults}<button type="button" disabled={adults+children>=maxGuests} onClick={() => setAdults(Math.min(maxGuests-children,adults+1))}>+</button></div></div><div className="flex items-center justify-between border-b border-[#E7DFDB] py-3"><span>Children</span><div className="flex items-center gap-5"><button type="button" onClick={() => setChildren(Math.max(0,children-1))}>−</button>{children}<button type="button" disabled={adults+children>=maxGuests} onClick={() => setChildren(Math.min(maxGuests-adults,children+1))}>+</button></div></div><p className="font-body text-[12px] text-[#786D65]">Maximum {maxGuests} guests for this home.</p><button type="button" disabled={!quoteIsCurrent || quoteLoading} onClick={() => setStep(2)} className="h-12 w-full rounded-[8px] bg-[#4A6E57] text-white disabled:cursor-not-allowed disabled:opacity-50">Continue →</button></div>}
        {step === 2 && <form onSubmit={(event) => {event.preventDefault();if (quoteIsCurrent && !quoteLoading) setStep(3);}} className="space-y-4"><h3 className="font-heading text-[26px] text-[#1F3125]">Guest details</h3><div className="grid grid-cols-2 gap-3"><label className="block font-body text-[14px]">First name<input required autoComplete="given-name" value={firstName} onChange={event => setFirstName(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-[#D8CCC4] px-3"/></label><label className="block font-body text-[14px]">Last name<input required autoComplete="family-name" value={lastName} onChange={event => setLastName(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-[#D8CCC4] px-3"/></label></div><label className="block font-body text-[14px]">Email address<input required type="email" autoComplete="email" value={guestEmail} onChange={(event) => setGuestEmail(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-[#D8CCC4] px-3"/></label><label className="block font-body text-[14px]">Phone number<input required type="tel" autoComplete="tel" value={phone} onChange={event => setPhone(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-[#D8CCC4] px-3"/></label><button type="submit" disabled={!quoteIsCurrent || quoteLoading} className="h-12 w-full rounded-[8px] bg-[#4A6E57] text-white disabled:cursor-not-allowed disabled:opacity-50">Review stay →</button></form>}
        {step >= 1 && <div aria-live="polite" className="rounded-[10px] border border-[#E7DFDB] bg-[#FFFCFB] p-4">
          <h4 className="font-heading text-[20px] text-[#1F3125]">Your price</h4>
          {quoteLoading ? <p className="mt-2 font-body text-[13px] text-[#6D6057]">Checking live rates…</p> : quoteError ? <p className="mt-2 font-body text-[13px] text-[#8C5641]">{quoteError}</p> : quoteIsCurrent && quote ? <div className="mt-3 space-y-2 font-body text-[14px]">{quote.components.map((line,index) => <div key={index} className="flex justify-between gap-3 text-[#6D6057]"><span>{line.label}</span><span className="shrink-0">{money(line.amount)}</span></div>)}<div className="flex justify-between border-t border-[#E7DFDB] pt-3 font-semibold text-[#1F3125]"><span>Total</span><span>{money(quote.totalPrice)}</span></div></div> : <p className="mt-2 font-body text-[13px] text-[#6D6057]">Preparing your quote…</p>}
        </div>}
        {step === 3 && <div className="space-y-4"><h3 className="font-heading text-[26px] text-[#1F3125]">Review your stay</h3><p className="font-body text-[14px]">{adults} adults · {children} children</p><p className="font-body text-[14px]">{firstName} {lastName} · {guestEmail}</p><p className="rounded-[10px] bg-[#F4EFEC] p-4 font-body text-[13px] leading-6 text-[#6D6057]">Live pricing and secure payment are being integrated. No reservation is placed or payment collected in this preview.</p><button type="button" disabled className="h-12 w-full rounded-[8px] bg-[#4A6E57] text-white opacity-50">Secure checkout coming soon</button></div>}
      </div> : mode === "checking" ? <div role="status" className="flex min-h-[350px] items-center justify-center font-body text-[15px] text-[#6D6057]">Checking live availability…</div> : <>
        <div className="mb-1 flex items-center justify-between gap-2 md:mb-2 md:gap-3">
          <button type="button" aria-label="Previous month" disabled={month <= startMonth(today)} onClick={() => setMonth(shift(month, -1))} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D8CCC4] text-[#1F3125] disabled:opacity-25">‹</button>
          <p className="min-w-0 text-center font-body text-[12px] leading-[1.3] text-[#6D6057] md:text-[13px]">Choose check-in and check-out dates</p>
          <button type="button" aria-label="Next month" disabled={month >= lastMonth} onClick={() => setMonth(shift(month, 1))} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D8CCC4] text-[#1F3125] disabled:opacity-25">›</button>
        </div>
        <div className={`grid grid-cols-1 items-start gap-5 md:grid-cols-2 md:gap-7 ${loading ? "opacity-40" : ""}`}>
          {renderMonth(month)}
          <div className="hidden md:block">{renderMonth(shift(month, 1))}</div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#E7DFDB] pt-2.5 md:mt-4 md:gap-3 md:pt-4">
          {([{ label: "Check-in", value: checkIn }, { label: "Check-out", value: checkOut }] as const).map(({ label, value }) => (
            <div key={label} className="flex min-w-0 flex-col justify-center rounded-[9px] border border-[#D8CCC4] px-3 py-3 text-left md:px-3 md:py-3">
              <p className="font-body text-[11px] font-medium uppercase leading-[16px] tracking-[0.08em] text-[#786D65]">{label}</p>
              <p className="mt-1 whitespace-nowrap font-body text-[13px] font-medium leading-[20px] text-[#1F3125] md:text-[15px]">{value ? dateText.format(parse(value)) : "Choose date"}</p>
            </div>
          ))}
        </div>
        {message && <p role="status" className="mt-3 font-body text-[13px] text-[#8C5641]">{message}</p>}
        <div className="mt-2 flex flex-col items-center gap-0 sm:flex-row sm:items-center md:gap-2">
          <button type="button" disabled={!checkOut} onClick={() => { if (checkOut) setStep(1); }}
            className={`inline-flex min-h-[44px] w-full flex-1 items-center justify-center whitespace-nowrap rounded-[8px] bg-[#4A6E57] px-3 text-center font-body text-[13px] md:min-h-[50px] md:px-6 md:text-[15px] font-medium text-white ${!checkOut ? "cursor-not-allowed opacity-50" : "hover:bg-[#3C6049]"}`}>Continue to booking →</button>
          <button type="button" onClick={() => { setCheckIn(null); setCheckOut(null); setMessage(""); }} className="min-h-8 px-5 font-body text-[13px] md:min-h-11 md:text-[14px] font-medium text-[#4A6E57]">Clear dates</button>
        </div>
        <p className="mt-0.5 text-center font-body text-[11px] leading-[1.45] md:mt-2 md:text-[12px] md:leading-5 text-[#786D65]">Availability is checked live. Confirm dates, pricing and payment securely with our booking partner.</p>
      </>}
    </div>
  );
}
