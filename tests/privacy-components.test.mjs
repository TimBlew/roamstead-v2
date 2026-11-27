import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import { isAnalyticsBlocked } from "../src/lib/booking-analytics.ts";
const require = createRequire(import.meta.url);
const ts = require("typescript");

// Execute the real components with a small hook harness: inspect the first render,
// run mount effects, then render again. No DOM, injected script or network needed.
function component(file, mocks) {
  let state = [], index = 0, effects = [], mounted = false;
  const react = {
    useState(initial) {
      const slot = index++;
      if (!(slot in state)) state[slot] = initial;
      return [state[slot], value => { state[slot] = value; }];
    },
    useEffect(fn) { if (!mounted) effects.push(fn); },
  };
  const js = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, window: globalThis.window, require: name => name === "react" ? react : mocks[name] ?? require(name) });
  return {
    render(name, props = {}) { index = 0; return exports[name](props); },
    mount() { for (const effect of effects) effect(); effects = []; mounted = true; },
  };
}

Object.defineProperty(globalThis, "navigator", { configurable: true, value: {} });
for (const mode of ["ssr", "on", "optout", "dnt", "windowDnt", "gpc"]) {
  navigator.doNotTrack = mode === "dnt" ? "1" : "0";
  navigator.globalPrivacyControl = mode === "gpc";
  if (mode === "ssr") delete globalThis.window;
  else globalThis.window = { doNotTrack: mode === "windowDnt" ? "1" : "0", localStorage: { getItem: () => mode === "optout" ? "1" : null } };
  const Analytics = () => null;
  let registrations = 0;
  const c = component("../src/components/analytics/PublicAnalytics.tsx", {
    "next/navigation": { usePathname: () => "/midway" },
    "@vercel/analytics/next": { Analytics },
    "@/lib/analytics": { captureLandingAttribution() {} },
    "@/lib/booking-analytics": { isAnalyticsBlocked, registerAnalyticsSanitizer() { registrations++; }, sanitizeAnalyticsEvent() {} },
  });
  assert.equal(c.render("PublicAnalytics"), null, mode + ": no script on server/initial render");
  if (mode === "ssr") continue;
  c.mount();
  const result = c.render("PublicAnalytics");
  if (mode === "on") assert.equal(result.type, Analytics);
  else {
    assert.equal(result, null, mode + ": no Analytics component after mount");
    assert.equal(registrations, 0);
  }
}

const Button = props => require("react").createElement("button", props);
const map = component("../src/components/properties/PropertyMap.tsx", { "@/components/ui/Button": { Button } });
const initial = map.render("PropertyMap", { mapQuery: "Midway, Utah" });
const markup = renderToStaticMarkup(initial);
assert.ok(markup.includes("Map of Midway, Utah"));
assert.ok(markup.includes("Show map"));
assert.ok(!markup.includes("<iframe"));
assert.ok(!markup.includes("google.com"));
assert.match(initial.props.className, /h-\[300px\].*rounded-\[18px\].*md:h-\[420px\].*md:rounded-\[20px\]/);
const button = initial.props.children.find(child => child.type === Button);
assert.equal(button.props.type, "button");
button.props.onClick();
const iframe = map.render("PropertyMap", { mapQuery: "Midway, Utah" });
assert.equal(iframe.type, "iframe");
assert.equal(iframe.props.src, "https://www.google.com/maps?q=Midway%2C%20Utah&output=embed");
assert.equal(iframe.props.title, "Map of Midway, Utah");
assert.equal(iframe.props.referrerPolicy, "no-referrer-when-downgrade");
assert.equal(iframe.props.loading, "lazy");
assert.equal(iframe.props.className, "h-[300px] w-full rounded-[18px] border-0 md:h-[420px] md:rounded-[20px]");
const layout = fs.readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
assert.doesNotMatch(layout, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
for (const font of ["bricolage-grotesque", "funnel-sans"]) assert.ok(layout.includes(font));
assert.ok(layout.includes('from "next/font/local"'));
console.log("PASS: mount-safe analytics script gating, click-to-load map and self-hosted font wiring");
