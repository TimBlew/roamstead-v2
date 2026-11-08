/**
 * Pure booking-funnel analytics helpers.
 * Event names and trigger rules live in docs/booking-funnel-events.md.
 * Nothing here talks to Hostaway or to the network.
 */

export const BOOKING_EVENTS = {
  pageView: "booking_page_view",
  dateCheckAttempt: "booking_date_check_attempt",
  dateCheckSuccess: "booking_date_check_success",
  dateCheckUnavailable: "booking_date_check_unavailable",
  dateCheckError: "booking_date_check_error",
  guestStep: "booking_guest_step",
  checkoutHandoff: "hostaway_checkout_click",
} as const;

export type BookingEventName = (typeof BOOKING_EVENTS)[keyof typeof BOOKING_EVENTS];

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];

export type Attribution = Partial<Record<UtmKey | "source" | "referrer_host" | "funnel_ref", string>>;

export const PAGE_VIEW_DEDUPE_MS = 1500;
export const ACTION_DEDUPE_MS = 1000;

const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._~-]{0,63}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FUNNEL_REF = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const OWN_HOSTS = new Set([
  "www.roamstead-co.com",
  "roamstead-co.com",
  "roamstead-v2.vercel.app",
  "localhost",
  "127.0.0.1",
]);

export function sanitizeToken(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!TOKEN.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 7 && digits.length >= trimmed.length - 2) return null;
  return trimmed;
}

export function isOpaqueFunnelRef(value: unknown): value is string {
  return typeof value === "string" && FUNNEL_REF.test(value.toLowerCase());
}

export function attributionFromSearch(search: string): Attribution {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const result: Attribution = {};
  for (const key of UTM_KEYS) {
    const safe = sanitizeToken(params.get(key));
    if (safe) result[key] = safe;
  }
  if (!result.utm_source) {
    const source = sanitizeToken(params.get("source"));
    if (source) result.source = source;
  }
  return result;
}

export function referrerHost(referrer: string, extraOwnHosts: string[] = []): string | null {
  if (typeof referrer !== "string" || !referrer.trim()) return null;
  let url: URL;
  try {
    url = new URL(referrer);
  } catch {
    return null;
  }
  if (url.username || url.password) return null;
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (!host || host.length > 253 || !/^[a-z0-9.-]+$/.test(host)) return null;
  const own = new Set(OWN_HOSTS);
  for (const extra of extraOwnHosts) {
    const normalized = extra.trim().toLowerCase().replace(/\.$/, "");
    if (normalized) own.add(normalized);
  }
  if (own.has(host)) return null;
  if (host.endsWith(".vercel.app") && host.includes("roamstead")) return null;
  return host;
}

function storedHost(value: unknown): string | null {
  if (typeof value !== "string" || !value || /[/?:@\s]/.test(value)) return null;
  return referrerHost(`https://${value}/`);
}

export function mergeAttribution(
  stored: Partial<Attribution> | null | undefined,
  search: string,
  referrer: string,
  ownHost: string,
  nextFunnelRef: string,
): Attribution {
  const prior = stored && typeof stored === "object" ? stored : {};
  const incoming = attributionFromSearch(search);
  const next: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = sanitizeToken(prior[key]) || incoming[key];
    if (value) next[key] = value;
  }
  if (!next.utm_source) {
    const source = sanitizeToken(prior.source) || incoming.source;
    if (source) next.source = source;
  }
  const host = storedHost(prior.referrer_host) || referrerHost(referrer, ownHost ? [ownHost] : []);
  if (host) next.referrer_host = host;
  const storedFunnel = isOpaqueFunnelRef(prior.funnel_ref) ? prior.funnel_ref.toLowerCase() : null;
  const generated = isOpaqueFunnelRef(nextFunnelRef) ? nextFunnelRef.toLowerCase() : null;
  const funnel = storedFunnel || generated;
  if (funnel) next.funnel_ref = funnel;
  return next;
}

export function sanitizePageUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.username || url.password) return null;
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const path = url.pathname || "/";
  if (path === "/admin" || path.startsWith("/admin/")) return null;
  const clean = new URL(path, url.origin);
  const safe = attributionFromSearch(url.search);
  for (const key of UTM_KEYS) {
    const value = safe[key];
    if (value) clean.searchParams.set(key, value);
  }
  if (!safe.utm_source && safe.source) clean.searchParams.set("source", safe.source);
  return clean.toString();
}

export function prepareAnalyticsEvent<T extends { type: string; url: string }>(
  event: T,
  pageViews: Map<string, number>,
  now: number,
): T | null {
  const url = sanitizePageUrl(event.url);
  if (!url) return null;
  if (event.type === "pageview" && !shouldEmit(pageViews, `pageview|${url}`, now, PAGE_VIEW_DEDUPE_MS)) return null;
  return { ...event, url };
}

const analyticsPageViews = new Map<string, number>();

/** One sanitizer for native page views and custom events. Drops /admin, strips fragments, and keeps only allowlisted campaign params. */
export function sanitizeAnalyticsEvent<T extends { type: string; url: string }>(event: T, now = Date.now()): T | null {
  return prepareAnalyticsEvent(event, analyticsPageViews, now);
}

export function classifyAvailabilityResponse(input: {
  aborted: boolean;
  ok: boolean;
  status: number;
  hasDays: boolean;
}): "ignore" | "success" | "unavailable" | "error" {
  if (input.aborted) return "ignore";
  if (input.ok && input.status === 200 && input.hasDays) return "success";
  if (input.status === 502 || input.status === 503) return "unavailable";
  return "error";
}

