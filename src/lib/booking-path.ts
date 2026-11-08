/** Hygge House and Granary are the direct-booking path we are making easier to follow. */
export function isGuidedBookingPath(slug: string): boolean {
  return slug === "hygge-house" || slug === "granary";
}

/** Same destinations already shown in the site footer. */
export const BOOKING_CONTACT_EMAIL = "chris@roamstead-co.com";
export const BOOKING_CONTACT_PHONE_HREF = "tel:+14352435670";
export const BOOKING_CONTACT_PHONE_LABEL = "(435) 243-5670";

export function calendarFailureLead(guide: boolean, failureKind: "unavailable" | "error"): string {
  if (!guide) return "The live calendar is unavailable right now. Refresh to try again, or";
  if (failureKind === "error") return "We couldn't check live availability just now. Try again below, or";
  return "The live calendar is unavailable right now. Try again below, or";
}

export function dateStepButtonLabel(guide: boolean): string {
  return guide ? "Continue to guests" : "Continue to booking →";
}

export function dateStepNote(guide: boolean): string {
  return guide
    ? "Availability is checked live. You will add guests on this page before payment."
    : "Availability is checked live. Confirm dates, pricing and payment securely with our booking partner.";
}

export function guideStatusCopy(step: number): { eyebrow: string; body: string } {
  if (step > 0) {
    return {
      eyebrow: "Step 2 of 3",
      body: "Add guests here. The next step opens our booking partner so you can pay.",
    };
  }
  return {
    eyebrow: "Step 1 of 3",
    body: "Choose dates, then guests, on this page. Payment opens with our booking partner.",
  };
}

export const GUIDE_HANDOFF_NOTE = "You will pay on our booking partner's site.";
export const GUIDE_HERO_NOTE = "Dates and guests stay on this page. You only leave to pay.";

export function bookIntro(guide: boolean): string {
  return guide
    ? "Select dates and guests here. You will pay and complete the reservation with our booking partner."
    : "Select check-in and check-out to continue your reservation.";
}
