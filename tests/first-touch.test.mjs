import assert from "node:assert/strict";
import { sanitizeLandingPath, captureFirstTouch, FIRST_TOUCH_KEY, FIRST_TOUCH_TTL, composeBookingProperties, hostawayCheckoutHref, sanitizeFirstTouchFields, acceptFunnelEvent, BOOKING_EVENTS } from "../src/lib/booking-analytics.ts";
import { inquirySource, firstTouchSummary, parseInquirySource } from "../src/lib/inquiry-attribution.ts";
import { analyticsQueryParams, deriveAcquisition } from "../src/lib/admin-analytics.ts";
const now = Date.parse("2026-11-01T00:00:00Z");
const landing = { pathname: "/properties/granary", search: "?utm_source=gohebervalley&utm_medium=email&utm_campaign=castlehead_sprint1", referrer: "", hostname: "roamstead-co.com" };
function store(raw = null) {
  return { raw, writes: 0, getItem(key) { assert.equal(key, FIRST_TOUCH_KEY); return this.raw; }, setItem(key, value) { assert.equal(key, FIRST_TOUCH_KEY); this.raw = value; this.writes++; } };
}
const storage = store();
const first = captureFirstTouch(storage, landing, now);
assert.equal(first.utm_source, "gohebervalley");
assert.equal(first.landing_path, "/properties/granary");
for (const search of ["", "?utm_source=google&utm_term=later"]) {
  assert.deepEqual(captureFirstTouch(storage, { ...landing, search, referrer: "https://www.google.com/search" }, now + 1000), first);
}
assert.equal(storage.writes, 1);
const directStore = store();
const direct = captureFirstTouch(directStore, { ...landing, search: "" }, now);
assert.equal(direct.utm_source, undefined);
assert.deepEqual(captureFirstTouch(directStore, landing, now + 1), direct);
assert.equal(captureFirstTouch(store(), { ...landing, search: "", referrer: "https://www.google.com/search?q=private" }, now).referrer_host, "www.google.com");
for (const pathname of ["/admin", "/admin/analytics"]) {
  assert.equal(captureFirstTouch(storage, { ...landing, pathname }, now + 1), null);
  assert.equal(storage.writes, 1);
  const empty = store(); captureFirstTouch(empty, { ...landing, pathname }, now); assert.equal(empty.writes, 0);
}
assert.equal(captureFirstTouch(storage, { ...landing, search: "?utm_source=new" }, now + FIRST_TOUCH_TTL).utm_source, "new");
for (const raw of ["broken", "null", "[]", '{"v":1}', JSON.stringify({ ...first, email: "guest@example.com" })]) {
  assert.equal(captureFirstTouch(store(raw), landing, now).utm_source, "gohebervalley");
}
const privateStore = store();
assert.equal(captureFirstTouch(privateStore, { ...landing, optOut: true }, now), null);
assert.equal(privateStore.writes, 0);
assert.equal(captureFirstTouch({ getItem() { throw Error(); } }, landing, now), null);
assert.equal(captureFirstTouch({ getItem() { return null; }, setItem() { throw Error(); } }, landing, now), null);
assert.deepEqual(sanitizeFirstTouchFields({ utm_source: "guest@example.com", utm_campaign: "5551234567", gclid: "click", landing_path: "/x?email=secret", referrer_host: "https://google.com/x" }), {});
const props = composeBookingProperties({ propertySlug: "granary", listingId: 455631, pageKind: "book", nights: 2, guests: 3 }, { ...first, funnel_ref: "11111111-1111-4111-8111-111111111111", utm_content: "hero", utm_term: "stay", referrer_host: "www.google.com" });
assert.equal(Object.keys(props).length, 10);
for (const key of ["utm_term", "utm_content", "landing_path"]) assert.equal(props[key], undefined);
const href = new URL(hostawayCheckoutHref(455631, "2026-12-01", "2026-12-03", 3, first));
assert.deepEqual([...href.searchParams.keys()], ["start", "end", "numberOfGuests", "utm_source", "utm_medium", "utm_campaign"]);
assert.equal(href.searchParams.get("utm_source"), "gohebervalley");
assert.deepEqual([...new URL(hostawayCheckoutHref(455631, "2026-12-01", "2026-12-03", 3)).searchParams.keys()], ["start", "end", "numberOfGuests"]);
const emissions = new Map();
for (const event of [BOOKING_EVENTS.pageView, BOOKING_EVENTS.checkoutHandoff]) {
  assert.equal(acceptFunnelEvent(emissions, event, "granary", now), true);
  assert.equal(acceptFunnelEvent(emissions, event, "granary", now + 100), false);
}
assert.equal(inquirySource(null), "roamstead-co.com");
assert.equal(inquirySource(first), "roamstead-co.com|s=gohebervalley|m=email|c=castlehead_sprint1|l=/properties/granary");
assert.equal(firstTouchSummary({}), "Direct");
assert.ok(inquirySource({ utm_source: "a".repeat(64), utm_medium: "b".repeat(64), utm_campaign: "c".repeat(64), referrer_host: "www.google.com", landing_path: "/properties/granary" }).length <= 100);
const params = analyticsQueryParams("/events/aggregate", { by: ["eventName", "eventData/utm_source"], filter: "eventName in ('booking_page_view')" });
assert.deepEqual(params.getAll("by"), ["eventName", "eventData/utm_source"]);
assert.equal(params.get("filter"), "eventName in ('booking_page_view')");
assert.deepEqual(deriveAcquisition([{ eventName: "booking_page_view", "eventData/utm_source": "", count: 2 }, { eventName: "hostaway_checkout_click", "eventData/utm_source": "", count: 1 }]), [{ label: "Direct / unknown", views: 2, guests: 0, handoffs: 1, signups: 0 }]);
assert.equal(deriveAcquisition(null), null);
assert.equal(deriveAcquisition([{ eventName: "early_access_submission_accepted", "eventData/utm_campaign": "sprint", count: 3 }], "utm_campaign")[0].signups, 3);
console.log("PASS: first touch, privacy, cap, ledger, acquisition");

assert.equal(parseInquirySource(inquirySource(first)), "gohebervalley / email / castlehead_sprint1 / /properties/granary");
assert.equal(parseInquirySource("roamstead-co.com"), null);
assert.equal(parseInquirySource("roamstead-co.com|s=guest@example.com"), null);

assert.equal(sanitizeLandingPath("/" + "a".repeat(118) + "!"), null);
assert.equal(sanitizeLandingPath("/properties/granary/"), "/properties/granary/");
assert.equal(sanitizeLandingPath("/" + "a".repeat(120)), null);

assert.equal(parseInquirySource("legacy newsletter signup"), null);
for (const value of [undefined, null, {}, first, { utm_source: "=SUM(A1)", source: "+formula", utm_medium: "-test", utm_campaign: "@test" }, { utm_source: "a".repeat(64), utm_medium: "b".repeat(64), utm_campaign: "c".repeat(64) }]) {
  const source = inquirySource(value);
  assert.ok(source.startsWith("roamstead-co.com"));
  assert.ok(source.length <= 100);
  assert.doesNotMatch(source, /^[=+@-]/);
}
