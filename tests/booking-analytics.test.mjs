import assert from "node:assert/strict";
import fs from "node:fs";
import {
  ACTION_DEDUPE_MS,
  BOOKING_EVENTS,
  PAGE_VIEW_DEDUPE_MS,
  acceptFunnelEvent,
  attributionFromSearch,
  classifyAvailabilityResponse,
  composeBookingProperties,
  dedupeWindowMs,
  hostawayCheckoutHref,
  mergeAttribution,
  prepareAnalyticsEvent,
  referrerHost,
  sanitizePageUrl,
  sanitizeToken,
  shouldEmit,
  ensureAnalyticsQueue,
  registerAnalyticsSanitizer,
  sanitizeAnalyticsEvent,
} from "../src/lib/booking-analytics.ts";

const FUNNEL = "4f2c0a1e-6b7d-4c8e-8a1b-123456789abc";
const OTHER_FUNNEL = "11111111-1111-4111-8111-111111111111";

assert.deepEqual(BOOKING_EVENTS, {
  pageView: "booking_page_view",
  dateCheckAttempt: "booking_date_check_attempt",
  dateCheckSuccess: "booking_date_check_success",
  dateCheckUnavailable: "booking_date_check_unavailable",
  dateCheckError: "booking_date_check_error",
  guestStep: "booking_guest_step",
  checkoutHandoff: "hostaway_checkout_click",
});
assert.equal(dedupeWindowMs(BOOKING_EVENTS.pageView), PAGE_VIEW_DEDUPE_MS);
assert.equal(dedupeWindowMs(BOOKING_EVENTS.dateCheckAttempt), null);
assert.equal(dedupeWindowMs(BOOKING_EVENTS.dateCheckSuccess), null);
assert.equal(dedupeWindowMs(BOOKING_EVENTS.dateCheckUnavailable), null);
assert.equal(dedupeWindowMs(BOOKING_EVENTS.dateCheckError), null);
assert.equal(dedupeWindowMs(BOOKING_EVENTS.guestStep), ACTION_DEDUPE_MS);
assert.equal(dedupeWindowMs(BOOKING_EVENTS.checkoutHandoff), ACTION_DEDUPE_MS);

const client = fs.readFileSync("node_modules/@vercel/analytics/dist/index.js", "utf8");
assert.equal(client.includes('window.va) == null ? void 0 : _b.call(window, "event"'), true, "track() skips the call when window.va is missing");
assert.equal(client.includes("if (!window.vaq) window.vaq = []"), true, "the package queues only after initQueue installs va");
const nextClient = fs.readFileSync("node_modules/@vercel/analytics/dist/next/index.js", "utf8");
assert.equal(nextClient.includes("useSearchParams"), true, "Next analytics reads search params");
assert.equal(nextClient.includes("Suspense"), true, "Next analytics is behind Suspense");
assert.equal(nextClient.includes("inject("), true);

const dropped = {};
const callIfReady = (host, name) => { host.va?.("event", { name }); };
callIfReady(dropped, "booking_page_view");
assert.equal(dropped.vaq, undefined, "A page view fired before the queue exists is not stored");
ensureAnalyticsQueue(dropped);
callIfReady(dropped, "booking_page_view");
assert.equal(dropped.vaq.length, 1);
assert.deepEqual(dropped.vaq[0], ["event", { name: "booking_page_view" }]);
const already = { va() {}, vaq: [] };
ensureAnalyticsQueue(already);
assert.equal(already.vaq.length, 0, "An existing analytics client is left in place");

const skewed = new Map();
const windowMs = 1500;
assert.equal(shouldEmit(skewed, "attempt|nov", 0, windowMs), true);
assert.equal(shouldEmit(skewed, "success|nov", 200, windowMs), true);
assert.equal(shouldEmit(skewed, "attempt|dec", 500, windowMs), true);
assert.equal(shouldEmit(skewed, "success|dec", 700, windowMs), true);
assert.equal(shouldEmit(skewed, "attempt|nov", 900, windowMs), false, "Repeat month attempt falls inside the first attempt's window");
assert.equal(shouldEmit(skewed, "success|nov", 1800, windowMs), true, "Its later success falls outside the first success's window");

