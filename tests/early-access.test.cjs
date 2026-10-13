const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
let source = fs.readFileSync("src/app/api/early-access/route.ts", "utf8")
  .replace('import { NextResponse } from "next/server";', "")
  .replace("export async function POST(request: Request)", "async function POST(request)")
  .replace("let payload: { email?: unknown; season?: unknown; home?: unknown; consent?: unknown };", "let payload;")
  .replace(/ as \{ name\?: string; message\?: string; statusCode\?: number \}/g, "");
const environment = { RESEND_API_KEY: "mock-send-only", EARLY_ACCESS_FROM: "mock@example.invalid", RESEND_CONTACTS_API_KEY: "mock-contact", RESEND_ROAMSTEAD_SEGMENT_ID: "mock-segment" };
async function run(statuses, payload = { email: "qa@example.invalid", season: "Winter", home: "", consent: true }, env = environment) {
  const calls = [];
  const context = { process: { env }, console: { error() {}, info() {} }, encodeURIComponent,
    NextResponse: { json: (body, opts) => ({ body, status: opts?.status || 200 }) },
    fetch: async (url, options) => { calls.push({ url, options }); const status = statuses.shift(); assert.ok(status, "Unexpected external request"); return { ok: status >= 200 && status < 300, status, json: async () => ({}) }; }
  };
  vm.createContext(context); vm.runInContext(source + "\nthis.POST = POST;", context);
  const result = await context.POST({ json: async () => payload });
  return { result, calls };
}
(async () => {
  const good = await run([200, 200]); assert.equal(good.result.body.audienceStored, true);
  const storageFailure = await run([200, 500]); assert.equal(storageFailure.result.body.audienceStored, false); assert.equal(storageFailure.calls.length, 2);
  const existing = await run([200, 409, 200, 200]); assert.equal(existing.result.body.audienceStored, true);
  const patch = JSON.parse(existing.calls[3].options.body); assert.equal("unsubscribed" in patch, false, "Must preserve existing opt-out");
  const membershipFailure = await run([200, 409, 500, 200]); assert.equal(membershipFailure.result.body.audienceStored, false);
  const emailFailure = await run([500]); assert.equal(emailFailure.result.status, 502); assert.equal(emailFailure.calls.length, 1);
  const unconfigured = await run([], undefined, {}); assert.equal(unconfigured.result.status, 503); assert.equal(unconfigured.calls.length, 0);
  const invalid = await run([], { email: "invalid", consent: true }); assert.equal(invalid.result.status, 400); assert.equal(invalid.calls.length, 0);
  const notificationOnly = await run([200], undefined, { RESEND_API_KEY: "mock", EARLY_ACCESS_FROM: "mock@example.invalid" }); assert.equal(notificationOnly.result.body.audienceStored, false);
  console.log("PASS: eight signup delivery/storage cases, no real network requests or notifications");
})().catch(error => { console.error(error); process.exitCode = 1; });
