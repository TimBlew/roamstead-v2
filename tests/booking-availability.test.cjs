const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const source = fs.readFileSync("src/components/booking/RoamsteadBooking.tsx", "utf8");
const match = source.match(/const validDeparture = \(start: string, end: string\) => \{([\s\S]*?)\n  \};/);
assert.ok(match, "Locate production departure validation");
const data = {};
for (let day = 1; day <= 10; day++) {
  const date = "2027-01-" + String(day).padStart(2, "0");
  data[date] = { available: true, departureAllowed: true, minimumStay: 2, maximumStay: 5 };
}
const context = { data, Math, parse: value => new Date(value + "T12:00:00Z"), addDays: (date, days) => new Date(date.getTime() + days * 86400000), key: date => date.toISOString().slice(0, 10) };
vm.createContext(context);
vm.runInContext("this.valid = (start, end) => {" + match[1] + "};", context);
assert.equal(context.valid("2027-01-01", "2027-01-02"), false, "Minimum stay");
assert.equal(context.valid("2027-01-01", "2027-01-03"), true, "Exact minimum");
assert.equal(context.valid("2027-01-01", "2027-01-06"), true, "Exact maximum");
assert.equal(context.valid("2027-01-01", "2027-01-07"), false, "Maximum stay");
data["2027-01-03"].available = false;
assert.equal(context.valid("2027-01-01", "2027-01-03"), true, "Occupied departure date can be checked out");
assert.equal(context.valid("2027-01-01", "2027-01-04"), false, "Cannot cross unavailable night");
data["2027-01-03"].departureAllowed = false;
assert.equal(context.valid("2027-01-01", "2027-01-03"), false, "Closed departure");
assert.equal(context.valid("2027-01-01", "2027-02-01"), false, "Missing calendar record");
assert.equal(context.valid("2027-01-03", "2027-01-01"), false, "Reversed dates");
assert.equal(source.includes("HostawayBooking"), false, "Availability failure stays on the Roamstead calendar");
assert.equal(source.includes("Check dates with Hostaway"), false, "No off-site date CTA");
assert.equal(source.includes('setMode("fallback")'), false, "No Hostaway widget fallback mode");
assert.equal(source.includes("holidayfuture.com/checkout/"), true, "Checkout handoff remains");
assert.equal(source.includes("numberOfGuests"), true, "Checkout includes guests");
assert.equal(fs.existsSync("src/components/booking/HostawayBooking.tsx"), false, "Unused Hostaway widget removed");
for (const file of ["src/app/book/[slug]/page.tsx", "src/app/properties/[slug]/page.tsx", "src/app/book/page.tsx"]) {
  assert.equal(fs.readFileSync(file, "utf8").includes("fallbackUrl"), false, file);
}
const properties = fs.readFileSync("src/data/properties.ts", "utf8");
assert.equal(properties.includes("/listings/"), false, "Listing date links removed from property data");
assert.equal(properties.includes("https://us2.cloudbeds.com/reservation/j0tTa0"), true, "Senator booking stays on Cloudbeds");
console.log("PASS: departure validation and on-site calendar lock");
