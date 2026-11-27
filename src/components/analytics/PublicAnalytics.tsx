"use client";

import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  if (typeof window !== "undefined") {
    try { registerAnalyticsSanitizer(window, sanitizeAnalyticsEvent); } catch { /* Best effort. */ }
  }
  useEffect(() => {
    captureLandingAttribution();
  }, [pathname]);

  return <Analytics />;
}
