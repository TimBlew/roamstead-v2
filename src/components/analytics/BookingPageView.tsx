"use client";

import { useEffect } from "react";
import { trackBookingEvent } from "@/lib/analytics";
import { BOOKING_EVENTS } from "@/lib/booking-analytics";

/** One property-identified view per visit to a property or book detail page. */
export function BookingPageView({
  slug,
  listingId,
  pageKind,
}: {
  slug: string;
  listingId?: number;
  pageKind: "property" | "book";
}) {
  useEffect(() => {
    trackBookingEvent(BOOKING_EVENTS.pageView, {
      propertySlug: slug,
      listingId,
      pageKind,
    });
  }, [slug, listingId, pageKind]);

  return null;
}
