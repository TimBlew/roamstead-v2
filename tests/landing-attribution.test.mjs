import assert from "node:assert/strict";
import {
  BOOKING_EVENTS,
  acceptFunnelEvent,
  attributionFromSearch,
  classifyAvailabilityResponse,
  composeBookingProperties,
  hostawayCheckoutHref,
  isOpaqueFunnelRef,
  mergeAttribution,
  registerAnalyticsSanitizer,
  sanitizeAnalyticsEvent,
  sanitizePageUrl,
} from "../src/lib/booking-analytics.ts";

const FIRST = "4f2c0a1e-6b7d-4c8e-8a1b-123456789abc";
const SECOND = "11111111-1111-4111-8111-111111111111";

function openTab() {
  let raw = null;
  return {
    visit(search, referrer = "", ownHost = "www.roamstead-co.com") {
      const stored = raw ? JSON.parse(raw) : null;
      const funnel = stored && isOpaqueFunnelRef(stored.funnel_ref) ? stored.funnel_ref : crypto.randomUUID();
      const next = mergeAttribution(stored, search, referrer, ownHost, funnel);
      raw = JSON.stringify(next);
      return next;
    },
  };
}

const landing = attributionFromSearch("?utm_source=google&utm_medium=organic&utm_campaign=midway-seo&utm_content=hero&utm_term=sauna&gclid=abc&fbclid=xyz&email=guest@example.com");
assert.deepEqual(landing, {
  utm_source: "google",
  utm_medium: "organic",
  utm_campaign: "midway-seo",
  utm_content: "hero",
  utm_term: "sauna",
});
assert.equal(JSON.stringify(landing).includes("gclid"), false);
assert.equal(JSON.stringify(landing).includes("@"), false);

const tab = openTab();
const invalidFirst = tab.visit("?utm_source=guest@example.com&utm_medium=5551234567&utm_campaign=midway-seo", "https://www.google.com/search?q=midway+utah&email=guest@example.com");
assert.equal(invalidFirst.utm_source, undefined);
assert.equal(invalidFirst.utm_medium, undefined);
assert.equal(invalidFirst.utm_campaign, "midway-seo");
assert.equal(invalidFirst.referrer_host, "www.google.com");
assert.equal(isOpaqueFunnelRef(invalidFirst.funnel_ref), true);

const filled = tab.visit("?utm_source=google&utm_medium=organic&utm_campaign=later-campaign");
assert.equal(filled.utm_source, "google", "An invalid first token does not block a later valid one");
assert.equal(filled.utm_medium, "organic");
assert.equal(filled.utm_campaign, "midway-seo", "The first valid campaign stays");
assert.equal(filled.funnel_ref, invalidFirst.funnel_ref);

const returning = tab.visit("", "https://www.roamstead-co.com/midway");
assert.equal(returning.utm_source, "google");
assert.equal(returning.utm_campaign, "midway-seo");
assert.equal(returning.referrer_host, "www.google.com", "In-site navigation does not replace the external referrer");
assert.equal(returning.funnel_ref, filled.funnel_ref);

const propertyUrl = sanitizePageUrl("https://www.roamstead-co.com/properties/hygge-house");
assert.equal(propertyUrl, "https://www.roamstead-co.com/properties/hygge-house");
const propertyEvent = composeBookingProperties(
  { propertySlug: "hygge-house", listingId: 455635, pageKind: "property" },
  returning,
);
assert.equal(propertyEvent.utm_source, "google");
assert.equal(propertyEvent.utm_medium, "organic");
assert.equal(propertyEvent.utm_campaign, "midway-seo");
assert.equal(propertyEvent.listing_id, "455635");
assert.equal(propertyEvent.funnel_ref, returning.funnel_ref);
assert.equal("landing_path" in propertyEvent, false);
assert.equal(JSON.stringify(propertyEvent).includes("/midway"), false);
assert.equal(JSON.stringify(propertyEvent).includes("gclid"), false);

const otherTab = openTab();
const otherLanding = otherTab.visit("?utm_source=bing&utm_medium=cpc", "https://www.bing.com/search?q=park+city");
assert.equal(otherLanding.utm_source, "bing");
assert.equal(otherLanding.utm_campaign, undefined);
assert.notEqual(otherLanding.funnel_ref, returning.funnel_ref, "A new tab does not reuse the first tab's reference");

