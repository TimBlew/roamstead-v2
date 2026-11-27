import assert from "node:assert/strict";
import { ADMIN_TRAFFIC_FILTER, analyticsQueryParams, deriveAdminAnalytics, SEARCH_CONSOLE_DIAGNOSTIC } from "@/lib/admin-analytics";

assert.equal(ADMIN_TRAFFIC_FILTER, "requestPath ne '/admin' and not startswith(requestPath,'/admin/')");
for (const by of ["day", "requestPath", "referrerHostname", "deviceType"]) {
  const params = { since: "2026-10-01", until: "2026-11-01", by, limit: "100" };
  const result = analyticsQueryParams("/visits/aggregate", params);
  assert.equal(result.get("filter"), ADMIN_TRAFFIC_FILTER);
  for (const [key, value] of Object.entries(params)) assert.equal(result.get(key), value);
  assert.equal(params.filter, undefined);
}
assert.equal(analyticsQueryParams("/events/aggregate", { by: "eventName" }).has("filter"), false);
for (const data of [null, {}, { events: null, eventsAvailable: false }, { events: [], eventsAvailable: false }]) {
  const result = deriveAdminAnalytics(data, 100);
  assert.equal(result.clicks, null);
  assert.equal(result.rate, "—");
  assert.equal(result.eventsAvailable, false);
  assert.equal(result.exploredRows, null);
}
for (const events of [[], [{ eventName: "booking_page_view", count: 5 }]]) {
  const result = deriveAdminAnalytics({ events, eventsAvailable: true }, 100);
  assert.equal(result.clicks, 0);
  assert.equal(result.rate, "0.0%");
  assert.equal(result.eventsAvailable, true);
  assert.ok(Array.isArray(result.exploredRows));
  assert.equal(deriveAdminAnalytics({ events, eventsAvailable: true }, 0).rate, "—");
}
const loaded = deriveAdminAnalytics({ events: [{ eventName: "hostaway_checkout_click", count: 3 }, { eventName: "hostaway_checkout_click", total: 2 }], pages: [], referrers: [], devices: [] }, 20);
assert.equal(loaded.clicks, 5);
assert.equal(loaded.rate, "25.0%");
assert.deepEqual(loaded.exploredRows, [{ label: "Checkout handoff", value: 3 }, { label: "Checkout handoff", value: 2 }]);
for (const key of ["pages", "referrers", "devices"]) {
  assert.equal(loaded[`${key}Available`], true);
  assert.equal(deriveAdminAnalytics({ [key]: null, [`${key}Available`]: false }, 20)[`${key}Available`], false);
  assert.equal(deriveAdminAnalytics({ [key]: [], [`${key}Available`]: false }, 20)[`${key}Available`], false);
}
assert.equal(SEARCH_CONSOLE_DIAGNOSTIC.test("search_console_403"), true);
assert.equal(SEARCH_CONSOLE_DIAGNOSTIC.test("federation_exchange_403"), true);
assert.equal(SEARCH_CONSOLE_DIAGNOSTIC.test("service_account_impersonation_403_PERMISSION_DENIED"), true);
assert.equal(SEARCH_CONSOLE_DIAGNOSTIC.test("GSC status 403"), false);
assert.equal(SEARCH_CONSOLE_DIAGNOSTIC.test("unexpected details"), false);
console.log("Admin analytics tests passed");

// Keep verified reservation aggregates distinct from inferred action counts.
const fs = await import("node:fs");
const route = fs.readFileSync("src/app/admin/api/analytics/route.ts", "utf8");
const panel = fs.readFileSync("src/components/admin/AnalyticsPanel.tsx", "utf8");
for (const key of ["verifiedReservations", "inferredAcquisitionSource", "inferredAcquisitionCampaign"]) {
  assert.ok(route.includes(key + ":"), key + " is returned by the API");
  assert.ok(panel.includes(key), key + " is consumed by the panel");
}
for (const oldKey of ["reservations", "acquisitionSource", "acquisitionCampaign"]) {
  assert.doesNotMatch(route, new RegExp("\\b" + oldKey + ":"));
  assert.doesNotMatch(panel, new RegExp("\\b" + oldKey + "\\??:"));
}
const verifiedHeading = "Website reservations (verified in Hostaway)";
const inferredHeading = "Campaign interest (inferred from first-touch tags)";
assert.ok(panel.indexOf(verifiedHeading) >= 0 && panel.indexOf(verifiedHeading) < panel.indexOf(inferredHeading));
assert.ok(panel.includes("First touch (inferred)"));
assert.ok(panel.includes("Confirmed reservations made through the website checkout, from all sources. Hostaway does not record campaign tags, so these are not linked to any campaign."));
assert.ok(panel.includes("Counts of on-site actions grouped by the visitor's first-touch tags. These are inferred, are not linked to reservations, and do not show that a campaign generated a booking. A checkout handoff is not a reservation. Missing tags appear as Direct / unknown."));
