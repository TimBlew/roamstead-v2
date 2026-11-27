import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { getPlace, placeMetadata } from "../src/data/places.ts";
import { getProperty } from "../src/data/properties.ts";

const title = "Midway and Park City, Utah Vacation Rentals | Roamstead";
const description = "Homes in Midway and Park City across Utah's Wasatch Back. Ski, ride, then settle in. Book direct with Roamstead Collective.";
const read = path => fs.readFileSync(path, "utf8");

// Read the exported metadata without loading the page's React components.
function sourceMetadata(path) {
  const source = read(path);
  const match = source.match(/export const metadata(?:\s*:\s*Metadata)? = (\{[\s\S]*?\n\});/);
  assert.ok(match, `missing metadata in ${path}`);
  return vm.runInNewContext(`(${match[1]})`, {
    socialImage: "", siteUrl: "", launchIndexingEnabled: false, googleVerification: undefined,
  });
}

const metadata = sourceMetadata("src/app/properties/page.tsx");
for (const meta of [metadata, metadata.openGraph, metadata.twitter]) {
  assert.equal(meta.title, title);
  assert.equal(meta.description, description);
}

const unchangedTitles = [
  ["/park-city", "Park City Mountain Base Rentals | The Lowell and Powder Room"],
  ["/midway", "Midway, Utah Vacation Rentals | Hygge House and Granary"],
  ["/properties/lowell", "The Lowell Park City | 2BR Condo at Park City Mountain Base"],
  ["/properties/powder-room", "Powder Room | Studio at Park City Mountain Base, Utah"],
  ["/properties/hygge-house", "Hygge House | 4-Bedroom Midway Utah Vacation Rental | Roamstead"],
  ["/properties/granary", "Granary | 1-Bedroom Condo in Midway Utah | Roamstead"],
  ["/", "Roamstead Collective | Wasatch Back stays in Midway & Park City"],
];
for (const [route, expected] of unchangedTitles) {
  if (route.startsWith("/properties/")) {
    assert.equal(getProperty(route.split("/").at(-1)).seo.title, expected);
  } else if (route !== "/") {
    const page = read(`src/app${route}/page.tsx`);
    assert.ok(page.includes(`getPlace("${route.slice(1)}")`));
    assert.match(page, /export const metadata = placeMetadata\(place\)/);
    const hubMetadata = placeMetadata(getPlace(route.slice(1)));
    for (const meta of [hubMetadata, hubMetadata.openGraph, hubMetadata.twitter]) {
      assert.equal(meta.title, expected);
    }
  } else {
    const home = sourceMetadata("src/app/page.tsx");
    for (const meta of [home, home.openGraph, home.twitter]) assert.equal(meta.title, expected);
    assert.equal(sourceMetadata("src/app/layout.tsx").title, expected);
  }
}
const propertyPage = read("src/app/properties/[slug]/page.tsx");
assert.equal([...propertyPage.matchAll(/title: property\.seo\.title/g)].length, 3);

// Run after the build with SEO_RENDERED_HTML=1 to check the emitted metadata.
if (process.env.SEO_RENDERED_HTML === "1") {
  const html = read(".next/server/app/properties.html");
  assert.ok(html.includes(`<title>${title}</title>`));
  assert.ok(html.includes(`<meta property="og:title" content="${title}"`));
  assert.ok(html.includes(`<meta name="twitter:title" content="${title}"`));
  const decode = text => text.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');
  for (const [route, expected] of unchangedTitles) {
    const otherHtml = read(`.next/server/app${route === "/" ? "/index" : route}.html`);
    assert.equal(decode(otherHtml.match(/<title>(.*?)<\/title>/)[1]), expected, route);
  }
}
console.log("PASS: properties titles and description; other page titles unchanged");
