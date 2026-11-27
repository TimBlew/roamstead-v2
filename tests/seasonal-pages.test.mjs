import assert from "node:assert/strict";
import fs from "node:fs";
import { seasonalPages } from "../src/data/seasonal-pages.ts";
import { seasonalMetadata } from "../src/lib/seasonal-metadata.ts";
import { seasonalPageJsonLd, parkCityCollectionJsonLd, jsonLdString } from "../src/lib/structured-data.ts";
import { getPlace } from "../src/data/places.ts";
import { canonical } from "../src/lib/site.ts";

const expected = [
  [seasonalPages.parkCity, "Christmas and New Year's at Park City Mountain | Studio Stay", "Planning Christmas or New Year's in Park City? Powder Room is a studio at the Park City Mountain base, with a pool and hot tub. Check dates and book direct.", [455633, 455632]],
  [seasonalPages.midway, "Midway, Utah in December | Fireplace Condo and Family Home", "December in Midway, in the Heber Valley. Granary, a 1-bedroom condo with a fireplace, and Hygge House, a 4-bedroom home with a sauna. Check dates and book direct.", [455631, 455635]],
];
for (const [page, title, description, listingIds] of expected) {
  const metadata = seasonalMetadata(page);
  for (const meta of [metadata, metadata.openGraph, metadata.twitter]) {
    assert.equal(meta.title, title);
    assert.equal(meta.description, description);
  }
  assert.equal(metadata.alternates.canonical, canonical(page.path));
  assert.ok(fs.readFileSync("src/app/sitemap.ts", "utf8").includes(`"${page.path}"`));
  const route = fs.readFileSync(`src/app${page.path}/page.tsx`, "utf8");
  assert.match(route, /seasonalMetadata\(page\)/);
  assert.match(route, /<SeasonalPage page=\{page\}/);
  assert.deepEqual(page.sections.filter(s => s.listingId).map(s => s.listingId), listingIds);
  const schema = JSON.parse(jsonLdString(seasonalPageJsonLd(page)));
  const [webpage, breadcrumb] = schema["@graph"];
  assert.equal(webpage["@type"], "WebPage");
  assert.equal(breadcrumb["@type"], "BreadcrumbList");
  assert.deepEqual(breadcrumb.itemListElement.map(i => i.item), [canonical("/"), canonical(page.townPath), canonical(page.path)]);
  assert.deepEqual(webpage.mainEntity.itemListElement.map(i => i.item["@id"]), page.slugs.map(slug => `${canonical(`/properties/${slug}`)}#vacation-rental`));
  // The exact approved FAQ is the only ski-in/ski-out language allowed.
  const copy = JSON.stringify({ ...page, faq: undefined });
  assert.doesNotMatch(copy, /ski[- ]in|ski[- ]out|slopeside|open December nights|Dec(?:ember)?\s+\d|as of Nov|nights (?:may still be|are still) open|calmer|quieter December|close enough to Park City|1-night|2-night|\$\d|discount|Sundance|Ice Castles|—/i);
}
assert.deepEqual(seasonalPages.parkCity.faq[0], { question: "Is it ski-in, ski-out?", answer: "Powder Room is at the Park City Mountain Resort base, steps from the snow. We do not describe it as ski-in or ski-out." });
const collection = JSON.parse(jsonLdString(parkCityCollectionJsonLd(getPlace("park-city"))));
assert.equal(collection["@type"], "CollectionPage");
assert.equal(collection.dateModified, undefined);
assert.deepEqual(collection.mainEntity.itemListElement.map(i => i.item["@id"]), ["lowell", "powder-room"].map(slug => `${canonical(`/properties/${slug}`)}#vacation-rental`));
assert.ok(collection.mainEntity.itemListElement.every(i => i.image.startsWith("https://")));
const component = fs.readFileSync("src/components/seasonal/SeasonalPage.tsx", "utf8");
assert.match(component, /RoamsteadBooking listingId=\{section.listingId\} propertySlug=\{section.slug\}/);
assert.match(component, /jsonLdString\(seasonalPageJsonLd\(page\)\)/);
assert.doesNotMatch(component, /<main\b/);
assert.match(component, /<article\b/);
assert.match(JSON.stringify(seasonalPages.parkCity), /The Lowell, also at the Park City Mountain base, is a 2-bedroom condo that sleeps 8/);
assert.match(JSON.stringify(seasonalPages.parkCity), /Sleeps 4: 1 California King and 1 full\/queen futon/);
assert.doesNotMatch(JSON.stringify(seasonalPages), /same building|\(sleeps 2\)|You only leave to pay/);
assert.match(JSON.stringify(seasonalPages.midway), /Room for the whole group:/);
assert.match(JSON.stringify(seasonalPages.parkCity), /Pick your dates here, then finish payment securely with our booking partner/);
console.log("PASS: seasonal metadata, copy, calendars, sitemap, and JSON-LD");

// Run after npm run build with SEO_RENDERED_HTML=1 to inspect Next's output.
if (process.env.SEO_RENDERED_HTML === "1") {
  const decode = text => text.replaceAll("&#x27;", "'").replaceAll("&amp;", "&").replaceAll("&quot;", '"');
  for (const [page] of expected) {
    const html = fs.readFileSync(`.next/server/app${page.path}.html`, "utf8");
    assert.equal(decode(html.match(/<title>(.*?)<\/title>/)[1]), page.title);
    assert.equal(decode(html.match(/<meta name="description" content="([^"]*)"/)[1]), page.description);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.equal((html.match(/<main\b/g) ?? []).length, 1);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    assert.ok(schemas.some(schema => schema["@graph"]?.some(node => node["@type"] === "WebPage")));
    for (const section of page.sections.filter(section => section.cta)) assert.ok(html.includes(`href="/properties/${section.slug}"`));
  }
}
