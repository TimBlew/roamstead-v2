import assert from "node:assert/strict";
import { propertyImageQuality } from "../src/lib/property-image-quality.ts";

assert.equal(propertyImageQuality("hygge-house", 100), 85);
assert.equal(propertyImageQuality("granary", 100), 85);
assert.equal(propertyImageQuality("granary", 95), 85);
assert.equal(propertyImageQuality("lowell", 100), 100);
assert.equal(propertyImageQuality("lowell", 95), 95);
assert.equal(propertyImageQuality("powder-room", 100), 100);
assert.equal(propertyImageQuality("senator", 95), 95);
assert.equal(propertyImageQuality("", 100), 100);

console.log("PASS: image quality change is limited to Hygge House and Granary");
