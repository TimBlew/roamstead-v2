import { sanitizeFirstTouchFields } from "@/lib/booking-analytics";

export function firstTouchSummary(value: unknown): string {
  const a = sanitizeFirstTouchFields(value);
  return [a.utm_source || a.source, a.utm_medium, a.utm_campaign, a.referrer_host, a.landing_path].filter(Boolean).join(" / ") || "Direct";
}

/** Sheet schema stays unchanged. Prefer campaign tokens over referrer and landing. */
export function inquirySource(value: unknown): string {
  const a = sanitizeFirstTouchFields(value);
  const segments = [
    ["s", a.utm_source || a.source], ["m", a.utm_medium], ["c", a.utm_campaign],
    ["r", a.referrer_host], ["l", a.landing_path],
  ].filter((entry): entry is string[] => !!entry[1]);
  const render = () => "roamstead-co.com" + segments.map(([key, val]) => `|${key}=${val}`).join("");
  // Drop whole segments rather than turn a truncated hostname/token into a false source.
  for (const key of ["l", "r", "c", "m", "s"]) {
    if (render().length <= 100) break;
    const index = segments.findIndex(entry => entry[0] === key);
    if (index >= 0) segments.splice(index, 1);
  }
  return render();
}

export function parseInquirySource(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 100 || !value.startsWith("roamstead-co.com|")) return null;
  const fields: Record<string, string> = {};
  const keys: Record<string, string> = { s: "utm_source", m: "utm_medium", c: "utm_campaign", r: "referrer_host", l: "landing_path" };
  for (const segment of value.split("|").slice(1)) {
    const [key, val] = segment.split("=");
    if (keys[key] && val) fields[keys[key]] = val;
  }
  const safe = sanitizeFirstTouchFields(fields);
  return Object.keys(safe).length ? firstTouchSummary(safe) : null;
}
