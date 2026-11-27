const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

(async () => {
  const prefill = await import('../src/lib/booking-prefill.ts');
  const analytics = await import('../src/lib/booking-analytics.ts');
  const path = await import('../src/lib/booking-path.ts');
  const code = ts.transpileModule(fs.readFileSync('src/components/booking/RoamsteadBooking.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : ['2026-11-27T12:00:00Z'])); }
  }
  async function mount(search, { status = 200, modify = () => {}, listingId = 455631 } = {}) {
    const slots = [], effects = [], requests = [], events = [];
    let index = 0, dirty = true, html = '', captures = 0;
    const exports = {};
    const hooks = {
      ...React,
      useState(initial) {
        const at = index++;
        if (!(at in slots)) slots[at] = typeof initial === 'function' ? initial() : initial;
        return [slots[at], value => { slots[at] = typeof value === 'function' ? value(slots[at]) : value; dirty = true; }];
      },
      useRef(initial) { const at = index++; return slots[at] ??= { current: initial }; },
      useMemo(fn) { const at = index++; return slots[at] ??= fn(); },
      useEffect(fn, deps) {
        const at = index++, prior = slots[at];
        if (!prior || deps.some((value, i) => !Object.is(value, prior.deps[i]))) {
          effects.push(() => { prior?.cleanup?.(); slots[at] = { deps, cleanup: fn() }; });
        }
      },
    };
    vm.runInNewContext(code, {
      exports, Date: FixedDate, Intl, AbortController, Response, console,
      window: { location: { search } },
      fetch: async (url, options) => {
        requests.push({ url, options });
        const params = new URL(url, 'https://local.test').searchParams;
        const start = params.get('startDate'), end = params.get('endDate');
        assert.ok((Date.parse(end) - Date.parse(start)) / 86400000 <= 75);
        const days = [];
        for (let time = Date.parse(start); time <= Date.parse(end); time += 86400000) {
          const day = { date: new Date(time).toISOString().slice(0, 10), available: true, arrivalAllowed: true, departureAllowed: true, minimumStay: 2, maximumStay: 365 };
          modify(day); days.push(day);
        }
        return Response.json({ days }, { status });
      },
      require(name) {
        if (name === 'react') return hooks;
        if (name === 'react/jsx-runtime') return require(name);
        if (name === '@/lib/booking-prefill') return prefill;
        if (name === '@/lib/booking-analytics') return analytics;
        if (name === '@/lib/booking-path') return path;
        if (name === '@/lib/analytics') return { getFirstTouchAttribution() { captures++; return null; }, trackBookingEvent: (...args) => events.push(args) };
        throw Error(name);
      },
    });
    for (let round = 0; round < 30; round++) {
      while (dirty) {
        dirty = false; index = 0;
        html = renderToStaticMarkup(React.createElement(exports.RoamsteadBooking, { listingId, propertySlug: 'granary' }));
        effects.splice(0).forEach(fn => fn());
      }
      if (round === 0) assert.equal(captures, 1, 'First touch captured before availability resolves');
      await new Promise(resolve => setImmediate(resolve));
    }
    return { html, requests, events, slots };
  }
  const query = '?start=2027-03-30&end=2027-04-02&numberOfGuests=3';
  const good = await mount(query);
  assert.equal((good.html.match(/aria-pressed="true"/g) || []).length, 2);
  assert.match(good.html, /March 2027/);
  assert.equal(good.slots[10], 0, 'Step stays on date picker');
  assert.equal(good.slots[11], 3, 'Adults prefilled');
  assert.equal(good.slots[12], 0, 'Children remain zero');
  assert.ok(good.requests.some(({url}) => url.includes('startDate=2027-03-01&endDate=2027-04-30')));
  assert.ok(good.requests[0].options.signal.aborted, 'Old month request cancelled');
  assert.ok(!good.events.some(([name]) => [analytics.BOOKING_EVENTS.guestStep, analytics.BOOKING_EVENTS.checkoutHandoff].includes(name)));
  for (const status of [503, 500]) {
    const failed = await mount(query, { status });
    assert.doesNotMatch(failed.html, /aria-pressed="true"/);
    assert.equal(failed.slots[7], null);
    assert.equal(failed.slots[8], null);
    assert.equal(failed.slots[11], 3);
  }
  for (const modify of [
    day => { if (day.date === '2027-03-30') day.arrivalAllowed = false; },
    day => { if (day.date === '2027-03-31') day.available = false; },
    day => { day.minimumStay = 4; },
    day => { day.maximumStay = 2; },
    day => { if (day.date === '2027-04-02') day.departureAllowed = false; },
  ]) assert.doesNotMatch((await mount(query, { modify })).html, /aria-pressed="true"/);
  const invalidGuests = await mount(query.replace('numberOfGuests=3', 'numberOfGuests=5'));
  assert.equal(invalidGuests.slots[11], 2);
  assert.equal((invalidGuests.html.match(/aria-pressed="true"/g) || []).length, 2);
  const long = await mount('?start=2027-03-30&end=2027-07-02');
  assert.equal(long.slots[7], '2027-03-30');
  assert.equal(long.slots[8], '2027-07-02');
  console.log('PASS: mounted prefill waits for live data, later/cross-month dates, chunked ranges, failures, stay rules, guest independence, no auto-advance');
})().catch(error => { console.error(error); process.exitCode = 1; });
