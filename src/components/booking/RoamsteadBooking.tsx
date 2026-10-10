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
  const selectDate = (value: string) => {
    const day = data[value];
    if (!day) return;
    if (!checkIn || checkOut || value <= checkIn) {
      if (!day.available || !day.arrivalAllowed) return;
      setCheckIn(value); setCheckOut(null); setMessage(""); return;
    }
    const arrival = data[checkIn];
    const nights = Math.round((parse(value).getTime() - parse(checkIn).getTime()) / 86400000);
    let valid = Boolean(day.departureAllowed && arrival && nights >= arrival.minimumStay && nights <= arrival.maximumStay);
    for (let n = 0; n < nights; n++) {
      const intermediate = data[key(addDays(parse(checkIn), n))];
      if (!intermediate?.available) valid = false;
    }
    if (valid) { setCheckOut(value); setMessage(""); }
    else setMessage("Those dates cannot be booked together. Try another departure date.");
  };
  const renderMonth = (value: Date) => (
    <div className="min-w-0 flex-1 self-start" key={key(value)}>
      <h3 className="mb-1.5 text-center font-heading text-[19px] sm:mb-2 sm:text-[20px] font-medium tracking-[-0.04em] text-[#1F3125]">{monthText.format(value)}</h3>
      <div className="grid grid-cols-7 auto-rows-[36px] content-start gap-y-0.5 sm:auto-rows-[38px] sm:gap-y-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day} className="flex h-[28px] items-center justify-center text-center font-body text-[12px] font-semibold text-[#786D65]">{day}</span>)}
        {monthDays(value).map((n, index) => {
          if (n === null) return <span key={`empty-${index}`} />;
          const date = key(new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), n)));
          const item = data[date];
          const past = date < key(today);
          const available = !past && item?.available;
          const selected = date === checkIn || date === checkOut;
          const inRange = checkIn && checkOut && date > checkIn && date < checkOut;
          const canClick = available || Boolean(checkIn && !checkOut && !past && item?.departureAllowed);
          return <button key={date} type="button" aria-label={dateText.format(parse(date)) + (available ? " available" : " unavailable")} aria-pressed={Boolean(selected)} disabled={!canClick} onClick={() => selectDate(date)}
            className={`mx-auto flex h-9 w-9 max-w-full items-center justify-center rounded-[8px] font-body text-[14px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] ${selected ? "bg-[#4A6E57] text-white" : inRange ? "bg-[#E5EDE7] text-[#1F3125]" : available ? "text-[#1F3125] hover:bg-[#E5EDE7]" : "cursor-not-allowed text-[#B5ADA7] line-through"}`}>{n}</button>;
        })}
      </div>
    </div>
  );
  if (mode === "fallback") return <div><HostawayBooking listingId={listingId} fallbackUrl={fallbackUrl} /></div>;
  return (
    <div className="mx-auto w-full max-w-[720px]">
      {mode === "checking" ? <div role="status" className="flex min-h-[350px] items-center justify-center font-body text-[15px] text-[#6D6057]">Checking live availability…</div> : <>
        <div className="mb-2 flex items-center justify-between gap-2 sm:gap-3">
          <button type="button" aria-label="Previous month" disabled={month <= startMonth(today)} onClick={() => setMonth(shift(month, -1))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D8CCC4] text-[#1F3125] disabled:opacity-25">‹</button>
          <p className="min-w-0 text-center font-body text-[12px] leading-4 text-[#6D6057] sm:text-[13px]>Select your arrival and departure</p>
          <button type="button" aria-label="Next month" disabled={month >= lastMonth} onClick={() => setMonth(shift(month, 1))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D8CCC4] text-[#1F3125] disabled:opacity-25">›</button>
        </div>
        <div className={`grid grid-cols-1 items-start gap-5 md:grid-cols-2 md:gap-7 ${loading ? "opacity-40" : ""}`}>
          {renderMonth(month)}
          <div className="hidden md:block">{renderMonth(shift(month, 1))}</div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5 border-t border-[#E7DFDB] pt-3 sm:mt-4 sm:gap-3 sm:pt-4">
          <div className="rounded-[9px] border border-[#D8CCC4] px-2.5 py-2.5 sm:px-3"><p className="font-body text-[11px] font-medium uppercase tracking-[0.08em] text-[#786D65]">Check-in</p><p className="mt-1 font-body text-[15px] font-medium text-[#1F3125]">{checkIn ? dateText.format(parse(checkIn)) : "Choose date"}</p></div>
          <div className="rounded-[9px] border border-[#D8CCC4] px-2.5 py-2.5 sm:px-3"><p className="font-body text-[11px] font-medium uppercase tracking-[0.08em] text-[#786D65]">Check-out</p><p className="mt-1 font-body text-[15px] font-medium text-[#1F3125]">{checkOut ? dateText.format(parse(checkOut)) : "Choose date"}</p></div>
        </div>
        {message && <p role="status" className="mt-3 font-body text-[13px] text-[#8C5641]">{message}</p>}
        <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" aria-disabled={!checkOut} onClick={(event) => { if (!checkOut) event.preventDefault(); }}
            className={`inline-flex min-h-[50px] flex-1 items-center justify-center rounded-[8px] bg-[#4A6E57] px-6 text-center font-body text-[15px] font-medium text-white ${!checkOut ? "cursor-not-allowed opacity-50" : "hover:bg-[#3C6049]"}`}>Continue to booking →</a>
          <button type="button" onClick={() => { setCheckIn(null); setCheckOut(null); setMessage(""); }} className="min-h-9 px-5 font-body text-[13px] sm:min-h-11 sm:text-[14px] font-medium text-[#4A6E57]">Clear dates</button>
        </div>
        <p className="mt-1.5 text-center font-body text-[11px] leading-[1.45] sm:mt-2 sm:text-[12px] sm:leading-5 text-[#786D65]">Availability is checked live. Confirm dates, pricing and payment securely with our booking partner.</p>
      </>}
    </div>
  );
}