const paired = new Map();
const record = (name, identity, now) => acceptFunnelEvent(paired, name, identity, now);
assert.equal(record(BOOKING_EVENTS.dateCheckAttempt, "granary|455631|0|2026-11-01|2026-12-31", 0), true);
assert.equal(record(BOOKING_EVENTS.dateCheckSuccess, "granary|455631|0|2026-11-01|2026-12-31", 200), true);
assert.equal(record(BOOKING_EVENTS.dateCheckAttempt, "granary|455631|0|2026-12-01|2027-01-31", 500), true);
assert.equal(record(BOOKING_EVENTS.dateCheckSuccess, "granary|455631|0|2026-12-01|2027-01-31", 700), true);
assert.equal(record(BOOKING_EVENTS.dateCheckAttempt, "granary|455631|0|2026-11-01|2026-12-31", 900), true);
assert.equal(record(BOOKING_EVENTS.dateCheckSuccess, "granary|455631|0|2026-11-01|2026-12-31", 1800), true);
assert.equal(record(BOOKING_EVENTS.pageView, "hygge-house|455635|property", 0), true);
assert.equal(record(BOOKING_EVENTS.pageView, "hygge-house|455635|property", 200), false, "A second property view inside 1.5s is still one event");

const cold = {};
registerAnalyticsSanitizer(cold, sanitizeAnalyticsEvent);
cold.va("event", { name: "booking_page_view" });
cold.va("beforeSend", sanitizeAnalyticsEvent);
registerAnalyticsSanitizer(cold, sanitizeAnalyticsEvent);
assert.equal(cold.vaq.filter((entry) => entry[0] === "beforeSend").length, 1, "inject does not register the sanitizer twice");
assert.equal(cold.vaq[0][0], "beforeSend");
assert.equal(cold.vaq[0][1], sanitizeAnalyticsEvent);
assert.equal(cold.vaq.filter((entry) => entry[0] === "event").length, 1, "The early event is kept once");

const late = { vaq: [] };
late.va = function packageQueue(...params) { late.vaq.push(params); };
late.va("event", { name: "booking_page_view" });
registerAnalyticsSanitizer(late, sanitizeAnalyticsEvent);
assert.deepEqual(late.vaq.map((entry) => entry[0]), ["beforeSend", "event"], "A sanitizer that arrives after an event is moved ahead of it");

const raw = "https://www.roamstead-co.com/properties/hygge-house?utm_source=qa&email=guest@example.com&gclid=abc#guest=secret";
let sanitizer = (event) => event;
const sent = [];
for (const [type, payload] of cold.vaq) {
  if (type === "beforeSend") sanitizer = payload;
  if (type === "event") {
    const result = sanitizer({ type: "event", url: raw });
    if (result != null) sent.push(result.url);
  }
}
assert.equal(sanitizer, sanitizeAnalyticsEvent);
assert.deepEqual(sent, ["https://www.roamstead-co.com/properties/hygge-house?utm_source=qa"]);
assert.equal(sanitizeAnalyticsEvent({ type: "event", url: "https://www.roamstead-co.com/admin/edit?utm_source=qa#secret" }, 50_000), null);

const native = sanitizeAnalyticsEvent({ type: "pageview", url: "https://www.roamstead-co.com/properties/granary?utm_medium=acceptance&email=guest@example.com" }, 60_000);
const nativeRepeat = sanitizeAnalyticsEvent({ type: "pageview", url: "https://www.roamstead-co.com/properties/granary?utm_medium=acceptance#guest" }, 60_100);
assert.equal(native && native.url, "https://www.roamstead-co.com/properties/granary?utm_medium=acceptance");
assert.equal(nativeRepeat, null, "The native page view is still one view inside the dedupe window");
const publicAnalytics = fs.readFileSync("src/components/analytics/PublicAnalytics.tsx", "utf8");
assert.equal(publicAnalytics.includes("<Analytics />"), true, "Native analytics page views stay enabled");
assert.equal(publicAnalytics.includes("<Analytics beforeSend"), false, "inject() is not given a second sanitizer");
assert.equal(nextClient.includes("pageview({"), true, "The Next client still sends its page view");

assert.equal(sanitizeToken("instagram"), "instagram");
assert.equal(sanitizeToken(" guest@example.com "), null);
assert.equal(sanitizeToken("555-1212"), null);
assert.equal(sanitizeToken("5551234567"), null);
assert.equal(sanitizeToken("spring2026"), "spring2026");
assert.equal(sanitizeToken("https://evil.example/path"), null);
assert.equal(sanitizeToken(""), null);

