import { track } from "@vercel/analytics";
import {
  type Attribution,
  type BookingEventName,
  acceptFunnelEvent,
  composeBookingProperties,
  mergeAttribution,
  registerAnalyticsSanitizer,
  sanitizeAnalyticsEvent,
} from "@/lib/booking-analytics";

type AnalyticsValue = string | number | boolean;
type AnalyticsDetails = Record<string, AnalyticsValue>;

const ATTR_KEY = "rs_booking_attr";
const recentEvents = new Map<string, number>();
let memoryAttribution: Attribution = {};

/** Record a non-booking event, such as early access, without funnel attribution. */
export function trackRoamsteadEvent(name: string, data?: AnalyticsDetails) {
  if (typeof window === "undefined") return;
  track(name, data);
}

function readStoredAttribution(): Attribution {
  if (typeof window === "undefined") return memoryAttribution;
  try {
    const raw = window.sessionStorage.getItem(ATTR_KEY);
    if (!raw) return memoryAttribution;
    return mergeAttribution(JSON.parse(raw) as Attribution, "", "", "", "");
  } catch {
    return memoryAttribution;
  }
}

function persistAttribution(value: Attribution) {
  memoryAttribution = value;
  try {
    window.sessionStorage.setItem(ATTR_KEY, JSON.stringify(value));
  } catch {
    // Private browsing can block storage. The memory copy still covers this page.
  }
}

/** First-touch allowlisted attribution for this tab. Safe to call more than once. */
export function captureLandingAttribution(): Attribution {
  if (typeof window === "undefined") return memoryAttribution;
  const stored = readStoredAttribution();
  const funnel = stored.funnel_ref || crypto.randomUUID();
  const next = mergeAttribution(stored, window.location.search, document.referrer, window.location.hostname, funnel);
  persistAttribution(next);
  return next;
}

/**
 * Send one booking-funnel event. Duplicate calls for the same action inside
 * the dedupe window are dropped. This never includes a confirmed booking.
 */
export function trackBookingEvent(
  name: BookingEventName,
  input: {
    propertySlug: string;
    listingId?: number | null;
    pageKind?: "property" | "book";
    guests?: number;
    nights?: number;
    dedupe?: string[];
  },
) {
  if (typeof window === "undefined") return;
  registerAnalyticsSanitizer(window, sanitizeAnalyticsEvent);
  try {
    const attribution = captureLandingAttribution();
    const properties = composeBookingProperties(input, attribution);
    const identity = [input.propertySlug, input.listingId ?? "", input.pageKind ?? "", ...(input.dedupe ?? [])].join("|");
    if (!acceptFunnelEvent(recentEvents, name, identity, Date.now())) return;
    track(name, properties);
  } catch {
    // Analytics must not block choosing dates, guests, or the payment handoff.
  }
}
