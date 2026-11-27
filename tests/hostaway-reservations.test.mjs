import assert from "node:assert/strict";
import { aggregateReservations, websiteReservations } from "../src/lib/hostaway-reservations.ts";
const since = "2026-11-01T00:00:00Z", until = "2026-12-01T00:00:00Z";
const row = { channelId: 2013, status: "new", totalPrice: 125.50, currency: "USD", listingMapId: 455631, reservationDate: "2026-11-10 12:00:00", id: 999999, guestName: "Private Guest", guestEmail: "private@example.com", guestPhone: "5551234567", notes: "Private notes" };
const fixture = [row, { ...row, status: "MoDiFiEd", currency: "EUR", totalPrice: 40 }, ...["cancelled", "declined", "expired", "inquiry", "inquiryPreapproved", "pending", "awaitingPayment", "ownerStay", "unknown", "", null].map(status => ({ ...row, status })), { ...row, channelId: 2000 }, { ...row, channelId: 2022 }, { ...row, reservationDate: until }, { ...row, reservationDate: "2026-10-31" }];
const expected = { available: true, count: 2, revenue: { USD: 125.5, EUR: 40 }, byListing: { "455631": 2 } };
assert.deepEqual(aggregateReservations(fixture, since, until), expected);
assert.deepEqual(aggregateReservations([{ ...row, status: "NEW" }], since, until), {
  available: true, count: 1, revenue: { USD: 125.5 }, byListing: { "455631": 1 },
});
for (const status of ["cancelled", "declined", "expired", "inquiryPreapproved", "pending", "awaitingPayment", "ownerStay", "unknown", "", null, undefined]) {
  // Excluded statuses must not fail reporting, even without usable dates or amounts.
  assert.deepEqual(aggregateReservations([{ channelId: 2013, status }], since, until), {
    available: true, count: 0, revenue: {}, byListing: {},
  });
}

for (const value of ["Private", "private@example.com", "5551234567", "999999", "reservationDate", "notes"]) assert.equal(JSON.stringify(expected).includes(value), false);
const calls = [];
const fetcher = async (url, options) => {
  calls.push([String(url), options]);
  if (String(url).endsWith("/accessTokens")) return { ok: true, json: async () => ({ access_token: "fixture-token" }) };
  assert.equal(options.method, undefined);
  assert.equal(new URL(url).searchParams.get("channelId"), "2013");
  return { ok: true, json: async () => ({ result: fixture }) };
};
assert.deepEqual(await websiteReservations(since, until, { accountId: "fixture", apiKey: "fixture", fetcher }), expected);
assert.equal(calls.length, 2);
assert.deepEqual(await websiteReservations(since, until, { accountId: "", apiKey: "", fetcher }), { available: false });
assert.deepEqual(await websiteReservations(since, until, { accountId: "fixture", apiKey: "fixture", fetcher: async () => { throw Error("offline"); } }), { available: false });
let pages = 0;
assert.deepEqual(await websiteReservations(since, until, { accountId: "fixture", apiKey: "fixture", fetcher: async (url) => {
  if (String(url).endsWith("/accessTokens")) return { ok: true, json: async () => ({ access_token: "fixture-token" }) };
  assert.equal(new URL(url).searchParams.get("offset"), String(pages++ * 100));
  return { ok: true, json: async () => ({ result: Array(100).fill(row) }) };
} }), { available: false });
assert.equal(pages, 5);
assert.deepEqual(aggregateReservations([{ ...row, reservationDate: "bad" }], since, until), { available: false });
console.log("PASS: read-only reservation fixtures, pagination cap, PII exclusion");
