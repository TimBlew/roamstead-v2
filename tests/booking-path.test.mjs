import assert from "node:assert/strict";
import fs from "node:fs";
import {
  BOOKING_CONTACT_EMAIL,
  BOOKING_CONTACT_PHONE_HREF,
  BOOKING_CONTACT_PHONE_LABEL,
  GUIDE_HANDOFF_NOTE,
  GUIDE_HERO_NOTE,
  bookIntro,
  calendarFailureLead,
  dateStepButtonLabel,
  dateStepNote,
  guideStatusCopy,
  isGuidedBookingPath,
} from "../src/lib/booking-path.ts";

const originalLead = "The live calendar is unavailable right now. Refresh to try again, or";
const originalNote = "Availability is checked live. Confirm dates, pricing and payment securely with our booking partner.";
const originalButton = "Continue to booking →";
const originalBookIntro = "Select check-in and check-out to continue your reservation.";

for (const slug of ["lowell", "powder-room", "senator", ""]) {
  assert.equal(isGuidedBookingPath(slug), false, slug || "empty slug");
}
assert.equal(isGuidedBookingPath("hygge-house"), true);
assert.equal(isGuidedBookingPath("granary"), true);

assert.equal(calendarFailureLead(false, "error"), originalLead);
assert.equal(calendarFailureLead(false, "unavailable"), originalLead);
assert.equal(calendarFailureLead(true, "unavailable"), "The live calendar is unavailable right now. Try again below, or");
assert.equal(calendarFailureLead(true, "error"), "We couldn't check live availability just now. Try again below, or");
assert.equal(calendarFailureLead(true, "unavailable").includes("Refresh"), false);
const footer = fs.readFileSync("src/components/layout/Footer.tsx", "utf8");
assert.equal(footer.includes(`mailto:${BOOKING_CONTACT_EMAIL}`), true);
assert.equal(footer.includes(BOOKING_CONTACT_PHONE_HREF), true);
assert.equal(footer.includes(BOOKING_CONTACT_PHONE_LABEL), true);
assert.equal(dateStepButtonLabel(false), originalButton);
assert.equal(dateStepButtonLabel(true), "Continue to guests");
assert.equal(dateStepNote(false), originalNote);
assert.equal(dateStepNote(true), "Availability is checked live. You will add guests on this page before payment.");
assert.equal(bookIntro(false), originalBookIntro);
assert.equal(guideStatusCopy(0).eyebrow, "Step 1 of 3");
assert.equal(guideStatusCopy(1).eyebrow, "Step 2 of 3");

const rendered = [
  calendarFailureLead(true, "error"),
  calendarFailureLead(true, "unavailable"),
  dateStepButtonLabel(true),
  dateStepNote(true),
  bookIntro(true),
  guideStatusCopy(0).body,
  guideStatusCopy(1).body,
  GUIDE_HANDOFF_NOTE,
  GUIDE_HERO_NOTE,
].join("\n");
assert.equal(rendered.includes("\u2014"), false, "No em dash in guided copy");
assert.equal(rendered.includes("\u2013"), false, "No en dash in guided copy");
assert.equal(/\$\d|discount|save \d|guarantee/i.test(rendered), false, "No invented price or promise");
assert.equal(rendered.includes("Hostaway"), false, "Guest copy does not send people to a Hostaway listing");

const booking = fs.readFileSync("src/components/booking/RoamsteadBooking.tsx", "utf8");
assert.equal(booking.includes("dateStepButtonLabel(guide)"), true);
const unavailableAt = booking.indexOf('if (mode === "unavailable")');
const failureCopyAt = booking.indexOf("calendarFailureLead(guide, failureKind)");
assert.ok(unavailableAt > 0 && failureCopyAt > unavailableAt, "Guided path copy stays on the unavailable screen");
assert.ok(booking.slice(unavailableAt, failureCopyAt).includes("guideStatusCopy(0)"), "Unavailable screen explains the on-site steps");
assert.equal(booking.includes("calendarFailureLead(guide, failureKind)"), true);
assert.equal(booking.includes("GUIDE_HANDOFF_NOTE"), true);
assert.equal(booking.includes("Check dates with Hostaway"), false);
assert.equal(booking.includes('setMode("fallback")'), false);
assert.equal(booking.includes("/listings/"), false);
const unavailableBlock = booking.slice(unavailableAt, booking.indexOf('mode === "checking"', unavailableAt));
assert.equal(unavailableBlock.includes("min-h-[350px]"), false, "Unavailable card is not forced to a tall empty height");
assert.equal(unavailableBlock.includes("h-[44px] min-h-[44px]"), true, "Try again stays at least 44px tall");
assert.equal(unavailableBlock.includes("BOOKING_CONTACT_EMAIL"), true);
assert.equal(unavailableBlock.includes("BOOKING_CONTACT_PHONE_HREF"), true);
assert.equal(booking.includes("MOCK"), false, "No public mock calendar switch");
assert.equal(booking.includes("fixture"), false);
const propertyPage = fs.readFileSync("src/app/properties/[slug]/page.tsx", "utf8");
assert.equal(propertyPage.includes('id="availability" className="scroll-mt-[120px]'), true);

for (const file of ["src/app/properties/[slug]/page.tsx", "src/app/book/[slug]/page.tsx"]) {
  const source = fs.readFileSync(file, "utf8");
  assert.equal(source.includes("isGuidedBookingPath(slug)"), true, file);
  assert.equal(source.includes("guide={guidedBooking}"), true, file);
  assert.equal(source.includes("fallbackUrl"), false, file);
}
assert.equal(fs.readFileSync("src/app/properties/[slug]/page.tsx", "utf8").includes("GUIDE_HERO_NOTE"), true);
assert.equal(fs.readFileSync("src/app/book/[slug]/page.tsx", "utf8").includes("bookIntro(guidedBooking)"), true);

console.log("PASS: Hygge and Granary booking path stays on-site until payment");
