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
console.log("PASS: nine production departure-validation cases");