const parsed = attributionFromSearch("?utm_source=instagram&utm_medium=social&utm_campaign=spring&utm_content=hero&utm_term=midway&source=ignored&email=guest@example.com&gclid=abc&phone=5551234567&guest=Amy");
assert.deepEqual(parsed, {
  utm_source: "instagram",
  utm_medium: "social",
  utm_campaign: "spring",
  utm_content: "hero",
  utm_term: "midway",
});
assert.deepEqual(attributionFromSearch("?source=newsletter&email=a@b.com"), { source: "newsletter" });
assert.deepEqual(attributionFromSearch("?utm_source=guest@example.com&utm_campaign=5551234567"), {});

assert.equal(referrerHost("https://www.google.com/search?q=hygge+house&email=a@b.com", ["www.roamstead-co.com"]), "www.google.com");
assert.equal(referrerHost("https://www.roamstead-co.com/properties/hygge-house?utm_source=secret", []), null);
assert.equal(referrerHost("https://roamstead-v2-git-cursor-booking.vercel.app/properties/granary?email=a@b.com", []), null);
assert.equal(referrerHost("https://user:secret@news.example/path", []), null);

const first = mergeAttribution(null, "?utm_source=instagram&utm_medium=social", "https://l.instagram.com/some/path?foo=bar", "www.roamstead-co.com", FUNNEL);
const second = mergeAttribution(first, "?utm_source=google&email=a@b.com", "https://www.google.com/search?q=secret-stay", "www.roamstead-co.com", OTHER_FUNNEL);
assert.equal(second.utm_source, "instagram");
assert.equal(second.utm_medium, "social");
assert.equal(second.referrer_host, "l.instagram.com");
assert.equal(second.funnel_ref, FUNNEL);
assert.equal(JSON.stringify(second).includes("secret"), false);
assert.equal(JSON.stringify(second).includes("@"), false);
assert.equal(JSON.stringify(second).includes("foo"), false);

const replaced = mergeAttribution({ funnel_ref: "guest@example.com", utm_source: "instagram", referrer_host: "https://evil.example/path?q=1" }, "", "", "www.roamstead-co.com", OTHER_FUNNEL);
assert.equal(replaced.funnel_ref, OTHER_FUNNEL);
assert.equal(replaced.utm_source, "instagram");
assert.equal(replaced.referrer_host, undefined);

assert.equal(
  sanitizePageUrl("https://www.roamstead-co.com/properties/hygge-house?utm_source=instagram&guest=Amy&email=a@b.com#guest=Amy"),
  "https://www.roamstead-co.com/properties/hygge-house?utm_source=instagram",
);
assert.equal(sanitizePageUrl("https://www.roamstead-co.com/admin/analytics?utm_source=instagram"), null);
assert.equal(sanitizePageUrl("javascript:alert(1)"), null);
assert.equal(sanitizePageUrl("not a url"), null);

const pageViews = new Map();
const firstView = prepareAnalyticsEvent({ type: "pageview", url: "https://www.roamstead-co.com/properties/granary?email=a@b.com" }, pageViews, 1_000);
const duplicateView = prepareAnalyticsEvent({ type: "pageview", url: "https://www.roamstead-co.com/properties/granary?phone=5551234567" }, pageViews, 1_200);
const laterView = prepareAnalyticsEvent({ type: "pageview", url: "https://www.roamstead-co.com/properties/granary" }, pageViews, 3_000);
const customEvent = prepareAnalyticsEvent({ type: "event", url: "https://www.roamstead-co.com/properties/granary?email=a@b.com" }, pageViews, 1_200);
assert.equal(firstView && firstView.url, "https://www.roamstead-co.com/properties/granary");
assert.equal(duplicateView, null);
assert.equal(laterView && laterView.url, "https://www.roamstead-co.com/properties/granary");
assert.equal(customEvent && customEvent.url, "https://www.roamstead-co.com/properties/granary");

assert.equal(classifyAvailabilityResponse({ aborted: true, ok: true, status: 200, hasDays: true }), "ignore");
assert.equal(classifyAvailabilityResponse({ aborted: false, ok: true, status: 200, hasDays: true }), "success");
assert.equal(classifyAvailabilityResponse({ aborted: false, ok: true, status: 200, hasDays: false }), "error");
assert.equal(classifyAvailabilityResponse({ aborted: false, ok: false, status: 502, hasDays: false }), "unavailable");
assert.equal(classifyAvailabilityResponse({ aborted: false, ok: false, status: 503, hasDays: false }), "unavailable");
assert.equal(classifyAvailabilityResponse({ aborted: false, ok: false, status: 400, hasDays: false }), "error");
assert.equal(classifyAvailabilityResponse({ aborted: false, ok: false, status: 0, hasDays: false }), "error");

