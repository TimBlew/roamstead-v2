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
