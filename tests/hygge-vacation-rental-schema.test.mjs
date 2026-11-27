import assert from "node:assert/strict";
import { getProperty } from "../src/data/properties.ts";
import { jsonLdString, vacationRentalJsonLd } from "../src/lib/structured-data.ts";

const supportedBedTypes = new Set(["CaliforniaKing", "King", "Queen", "Full", "Double", "SemiDouble", "Single", "Sofa"]);
const supportedAmenityNames = new Set([
  "ac", "airportShuttle", "balcony", "beachAccess", "childFriendly", "crib", "elevator", "fireplace",
  "freeBreakfast", "gymFitnessEquipment", "heating", "hotTub", "instantBookable", "ironingBoard",
  "kitchen", "microwave", "outdoorGrill", "ovenStove", "patio", "petsAllowed", "pool", "privateBeachAccess",
  "selfCheckinCheckout", "smokingAllowed", "tv", "washerDryer", "wheelchairAccessible", "wifi",
  "internetType", "parkingType", "poolType", "licenseNum",
]);

function requireType(value, type, label) {
  assert.equal(typeof value, type, label);
}

function validateHygge(data) {
  assert.equal(data["@context"], "https://schema.org");
  assert.equal(data["@type"], "VacationRental");
  requireType(data.identifier, "string", "identifier");
  requireType(data.name, "string", "name");
  requireType(data.url, "string", "url");
  assert.equal(data.checkinTime, "15:00:00");
  assert.equal(data.checkoutTime, "10:00:00");
  assert.equal(data.address["@type"], "PostalAddress");
  assert.equal(data.address.addressLocality, "Midway");
  assert.equal(data.address.addressRegion, "UT");
  assert.equal(data.address.addressCountry, "US");
  assert.equal("streetAddress" in data.address, false);
  assert.equal("postalCode" in data.address, false);
  assert.equal(data.latitude, 40.51138);
  assert.equal(data.longitude, -111.45804);
  assert.equal(data.aggregateRating, undefined);
  assert.equal(data.priceRange, undefined);
  assert.equal(data.offers, undefined);
  assert.ok(Array.isArray(data.image) && data.image.length === 13, "full Hygge gallery");

  const place = data.containsPlace;
  assert.equal(place["@type"], "Accommodation");
  assert.equal(place.occupancy["@type"], "QuantitativeValue");
  assert.equal(place.occupancy.value, 10);
  assert.equal(place.occupancy.maxValue, 10);
  assert.equal(place.numberOfBedrooms, 4);
  assert.equal(place.numberOfBathroomsTotal, 3);
  assert.equal(place.petsAllowed, true);
  assert.equal(place.smokingAllowed, undefined);

  assert.ok(Array.isArray(place.bed));
  let beds = 0;
  for (const bed of place.bed) {
    assert.equal(bed["@type"], "BedDetails");
    assert.equal(Number.isInteger(bed.numberOfBeds) && bed.numberOfBeds > 0, true);
    assert.equal(supportedBedTypes.has(bed.typeOfBed), true, bed.typeOfBed);
    beds += bed.numberOfBeds;
  }
  assert.equal(beds, 5);
  assert.deepEqual(place.bed.map((bed) => `${bed.numberOfBeds} ${bed.typeOfBed}`), [
    "1 King",
    "1 Queen",
    "1 Queen",
    "1 Single",
    "1 Sofa",
  ]);

  assert.ok(Array.isArray(place.amenityFeature));
  const names = place.amenityFeature.map((item) => item.name);
  assert.deepEqual(names, [
    "wifi", "ac", "kitchen", "gymFitnessEquipment", "fireplace", "washerDryer",
    "heating", "parkingType", "balcony", "outdoorGrill", "tv",
  ]);
  for (const item of place.amenityFeature) {
    assert.equal(item["@type"], "LocationFeatureSpecification");
    assert.equal(supportedAmenityNames.has(item.name), true, item.name);
    if (item.name === "parkingType") assert.equal(item.value, "Free");
    else assert.equal(item.value, true);
  }
  for (const absent of ["smokingAllowed", "sauna", "dishwasher", "firePit", "workspace"]) {
    assert.equal(names.includes(absent), false, absent);
  }
}

const property = getProperty("hygge-house");
assert.equal(property.stats.find((stat) => stat.label === "Sleeps").value, "10");
const data = vacationRentalJsonLd(property);
const parsed = JSON.parse(jsonLdString(data));
validateHygge(parsed);

const granary = vacationRentalJsonLd(getProperty("granary"));
assert.equal(granary.checkinTime, undefined);
assert.equal(granary.containsPlace.petsAllowed, undefined);
assert.equal(granary.containsPlace.bed, undefined);

assert.equal(granary.containsPlace.occupancy.value, 4);

console.log("PASS: Hygge VacationRental JSON-LD");

const { galleries } = await import("../src/data/property-galleries.ts");
const { canonical } = await import("../src/lib/site.ts");
const expected = {
  "hygge-house": [40.51138, -111.45804, 13, ["wifi", "ac", "kitchen", "gymFitnessEquipment", "fireplace", "washerDryer", "heating", "parkingType", "balcony", "outdoorGrill", "tv"]],
  granary: [40.51224, -111.45758, 10, ["fireplace", "kitchen", "washerDryer", "wifi", "tv", "parkingType"]],
  lowell: [40.65144, -111.50651, 13, ["kitchen", "washerDryer", "wifi", "ac", "heating", "tv", "pool", "hotTub", "gymFitnessEquipment", "elevator", "selfCheckinCheckout", "parkingType"]],
  "powder-room": [40.65144, -111.50651, 9, ["wifi", "ac", "heating", "pool", "hotTub", "gymFitnessEquipment", "elevator", "microwave", "outdoorGrill", "parkingType"]],
};
for (const [slug, [latitude, longitude, count, amenities]] of Object.entries(expected)) {
  const property = getProperty(slug);
  const rental = JSON.parse(jsonLdString(vacationRentalJsonLd(property)));
  assert.equal(rental["@type"], "VacationRental");
  assert.equal(rental.latitude, latitude);
  assert.equal(rental.longitude, longitude);
  assert.deepEqual(rental.geo, { "@type": "GeoCoordinates", latitude, longitude });
  const images = [...new Set([property.hero.image.src, ...galleries[slug].map(photo => photo.src)].map(src => src.startsWith("http") ? src : canonical(src)))];
  assert.deepEqual(rental.image, images);
  assert.equal(rental.image.length, count);
  const features = rental.containsPlace.amenityFeature;
  assert.deepEqual(features.map(item => item.name), amenities);
  for (const item of features) {
    assert.equal(item["@type"], "LocationFeatureSpecification");
    assert.ok(supportedAmenityNames.has(item.name));
    assert.equal(item.value, item.name === "parkingType" ? "Free" : true);
  }
  for (const forbidden of ["aggregateRating", "review", "offers", "priceRange", "streetAddress", "postalCode"]) {
    assert.ok(!JSON.stringify(rental).includes(`"${forbidden}":`));
  }
  if (slug !== "hygge-house") {
    assert.equal(rental.checkinTime, undefined);
    assert.equal(rental.checkoutTime, undefined);
    assert.equal(rental.containsPlace.petsAllowed, undefined);
  }
  if (slug === "powder-room") {
    assert.equal(rental.additionalType, "https://schema.org/Apartment");
    assert.equal(rental.containsPlace.numberOfBedrooms, undefined);
    assert.equal(rental.containsPlace.occupancy.maxValue, 4);
    assert.ok(!JSON.stringify(rental).includes('"Hotel"'));
  }
}