/**
 * Documented Hostaway handoff. Query keys are only start, end, and numberOfGuests.
 * Do not add a funnel token: no existing contract says Hostaway will keep it,
 * and an extra parameter is not verified as checkout-neutral.
 */
export function hostawayCheckoutHref(listingId: number, checkIn: string, checkOut: string, guests: number): string {
  if (!Number.isInteger(listingId) || listingId <= 0) throw new Error("Invalid listing");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) throw new Error("Invalid dates");
  if (!Number.isInteger(guests) || guests < 1 || guests > 30) throw new Error("Invalid guests");
  const params = new URLSearchParams({
    start: checkIn,
    end: checkOut,
    numberOfGuests: String(guests),
  });
  return `https://roamstead_ventures.holidayfuture.com/checkout/${listingId}?${params.toString()}`;
}

export function shouldEmit(store: Map<string, number>, key: string, now: number, windowMs: number): boolean {
  const previous = store.get(key);
  if (previous !== undefined && now - previous < windowMs) return false;
  store.set(key, now);
  return true;
}

/**
 * Date-check attempt and outcome are not time-deduped. Their stamps would
 * otherwise be taken at request start and response time, so a repeated month
 * can drop the attempt and still send the success.
 * Null means every call is emitted.
 */
export function dedupeWindowMs(name: BookingEventName): number | null {
  if (name.startsWith("booking_date_check_")) return null;
  if (name === BOOKING_EVENTS.pageView) return PAGE_VIEW_DEDUPE_MS;
  return ACTION_DEDUPE_MS;
}

export function acceptFunnelEvent(store: Map<string, number>, name: BookingEventName, identity: string, now: number): boolean {
  const windowMs = dedupeWindowMs(name);
  if (windowMs === null) return true;
  return shouldEmit(store, `${name}|${identity}`, now, windowMs);
}

type AnalyticsHost = { va?: unknown; vaq?: unknown[][] };

function promoteSanitizer(target: AnalyticsHost, sanitizer: (event: { type: string; url: string }) => unknown): void {
  if (!target.vaq) target.vaq = [];
  for (let index = target.vaq.length - 1; index >= 0; index -= 1) {
    if (target.vaq[index][0] === "beforeSend") target.vaq.splice(index, 1);
  }
  target.vaq.unshift(["beforeSend", sanitizer]);
}

function isReplayQueue(va: unknown): boolean {
  if (typeof va !== "function") return false;
  if ("roamsteadQueue" in va && (va as { roamsteadQueue?: boolean }).roamsteadQueue === true) return true;
  return Function.prototype.toString.call(va).includes("vaq");
}

/** Same queue `@vercel/analytics` installs in `initQueue`. `track()` does not enqueue when `va` is missing. */
export function ensureAnalyticsQueue(target: AnalyticsHost): void {
  if (typeof target.va === "function") return;
  const queue = (...params: unknown[]) => {
    if (params[0] === "beforeSend") {
      promoteSanitizer(target, params[1] as (event: { type: string; url: string }) => unknown);
      return;
    }
    if (!target.vaq) target.vaq = [];
    target.vaq.push(params);
  };
  Object.assign(queue, { roamsteadQueue: true });
  target.va = queue;
}

const registeredSanitizer = new WeakMap<object, unknown>();

/**
 * Put the shared sanitizer ahead of every queued command. A second registration
 * of the same function does not add another queue entry.
 */
export function registerAnalyticsSanitizer(target: AnalyticsHost, sanitizer: (event: { type: string; url: string }) => unknown): void {
  ensureAnalyticsQueue(target);
  if (isReplayQueue(target.va) || typeof target.va !== "function") {
    const alreadyFirst = target.vaq?.[0]?.[0] === "beforeSend" && target.vaq[0][1] === sanitizer
      && target.vaq.filter((entry) => entry[0] === "beforeSend").length === 1;
    if (!alreadyFirst) promoteSanitizer(target, sanitizer);
    registeredSanitizer.set(target, sanitizer);
    return;
  }
  if (registeredSanitizer.get(target) === sanitizer) return;
  registeredSanitizer.set(target, sanitizer);
  (target.va as (command: string, fn: unknown) => void)("beforeSend", sanitizer);
}

export function composeBookingProperties(
  context: {
    propertySlug: string;
    listingId?: number | null;
    pageKind?: "property" | "book";
    guests?: number;
    nights?: number;
  },
  attribution: Attribution,
): Record<string, string | number> {
  const slug = context.propertySlug.trim().toLowerCase();
  if (!SLUG.test(slug) || slug.length > 80) throw new Error("Invalid property slug");
  const properties: Record<string, string | number> = { property_slug: slug };
  if (typeof context.listingId === "number" && Number.isInteger(context.listingId) && context.listingId > 0) {
    properties.listing_id = String(context.listingId);
  }
  if (context.pageKind === "property" || context.pageKind === "book") properties.page_kind = context.pageKind;
  if (typeof context.nights === "number" && Number.isInteger(context.nights) && context.nights >= 1 && context.nights <= 90) {
    properties.nights = context.nights;
  }
  if (typeof context.guests === "number" && Number.isInteger(context.guests) && context.guests >= 1 && context.guests <= 30) {
    properties.guests = context.guests;
  }
  if (isOpaqueFunnelRef(attribution.funnel_ref)) properties.funnel_ref = attribution.funnel_ref.toLowerCase();
  for (const key of UTM_KEYS) {
    const value = sanitizeToken(attribution[key]);
    if (value) properties[key] = value;
  }
  if (!properties.utm_source) {
    const source = sanitizeToken(attribution.source);
    if (source) properties.source = source;
  }
  const host = storedHost(attribution.referrer_host);
  if (host) properties.referrer_host = host;
  return properties;
}
