import assert from 'node:assert/strict';
import { parseBookingPrefill, validBookingDeparture } from '../src/lib/booking-prefill.ts';
const dates = 'start=2026-12-14&end=2026-12-17';
const parse = search => parseBookingPrefill(search, '2026-11-27', 4);
assert.deepEqual(parse(`${dates}&numberOfGuests=2&currency=USD&total=555.34&taxes=70.36`), { start: '2026-12-14', end: '2026-12-17', guests: 2 });
for (const value of ['0', '1.5', 'two', '', '5', '-1', '+2', ' 2 ']) {
  assert.deepEqual(parse(`${dates}&numberOfGuests=${encodeURIComponent(value)}`), { start: '2026-12-14', end: '2026-12-17' });
}
for (const pair of [
  'start=2026-02-31&end=2026-12-17', 'start=no&end=2026-12-17',
  'start=2026-12-1&end=2026-12-17', 'start=2026/12/14&end=2026-12-17',
  'start=2026-12-14&end=2026-12-14', 'start=2026-12-17&end=2026-12-14',
  'start=2026-11-26&end=2026-12-17', 'start=2027-10-31&end=2027-11-01',
  'start=2026-12-14', 'end=2026-12-17', 'start=2026-12-14&end=2026-12-32',
]) assert.deepEqual(parse(`${pair}&numberOfGuests=3`), { guests: 3 }, pair);
assert.deepEqual(parseBookingPrefill('start=2026-02-31&end=2026-03-04', '2026-02-01', 4), {});
assert.deepEqual(parse('start=2026-11-27&end=2027-10-31'), { start: '2026-11-27', end: '2027-10-31' });
assert.deepEqual(parseBookingPrefill('start=2028-02-29&end=2028-03-01', '2028-02-01', 4), { start: '2028-02-29', end: '2028-03-01' });
for (const max of [4, 8, 10]) {
  assert.equal(parseBookingPrefill(`numberOfGuests=${max}`, '2026-11-27', max).guests, max);
  assert.equal(parseBookingPrefill(`numberOfGuests=${max + 1}`, '2026-11-27', max).guests, undefined);
}
const start = '2026-12-30', end = '2027-01-02';
const days = Object.fromEntries(['2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02'].map(date => [date, { date, available: true, arrivalAllowed: true, departureAllowed: true, minimumStay: 2, maximumStay: 5 }]));
assert.equal(validBookingDeparture(days, start, end), true);
for (const [date, overrides] of [[start, { arrivalAllowed: false }], [end, { departureAllowed: false }], ['2026-12-31', { available: false }], [start, { minimumStay: 4 }], [start, { maximumStay: 2 }]]) {
  assert.equal(validBookingDeparture({ ...days, [date]: { ...days[date], ...overrides } }, start, end), false);
}
const missing = { ...days }; delete missing['2026-12-31'];
assert.equal(validBookingDeparture(missing, start, end), false);
assert.equal(validBookingDeparture({}, start, end), false);
assert.equal(validBookingDeparture({ ...days, [end]: { ...days[end], available: false } }, start, end), true, 'Departure need not be an available overnight');
console.log('PASS: strict UTC prefill parsing and shared live stay rules');
