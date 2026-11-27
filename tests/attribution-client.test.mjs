import assert from "node:assert/strict";
import { captureLandingAttribution, getFirstTouchAttribution, trackBookingEvent, trackRoamsteadEvent } from "../src/lib/analytics.ts";
import { BOOKING_EVENTS, hostawayCheckoutHref } from "../src/lib/booking-analytics.ts";
const local = new Map(), session = new Map();
let writes = 0, reads = 0;
globalThis.window = {
  location: { pathname: "/properties/granary", search: "?utm_source=gohebervalley&utm_medium=email&utm_campaign=castlehead_sprint1", hostname: "roamstead-co.com" },
  localStorage: { getItem: key => { if (key !== "rs_analytics_optout") reads++; return local.get(key); }, setItem(key, value) { writes++; local.set(key, value); } },
  sessionStorage: { getItem: key => session.get(key), setItem: (key, value) => session.set(key, value) },
};
globalThis.document = { referrer: "" };
Object.defineProperty(globalThis, "navigator", { configurable: true, value: { globalPrivacyControl: false } });
const first = captureLandingAttribution();
assert.equal(first.utm_source, "gohebervalley");
window.location.search = "?utm_source=other&utm_term=later";
assert.deepEqual(captureLandingAttribution(), first);
trackBookingEvent(BOOKING_EVENTS.pageView, { propertySlug: "granary", pageKind: "property" });
trackBookingEvent(BOOKING_EVENTS.pageView, { propertySlug: "granary", pageKind: "property" });
trackBookingEvent(BOOKING_EVENTS.checkoutHandoff, { propertySlug: "granary" });
trackBookingEvent(BOOKING_EVENTS.checkoutHandoff, { propertySlug: "granary" });
trackRoamsteadEvent("early_access_submission_accepted");
const events = window.vaq.filter(entry => entry[0] === "event");
assert.equal(events.length, 3);
assert.equal(writes, 1);
for (const [, event] of events) {
  assert.equal(event.data.utm_source, "gohebervalley");
  assert.equal(event.data.utm_term, undefined);
}
assert.equal(events[2][1].data.funnel_ref, undefined);
window.location.pathname = "/admin/analytics";
const before = JSON.stringify([...local]);
assert.deepEqual(captureLandingAttribution(), {});
trackBookingEvent(BOOKING_EVENTS.pageView, { propertySlug: "admin" });
assert.equal(window.vaq.filter(entry => entry[0] === "event").length, 3);
assert.equal(JSON.stringify([...local]), before);
window.location.pathname = "/properties/granary";

for (const signal of ["gpc", "navigatorDnt", "windowDnt"]) {
  navigator.globalPrivacyControl = signal === "gpc";
  navigator.doNotTrack = signal === "navigatorDnt" ? "1" : "0";
  window.doNotTrack = signal === "windowDnt" ? "1" : "0";
  const priorReads = reads;
  assert.equal(getFirstTouchAttribution(), null);
  const fallback = captureLandingAttribution();
  assert.equal(fallback.funnel_ref, first.funnel_ref);
  assert.equal(fallback.utm_source, first.utm_source);
  const checkout = new URL(hostawayCheckoutHref(455631, "2026-12-01", "2026-12-03", 2, getFirstTouchAttribution()));
  assert.deepEqual([...checkout.searchParams.keys()], ["start", "end", "numberOfGuests"]);
  assert.equal(reads, priorReads, signal + " must not read first-touch localStorage");
  assert.equal(writes, 1, signal + " must not write localStorage");
}
navigator.globalPrivacyControl = false;
navigator.doNotTrack = "0";
window.doNotTrack = "0";
assert.equal(getFirstTouchAttribution().utm_source, first.utm_source);
Object.defineProperty(window, "localStorage", { get() { throw Error("blocked"); } });
assert.doesNotThrow(() => captureLandingAttribution());
console.log("PASS: client re-renders, checkout dedupe, GPC/DNT, storage fallback");
