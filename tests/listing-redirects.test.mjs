import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import nextConfig from "../next.config.js";

const redirects = await nextConfig.redirects();
const expected = {
  "/listings/455631": "/properties/granary",
  "/listings/455635": "/properties/hygge-house",
  "/listings/455633": "/properties/powder-room",
  "/listings/455632": "/properties/lowell",
  "/listings/house-midway": "/properties/hygge-house",
  "/listings/granary-midway": "/properties/granary",
  "/listings/lowell-302": "/properties/lowell",
  "/listings/powder-room": "/properties/powder-room",
};

for (const [source, destination] of Object.entries(expected)) {
  // Keep the exact shape so Next.js preserves query strings by default.
  assert.deepEqual(
    redirects.filter((redirect) => redirect.source === source),
    [{ source, destination, permanent: true }],
    `${source} must have exactly one permanent redirect with no extra options`,
  );
}
assert.equal(
  redirects.some((redirect) => redirect.source === "/listings/455634"),
  false,
  "Daystar must remain a 404 without a redirect",
);

const notFound = readFileSync(new URL("../src/app/not-found.tsx", import.meta.url), "utf8");
assert.match(notFound, /export const metadata: Metadata\s*=\s*\{/);
assert.match(notFound, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
assert.match(notFound, /alternates:\s*\{\s*canonical:\s*null\s*\}/);
assert.match(notFound, /This page could not be found\./);

console.log("PASS: legacy listing redirects and 404 noindex metadata");
