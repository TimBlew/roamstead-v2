import assert from "node:assert/strict";
import fs from "node:fs";
import { googleSiteVerification } from "../src/lib/site.ts";

const places = fs.readFileSync("src/data/places.ts", "utf8");
const hub = fs.readFileSync("src/components/places/PlaceHubDetails.tsx", "utf8");
const midwayPage = fs.readFileSync("src/app/midway/page.tsx", "utf8");
const placePage = fs.readFileSync("src/components/places/PlacePage.tsx", "utf8");
const structured = fs.readFileSync("src/lib/structured-data.ts", "utf8");
const layout = fs.readFileSync("src/app/layout.tsx", "utf8");
const robots = fs.readFileSync("src/app/robots.ts", "utf8");
const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8");
const propertyPage = fs.readFileSync("src/app/properties/[slug]/page.tsx", "utf8");

assert.match(places, /src: "\/images\/book-direct-sunset\.png"/);
assert.match(places, /className: "object-cover object-\[68%_center\]"/);
assert.match(places, /alt: "Hygge House surrounded by trees beneath the mountains and warm sunset sky in Midway, Utah"/);
assert.match(places, /caption: "Hygge House, Midway"/);
assert.match(places, /title: "Midway stays \| Roamstead Collective"/);
assert.match(places, /heading: "Two ways to stay in Midway\."/);
assert.match(places, /snow-dependent/);
assert.match(places, /Check the Soldier Hollow FAQ for current operating status/);
assert.match(places, /April and May 2027/);
assert.doesNotMatch(places, /December\s*21/);
assert.doesNotMatch(hub, /December\s*21/);
assert.match(places, /reviewedOn: "2026-11-08"/);
assert.doesNotMatch(places, /November 9, 2026/);
assert.doesNotMatch(hub, /November 9, 2026/);
assert.match(hub, /dateTime=\{place\.planning\.reviewedOn\}/);
assert.match(hub, /November 8, 2026/);
assert.match(hub, /Mountain Time/);
assert.match(structured, /dateModified: place\.planning\.reviewedOn/);
assert.match(places, /https:\/\/utaholympiclegacy\.org\/faq\/soldier-hollow\//);
assert.match(places, /https:\/\/homesteadmidwayutah\.com\/adventures\/crater\//);
assert.match(places, /heading: "Wedding guests"/);
assert.match(places, /heading: "Work trips"/);
assert.match(places, /overnight lodging/);
assert.doesNotMatch(places, /sleeps ten|Sleeps 10|walkable|walking distance|Pets are allowed|covered parking|Sundance|Deer Valley|utm_|FAQPage/i);
assert.match(places, /The Lowell and Powder Room both sit at the resort base\./);

assert.match(hub, /\/properties\/\$\{property\.slug\}/);
assert.match(hub, /#availability/);
assert.doesNotMatch(hub, /utm_|FAQPage|google-site-verification/);
assert.match(placePage, /place\.hero\.className/);
assert.match(placePage, /<PlaceHubDetails place=\{place\} \/>/);
assert.match(midwayPage, /midwayCollectionJsonLd/);
assert.doesNotMatch(midwayPage, /FAQPage|utm_/);

assert.match(structured, /identifier: property\.slug/);
assert.match(structured, /if \(property\.slug === "granary"\) occupancyValue\.value = occupancy/);
assert.match(structured, /"@type": "CollectionPage"/);
assert.doesNotMatch(structured, /latitude|longitude|streetAddress|postalCode|FAQPage/);
assert.match(robots, /disallow: \["\/api\/", "\/book\/"\]/);
assert.match(sitemap, /"\/", "\/properties", \.\.\.placePaths, "\/book"/);
assert.match(propertyPage, /quality=\{100\}/);
assert.match(propertyPage, /placePath && placeLabel/);
assert.doesNotMatch(layout, /google-site-verification|content="[^"]*token/i);
assert.match(layout, /googleSiteVerification\(\)/);

const previous = process.env.ROAMSTEAD_GOOGLE_SITE_VERIFICATION;
delete process.env.ROAMSTEAD_GOOGLE_SITE_VERIFICATION;
assert.equal(googleSiteVerification(), undefined);
process.env.ROAMSTEAD_GOOGLE_SITE_VERIFICATION = "   ";
assert.equal(googleSiteVerification(), undefined);
process.env.ROAMSTEAD_GOOGLE_SITE_VERIFICATION = "issued-public-token";
assert.equal(googleSiteVerification(), "issued-public-token");
if (previous === undefined) delete process.env.ROAMSTEAD_GOOGLE_SITE_VERIFICATION;
else process.env.ROAMSTEAD_GOOGLE_SITE_VERIFICATION = previous;

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

function canonicalHref(html) {
  const match = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.ok(match, "missing canonical");
  return match[1];
}

const base = process.env.MIDWAY_HUB_URL;
if (base) {
  const tagged = "/midway?utm_source=google&utm_medium=cpc&utm_campaign=midway-stays&utm_content=hygge-house.search-01";
  const mobileHeaders = { "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" };
  const [cleanRes, taggedRes, mobileRes, hyggeRes, granaryRes, lowellRes, homeRes, calendarRes] = await Promise.all([
    fetch(`${base}/midway`),
    fetch(`${base}${tagged}`),
    fetch(`${base}/midway`, { headers: mobileHeaders }),
    fetch(`${base}/properties/hygge-house`),
    fetch(`${base}/properties/granary`),
    fetch(`${base}/properties/lowell`),
    fetch(`${base}/`),
    fetch(`${base}/api/hostaway/availability?listingId=455635&startDate=2026-11-01&endDate=2026-11-30`),
  ]);
  assert.equal(cleanRes.status, 200);
  assert.equal(taggedRes.status, 200);
  assert.equal(mobileRes.status, 200);
  const cleanHtml = await cleanRes.text();
  const taggedHtml = await taggedRes.text();
  const mobileHtml = await mobileRes.text();
  for (const html of [cleanHtml, taggedHtml, mobileHtml]) {
    assert.match(html, /href="\/properties\/hygge-house"/);
    assert.match(html, /href="\/properties\/granary"/);
    assert.match(html, /href="\/properties\/hygge-house#availability"/);
    assert.match(html, /href="\/properties\/granary#availability"/);
    assert.match(html, /Explore Hygge House/);
    assert.match(html, /Explore Granary/);
    const internalHrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map((match) => match[1]);
    assert.equal(internalHrefs.some((href) => href.includes("utm_")), false);
    assert.doesNotMatch(html, /FAQPage/);
    assert.equal(canonicalHref(html).endsWith("/midway"), true, canonicalHref(html));
    assert.equal(canonicalHref(html).includes("?"), false);
  }
  const collection = jsonLdBlocks(cleanHtml).find((block) => block["@type"] === "CollectionPage");
  assert.ok(collection, "missing CollectionPage");
  assert.equal(collection.name, "Two ways to stay in Midway.");
  assert.equal(collection.dateModified, "2026-11-08");
  assert.match(cleanHtml, /<time dateTime="2026-11-08">November 8, 2026<\/time>, Mountain Time\./);
  assert.match(cleanHtml, /Nordic skiing and tubing there are snow-dependent/);
  assert.match(cleanHtml, /Check the Soldier Hollow FAQ for current operating status/);
  assert.match(cleanHtml, /closed for renovations in April and May 2027/);
  assert.doesNotMatch(cleanHtml, /December\s*21/);
  for (const point of ["Four bedrooms", "Dedicated office and desks", "Sauna", "Laundry, gear storage, and two living spaces", "One bedroom", "King bed and a sofa bed", "Kitchen and laundry", "Gas fireplace"]) {
    assert.match(cleanHtml, new RegExp(point.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(cleanHtml, new RegExp(collection.description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(collection.mainEntity.itemListElement.length, 2);
  assert.deepEqual(collection.mainEntity.itemListElement.map((item) => item.name), ["Hygge House", "Granary"]);
  assert.equal(collection.mainEntity.itemListElement[0].url.endsWith("/properties/hygge-house"), true);
  assert.equal(collection.mainEntity.itemListElement[1].url.endsWith("/properties/granary"), true);
  assert.equal(collection.mainEntity.itemListElement[0].item["@id"].endsWith("/properties/hygge-house#vacation-rental"), true);
  assert.doesNotMatch(JSON.stringify(collection), /utm_|latitude|longitude|streetAddress/);

  const hyggeHtml = await hyggeRes.text();
  const granaryHtml = await granaryRes.text();
  const lowellHtml = await lowellRes.text();
  const hyggeLd = jsonLdBlocks(hyggeHtml).find((block) => block["@type"] === "VacationRental");
  const granaryLd = jsonLdBlocks(granaryHtml).find((block) => block["@type"] === "VacationRental");
  const lowellLd = jsonLdBlocks(lowellHtml).find((block) => block["@type"] === "VacationRental");
  assert.equal(hyggeLd.identifier, "hygge-house");
  assert.equal(hyggeLd.containsPlace.occupancy.maxValue, 10);
  assert.equal("value" in hyggeLd.containsPlace.occupancy, false);
  assert.equal(hyggeLd.containsPlace.numberOfBedrooms, 4);
  assert.equal(hyggeLd.image.length, 4);
  assert.equal(granaryLd.identifier, "granary");
  assert.equal(granaryLd.containsPlace.occupancy.value, 4);
  assert.equal(granaryLd.containsPlace.occupancy.maxValue, 4);
  assert.equal(granaryLd.containsPlace.numberOfBedrooms, 1);
  assert.equal(granaryLd.image.length, 3);
  assert.equal(lowellLd.identifier, "lowell");
  assert.equal("value" in lowellLd.containsPlace.occupancy, false);
  for (const block of [hyggeLd, granaryLd, lowellLd]) {
    assert.equal(block.latitude, undefined);
    assert.equal(block.longitude, undefined);
    assert.equal(block.address.streetAddress, undefined);
    assert.equal(block.address.postalCode, undefined);
    assert.equal(block.address.addressLocality === "Midway" || block.address.addressLocality === "Park City", true);
  }
  assert.equal((hyggeHtml.match(/<a [^>]*href="\/midway"[^>]*>Staying in Midway<\/a>/g) || []).length, 1);
  assert.equal((granaryHtml.match(/<a [^>]*href="\/midway"[^>]*>Staying in Midway<\/a>/g) || []).length, 1);
  assert.match(hyggeHtml, /Find your dates/);
  assert.match(granaryHtml, /Find your dates/);
  assert.equal(canonicalHref(hyggeHtml).endsWith("/properties/hygge-house"), true);
  assert.doesNotMatch(await homeRes.text(), /google-site-verification/);
  const calendarStatus = calendarRes.status;
  assert.ok([200, 401, 403, 502, 503].includes(calendarStatus), `unexpected calendar status ${calendarStatus}`);
  console.log(`calendar_status=${calendarStatus}`);
}
