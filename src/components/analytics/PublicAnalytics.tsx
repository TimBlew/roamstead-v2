"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { captureLandingAttribution } from "@/lib/analytics";
import { registerAnalyticsSanitizer, sanitizeAnalyticsEvent } from "@/lib/booking-analytics";

/**
 * The owner workspace is a private management surface, not guest traffic.
 * The sanitizer is registered on the analytics queue before custom events.
 * `<Analytics>` does not receive a second beforeSend, because inject() would
 * append that registration after any events already queued.
 */
export function PublicAnalytics() {
  if (typeof window !== "undefined") {
    registerAnalyticsSanitizer(window, sanitizeAnalyticsEvent);
  }
  useEffect(() => {
    captureLandingAttribution();
  }, []);

  return <Analytics />;
}
