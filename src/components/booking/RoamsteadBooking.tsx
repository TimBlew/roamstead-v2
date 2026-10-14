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
  const hostawayCheckoutUrl = checkIn && checkOut ? `https://roamstead_ventures.holidayfuture.com/checkout/${listingId}?${new URLSearchParams({ start: checkIn, end: checkOut, numberOfGuests: String(adults + children) }).toString()}` : "";
  const maxGuests = ({ 455635: 10, 455631: 4, 455632: 8, 455633: 4 } as Record<number, number>)[listingId] ?? 4;
  const stayNights = checkIn && checkOut ? Math.round((parse(checkOut).getTime() - parse(checkIn).getTime()) / 86400000) : 0;
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
        if (controller.signal.aborted) return;
        const next: Record<string, Day> = {};
        for (const day of payload.days) next[day.date] = day;
        setData(previous => ({ ...previous, ...next }));
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
    else {
      const minimum = Math.max(1, data[checkIn]?.minimumStay || 1);
      const nights = Math.round((parse(value).getTime() - parse(checkIn).getTime()) / 86400000);
      const maximum = data[checkIn]?.maximumStay;
      setMessage(nights < minimum
        ? `This check-in requires at least ${minimum} nights. Choose a later check-out date.`
        : maximum && nights > maximum
          ? `This check-in allows up to ${maximum} nights. Choose an earlier check-out date.`
          : !day.departureAllowed
            ? "Check-out is not available on that date. Choose another check-out date."
            : "Those dates cannot be booked together. Choose another check-out date.");
    }
  };
  const renderMonth = (value: Date) => (
    <div className="min-w-0 flex-1 self-start" key={key(value)}>
      <h3 className="mb-1.5 text-center font-heading text-[19px] md:text-[20px] font-medium tracking-[-0.04em] text-[#1F3125]">{monthText.format(value)}</h3>
      <div className="grid grid-cols-7 auto-rows-[33px] content-start gap-y-0 md:auto-rows-[38px] md:gap-y-[4px]">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day} className="flex h-[26px] items-center justify-center text-center font-body text-[12px] font-semibold text-[#786D65]">{day}</span>)}
        {monthDays(value).map((n, index) => {
          if (n === null) return <span key={`empty-${index}`} />;
          const date = key(new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), n)));
          const item = data[date];
          const past = date < key(today);
          const available = !past && item?.available;
          const selected = date === checkIn || date === checkOut;
          const inRange = checkIn && checkOut && date > checkIn && date < checkOut;
          const canDepart = Boolean(checkIn && !checkOut && validDeparture(checkIn, date));
          const canClick = !loading && (Boolean(available && item?.arrivalAllowed) || canDepart);
          return <button key={date} type="button" aria-label={dateText.format(parse(date)) + (canDepart ? " available for check-out" : available ? " available" : " unavailable")} aria-pressed={Boolean(selected)} disabled={!canClick} onClick={() => selectDate(date)}
            style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, maxWidth: 32, maxHeight: 32, padding: 0, alignSelf: "center", justifySelf: "center" }} className={`inline-flex shrink-0 items-center justify-center rounded-[8px] font-body text-[14px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] ${selected ? "bg-[#4A6E57] text-white" : inRange ? "bg-[#E5EDE7] text-[#1F3125]" : available || canDepart ? "text-[#1F3125] hover:bg-[#E5EDE7]" : "cursor-not-allowed text-[#B5ADA7] line-through"}`}>{n}</button>;
        })}
      </div>
    </div>
  );
  if (mode === "fallback") return <div><HostawayBooking listingId={listingId} fallbackUrl={fallbackUrl} /></div>;
  return (
    <div className="mx-auto w-full max-w-[720px]">
      {step > 0 && mode === "custom" ? <div className="space-y-[16px]">
        <button type="button" onClick={() => setStep(0)} className="rounded-[8px] font-body text-[13px] font-medium text-[#4A6E57] transition-colors hover:text-[#1F3125] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57]">← Edit dates</button>
        <div className="flex flex-wrap items-center justify-between gap-[8px] rounded-[10px] bg-[#F4EFEC] px-[16px] py-[12px] font-body text-[14px] text-[#1F3125]">
          <span>{checkIn && dateText.format(parse(checkIn))} – {checkOut && dateText.format(parse(checkOut))}</span>
          <span className="text-[#6D6057]">{stayNights} {stayNights === 1 ? "night" : "nights"}</span>
        </div>
        <div className="space-y-[12px]">
          <h3 className="font-heading text-[23px] font-medium tracking-[-0.03em] text-[#1F3125]">Guests</h3>
          {([{ label: "Adults", count: adults, update: setAdults, min: 1 }, { label: "Children", count: children, update: setChildren, min: 0 }] as const).map(({label,count,update,min}) => <div key={label} className="flex items-center justify-between border-b border-[#E7DFDB] py-[8px] font-body text-[14px] text-[#1F3125]">
            <span>{label}</span><div className="flex items-center gap-[12px]"><button type="button" aria-label={`Remove ${label.toLowerCase()}`} disabled={count <= min} onClick={() => update(Math.max(min,count-1))} className="flex h-[44px] w-[44px] items-center justify-center rounded-[8px] border border-[#D8CCC4] bg-[#FFFCFB] text-[#1F3125] transition-[background-color,border-color] duration-200 hover:border-[#9CAD9E] hover:bg-[#F4EFEC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#D8CCC4] disabled:hover:bg-[#FFFCFB]">−</button><span className="w-[16px] text-center">{count}</span><button type="button" aria-label={`Add ${label.toLowerCase()}`} disabled={adults+children>=maxGuests} onClick={() => update(Math.min(maxGuests-(label === "Adults" ? children : adults),count+1))} className="flex h-[44px] w-[44px] items-center justify-center rounded-[8px] border border-[#D8CCC4] bg-[#FFFCFB] text-[#1F3125] transition-[background-color,border-color] duration-200 hover:border-[#9CAD9E] hover:bg-[#F4EFEC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#D8CCC4] disabled:hover:bg-[#FFFCFB]">+</button></div>
          </div>)}
          <p className="font-body text-[12px] text-[#786D65]">Up to {maxGuests} guests</p>
        </div>
        <div className="rounded-[12px] border border-[#E7DFDB] bg-[#FFFCFB] px-[14px] py-[12px] sm:px-[20px] sm:py-[18px]">
          <div className="flex items-start gap-[8px] sm:gap-[12px]">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#4A6E57" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="mt-[2px] h-[20px] w-[20px] shrink-0 sm:h-[24px] sm:w-[24px]">
              <path d="M12 2.5 20 6v6c0 5.2-3.3 8.3-8 9.5C7.3 20.3 4 17.2 4 12V6l8-3.5Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <div className="min-w-0">
              <h3 className="max-w-[30ch] font-heading text-[18px] font-medium leading-[1.2] tracking-[-0.03em] text-[#1F3125] sm:text-[21px]">One step closer to your stay.</h3>
              <p className="mt-[6px] max-w-[51ch] font-body text-[13px] leading-[1.45] text-[#6D6057] sm:text-[14px]">Continue to review your final total, confirm your details, and complete your reservation securely.</p>
            </div>
          </div>
        </div>
        <a href={hostawayCheckoutUrl || undefined} aria-disabled={!checkIn || !checkOut || loading} onClick={event => { if (!checkIn || !checkOut || loading) event.preventDefault(); }} className={`flex min-h-[48px] w-full items-center justify-center rounded-[8px] bg-[#4A6E57] px-[16px] text-center font-body text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_13px_rgba(31,49,37,0.11)] transition-[background-color,box-shadow] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] ${!checkIn || !checkOut || loading ? "cursor-not-allowed opacity-50" : "hover:bg-[#3C6049] hover:shadow-[0_6px_17px_rgba(31,49,37,0.16)]"}`}>Continue to booking →</a>
      </div> : mode === "checking" ? <div role="status" className="flex min-h-[350px] items-center justify-center font-body text-[15px] text-[#6D6057]">Checking live availability…</div> : <>
        <div className="mb-[4px] flex items-center justify-between gap-[8px] md:mb-[8px] md:gap-[12px]">
          <button type="button" aria-label="Previous month" disabled={month <= startMonth(today)} onClick={() => setMonth(shift(month, -1))} className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[8px] border border-[#D8CCC4] bg-[#FFFCFB] text-[#1F3125] transition-[background-color,border-color] duration-200 hover:border-[#9CAD9E] hover:bg-[#F4EFEC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-[#D8CCC4] disabled:hover:bg-[#FFFCFB]">‹</button>
          <p className="min-w-0 text-center font-body text-[12px] leading-[1.3] text-[#6D6057] md:text-[13px]">Choose check-in and check-out dates</p>
          <button type="button" aria-label="Next month" disabled={month >= lastMonth} onClick={() => setMonth(shift(month, 1))} className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[8px] border border-[#D8CCC4] bg-[#FFFCFB] text-[#1F3125] transition-[background-color,border-color] duration-200 hover:border-[#9CAD9E] hover:bg-[#F4EFEC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-[#D8CCC4] disabled:hover:bg-[#FFFCFB]">›</button>
        </div>
        {loading && <p role="status" className="mb-[8px] text-center font-body text-[12px] text-[#6D6057]">Updating availability…</p>}
        <div className={`grid grid-cols-1 items-start gap-[20px] md:grid-cols-2 md:gap-[28px] ${loading ? "opacity-40" : ""}`}>
          {renderMonth(month)}
          <div className="hidden md:block">{renderMonth(shift(month, 1))}</div>
        </div>
        <div className="mt-[8px] grid grid-cols-2 gap-[8px] border-t border-[#E7DFDB] pt-2.5 md:mt-[16px] md:gap-[12px] md:pt-[16px]">
          {([{ label: "Check-in", value: checkIn }, { label: "Check-out", value: checkOut }] as const).map(({ label, value }) => (
            <div key={label} className="flex min-w-0 flex-col justify-center rounded-[9px] border border-[#D8CCC4] px-[12px] py-[12px] text-left md:px-[12px] md:py-[12px]">
              <p className="font-body text-[11px] font-medium uppercase leading-[16px] tracking-[0.08em] text-[#786D65]">{label}</p>
              <p className="mt-[4px] whitespace-nowrap font-body text-[13px] font-medium leading-[20px] text-[#1F3125] md:text-[15px]">{value ? dateText.format(parse(value)) : "Choose date"}</p>
            </div>
          ))}
        </div>
        {message && <p role="status" className="mt-[12px] font-body text-[13px] text-[#8C5641]">{message}</p>}
        <div className="mt-[8px] flex flex-col items-center gap-0 sm:flex-row sm:items-center md:gap-[8px]">
          <button type="button" disabled={!checkOut || loading} onClick={() => { if (checkOut && !loading) setStep(1); }}
            className={`inline-flex min-h-[44px] w-full flex-1 items-center justify-center whitespace-nowrap rounded-[8px] bg-[#4A6E57] px-[12px] text-center font-body text-[13px] md:min-h-[50px] md:px-[24px] md:text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_13px_rgba(31,49,37,0.11)] transition-[background-color,box-shadow] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] ${!checkOut || loading ? "cursor-not-allowed opacity-50" : "hover:bg-[#3C6049] hover:shadow-[0_6px_17px_rgba(31,49,37,0.16)]"}`}>Continue to booking →</button>
          <button type="button" onClick={() => { setCheckIn(null); setCheckOut(null); setMessage(""); }} className="min-h-[44px] rounded-[8px] px-[20px] font-body text-[13px] font-medium text-[#4A6E57] transition-colors hover:bg-[#F4EFEC] hover:text-[#1F3125] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A6E57] md:text-[14px]">Clear dates</button>
        </div>
        <p className="mt-0.5 text-center font-body text-[11px] leading-[1.45] md:mt-[8px] md:text-[12px] md:leading-5 text-[#786D65]">Availability is checked live. Confirm dates, pricing and payment securely with our booking partner.</p>
      </>}
    </div>
  );
}
