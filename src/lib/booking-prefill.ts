export type BookingPrefill = { start?: string; end?: string; guests?: number };
export type BookingDay = { date: string; available: boolean; minimumStay: number; maximumStay: number; arrivalAllowed: boolean; departureAllowed: boolean };
const parse = (value: string) => new Date(value + "T12:00:00Z");

function isDateKey(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parse(value);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Only itinerary inputs are read; prices and attribution are not booking inputs. */
export function parseBookingPrefill(search: string, today: string, maxGuests: number): BookingPrefill {
  const params = new URLSearchParams(search);
  const result: BookingPrefill = {};
  const guests = params.get("numberOfGuests");
  if (guests && /^\d+$/.test(guests) && Number.isSafeInteger(Number(guests)) && Number(guests) >= 1 && Number(guests) <= maxGuests) {
    result.guests = Number(guests);
  }
  const start = params.get("start"), end = params.get("end");
  if (!isDateKey(today)) return result;
  const current = parse(today);
  const last = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + 12, 0)).toISOString().slice(0, 10);
  if (isDateKey(start) && isDateKey(end) && start >= today && start < end && end <= last) {
    result.start = start;
    result.end = end;
  }
  return result;
}

/** Shared by manual selection and prefill; missing days never imply availability. */
export function validBookingDeparture(data: Record<string, BookingDay>, start: string, end: string): boolean {
  const arrival = data[start], departure = data[end];
  if (!arrival || !departure || !arrival.arrivalAllowed || end <= start || !departure.departureAllowed) return false;
  const nights = Math.round((parse(end).getTime() - parse(start).getTime()) / 86400000);
  if (nights < Math.max(1, arrival.minimumStay || 1) || (arrival.maximumStay > 0 && nights > arrival.maximumStay)) return false;
  for (let n = 0; n < nights; n++) {
    const date = new Date(parse(start).getTime() + n * 86400000).toISOString().slice(0, 10);
    if (!data[date]?.available) return false;
  }
  return true;
}