const mixed = openTab();
mixed.visit("?utm_source=newsletter");
const mixedLater = mixed.visit("?utm_campaign=spring&utm_source=ignored");
assert.equal(mixedLater.utm_source, "newsletter");
assert.equal(mixedLater.utm_campaign, "spring", "A later visit can fill an empty field and mix the stored tuple");

const host = {};
registerAnalyticsSanitizer(host, sanitizeAnalyticsEvent);
host.va("event", { name: "booking_page_view" });
host.va("beforeSend", sanitizeAnalyticsEvent);
registerAnalyticsSanitizer(host, sanitizeAnalyticsEvent);
assert.deepEqual(host.vaq.map((entry) => entry[0]), ["beforeSend", "event"]);
assert.equal(host.vaq[0][1], sanitizeAnalyticsEvent);

const raw = "https://www.roamstead-co.com/midway?utm_source=qa&email=guest@example.com&gclid=abc#guest=secret";
let sanitizer = (event) => event;
const emitted = [];
for (const [type, payload] of host.vaq) {
  if (type === "beforeSend") sanitizer = payload;
  if (type === "event") {
    const result = sanitizer({ type: "event", url: raw });
    if (result != null) emitted.push(result.url);
  }
}
assert.equal(emitted.length, 1);
assert.equal(emitted[0], "https://www.roamstead-co.com/midway?utm_source=qa");
assert.equal(sanitizeAnalyticsEvent({ type: "pageview", url: "https://www.roamstead-co.com/admin?utm_source=qa#secret" }, 80_000), null);
const hubView = sanitizeAnalyticsEvent({ type: "pageview", url: "https://www.roamstead-co.com/midway?utm_source=qa&utm_medium=organic" }, 90_000);
const hubRepeat = sanitizeAnalyticsEvent({ type: "pageview", url: "https://www.roamstead-co.com/midway?utm_source=qa&utm_medium=organic#x" }, 90_200);
assert.equal(hubView && hubView.url, "https://www.roamstead-co.com/midway?utm_source=qa&utm_medium=organic");
assert.equal(hubRepeat, null);

function calendarLedger() {
  const store = new Map();
  const log = [];
  return {
    log,
    check({ attempt, windowKey, at, aborted = false, status = 200, ok = true, hasDays = true }) {
      const identity = `hygge-house|455635|${attempt}|${windowKey}`;
      if (acceptFunnelEvent(store, BOOKING_EVENTS.dateCheckAttempt, identity, at)) log.push("attempt");
      if (aborted) return;
      const outcome = classifyAvailabilityResponse({ aborted: false, ok, status, hasDays });
      const name = outcome === "success" ? BOOKING_EVENTS.dateCheckSuccess
        : outcome === "unavailable" ? BOOKING_EVENTS.dateCheckUnavailable
        : BOOKING_EVENTS.dateCheckError;
      if (acceptFunnelEvent(store, name, identity, at + 1)) log.push(outcome);
    },
  };
}

const ledger = calendarLedger();
ledger.check({ attempt: 0, windowKey: "2026-11-01|2026-12-31", at: 0, aborted: true });
ledger.check({ attempt: 1, windowKey: "2026-11-01|2026-12-31", at: 100, status: 503, ok: false, hasDays: false });
ledger.check({ attempt: 2, windowKey: "2026-11-01|2026-12-31", at: 200, status: 0, ok: false, hasDays: false });
ledger.check({ attempt: 3, windowKey: "2026-11-01|2026-12-31", at: 300, hasDays: true });
ledger.check({ attempt: 0, windowKey: "2026-12-01|2027-01-31", at: 400, hasDays: true });
assert.deepEqual(ledger.log, ["attempt", "attempt", "unavailable", "attempt", "error", "attempt", "success", "attempt", "success"]);
assert.equal(ledger.log.includes("booking"), false);
assert.equal(ledger.log.filter((item) => item === "success").length, 2, "Month load success is not a selected stay");

const href = hostawayCheckoutHref(455635, "2026-12-13", "2026-12-15", 3);
const checkout = new URL(href);
assert.deepEqual([...checkout.searchParams.keys()], ["start", "end", "numberOfGuests"]);
assert.equal(checkout.searchParams.get("start"), "2026-12-13");
assert.equal(checkout.searchParams.get("end"), "2026-12-15");
assert.equal(checkout.searchParams.get("numberOfGuests"), "3");
assert.equal(href.includes("funnel"), false);
assert.equal(href.includes(returning.funnel_ref), false);
assert.equal(checkout.pathname, "/checkout/455635");

console.log("PASS: landing attribution guardrails");
