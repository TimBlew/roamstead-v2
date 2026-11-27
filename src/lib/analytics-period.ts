export const REPORTING_TIMEZONE = "America/Denver";
export function businessDate(date: Date, timeZone = REPORTING_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
export function addDays(date: string, days: number): string {
  return new Date(Date.parse(date + "T12:00:00Z") + days * 86400000).toISOString().slice(0, 10);
}
/** Resolve calendar midnight with the offset on that date, including DST changes. */
export function businessMidnight(date: string): Date {
  const nominal = Date.parse(date + "T00:00:00Z");
  let instant = nominal;
  for (let i = 0; i < 3; i++) {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: REPORTING_TIMEZONE, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(new Date(instant));
    const p = Object.fromEntries(parts.map(part => [part.type, part.value]));
    const wall = Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}Z`);
    instant += nominal - wall;
  }
  return new Date(instant);
}
export function reportingPeriod(days: number, now = new Date()) {
  const today = businessDate(now), startDate = addDays(today, 1 - days);
  return { timeZone: REPORTING_TIMEZONE, startDate, endDate: today, since: businessMidnight(startDate).toISOString(), until: now.toISOString(), partial: true };
}
export function chartWindows(days: number, now = new Date()) {
  const period = reportingPeriod(days, now);
  const windows: { start: string; end: string; since: string; until: string; partial: boolean }[] = [];
  for (let start = period.startDate; start <= period.endDate;) {
    const weekday = new Date(start + "T12:00:00Z").getUTCDay();
    const monthly = days === 365;
    const next = monthly
      ? new Date(Date.UTC(Number(start.slice(0, 4)), Number(start.slice(5, 7)), 1)).toISOString().slice(0, 10)
      : addDays(start, days === 7 ? 1 : 7 - weekday);
    const end = next > period.endDate ? period.endDate : addDays(next, -1);
    windows.push({ start, end, since: businessMidnight(start).toISOString(), until: next > period.endDate ? period.until : businessMidnight(next).toISOString(), partial: next > period.endDate || (monthly ? !start.endsWith("-01") : days !== 7 && weekday !== 0) });
    start = next;
  }
  return windows;
}