const href = hostawayCheckoutHref(455635, "2026-12-01", "2026-12-05", 4);
const checkout = new URL(href);
assert.equal(checkout.origin + checkout.pathname, "https://roamstead_ventures.holidayfuture.com/checkout/455635");
assert.deepEqual([...checkout.searchParams.keys()], ["start", "end", "numberOfGuests"]);
assert.equal(checkout.searchParams.get("start"), "2026-12-01");
assert.equal(checkout.searchParams.get("end"), "2026-12-05");
assert.equal(checkout.searchParams.get("numberOfGuests"), "4");
assert.equal(href.includes("funnel"), false);
assert.equal(hostawayCheckoutHref(455631, "2026-12-02", "2026-12-04", 2).includes("/checkout/455631?"), true);
assert.throws(() => hostawayCheckoutHref(455635, "2026/12/01", "2026-12-05", 2));
assert.throws(() => hostawayCheckoutHref(455635, "2026-12-01", "2026-12-05", 0));

const properties = composeBookingProperties(
  { propertySlug: "Hygge-House", listingId: 455635, pageKind: "property", nights: 4, guests: 3 },
  {
    utm_source: "bad email@x.com",
    utm_medium: "social",
    funnel_ref: "not-a-uuid",
    referrer_host: "https://evil.example/path?q=1",
    source: "instagram",
  },
);
assert.equal(properties.property_slug, "hygge-house");
assert.equal(properties.listing_id, "455635");
assert.equal(properties.page_kind, "property");
assert.equal(properties.nights, 4);
assert.equal(properties.guests, 3);
assert.equal(properties.utm_source, undefined);
assert.equal(properties.utm_medium, "social");
assert.equal(properties.source, "instagram");
assert.equal(properties.funnel_ref, undefined);
assert.equal(properties.referrer_host, undefined);
assert.equal("email" in properties, false);
assert.equal("check_in" in properties, false);
assert.equal("referrer" in properties, false);

const safe = composeBookingProperties(
  { propertySlug: "granary", listingId: 455631, pageKind: "book" },
  mergeAttribution(null, "?utm_source=newsletter&email=guest@example.com", "https://news.example/story?id=9", "www.roamstead-co.com", FUNNEL),
);
assert.equal(safe.funnel_ref, FUNNEL);
assert.equal(safe.utm_source, "newsletter");
assert.equal(safe.referrer_host, "news.example");
assert.equal(JSON.stringify(safe).includes("guest@"), false);
assert.equal(JSON.stringify(safe).includes("story"), false);

const senator = composeBookingProperties({ propertySlug: "senator", pageKind: "property" }, { funnel_ref: FUNNEL });
assert.equal(senator.listing_id, undefined);
assert.equal(senator.property_slug, "senator");

const emitted = new Map();
assert.equal(shouldEmit(emitted, "guest|hygge", 1_000, 1_000), true);
assert.equal(shouldEmit(emitted, "guest|hygge", 1_500, 1_000), false);
assert.equal(shouldEmit(emitted, "guest|hygge", 2_000, 1_000), true);
assert.equal(shouldEmit(emitted, "handoff|hygge", 2_000, 1_000), true);

const bookingSource = fs.readFileSync("src/components/booking/RoamsteadBooking.tsx", "utf8");
assert.equal(bookingSource.includes("BOOKING_EVENTS.dateCheckAttempt"), true);
assert.equal(bookingSource.includes("BOOKING_EVENTS.dateCheckSuccess"), true);
assert.equal(bookingSource.includes("BOOKING_EVENTS.dateCheckUnavailable"), true);
assert.equal(bookingSource.includes("BOOKING_EVENTS.dateCheckError"), true);
assert.equal(bookingSource.includes("BOOKING_EVENTS.guestStep"), true);
assert.equal(bookingSource.includes("BOOKING_EVENTS.checkoutHandoff"), true);
assert.equal(bookingSource.includes("availability_dates_selected"), false);
assert.equal(bookingSource.includes("utm_"), false);
assert.equal(bookingSource.includes("document.referrer"), false);
assert.equal(bookingSource.includes("URLSearchParams"), false);
const guestAt = bookingSource.indexOf("BOOKING_EVENTS.guestStep");
const handoffAt = bookingSource.indexOf("BOOKING_EVENTS.checkoutHandoff");
assert.ok(bookingSource.lastIndexOf("onClick", guestAt) > guestAt - 400, "Guest step fires from the date continue click");
assert.ok(bookingSource.lastIndexOf("onClick", handoffAt) > handoffAt - 500, "Handoff fires from the checkout click");

console.log("PASS: booking funnel events, dedupe, and safe attribution");
