"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { captureLandingAttribution } from "@/lib/analytics";
import { isAnalyticsBlocked, registerAnalyticsSanitizer, sanitizeAnalyticsEvent } from "@/lib/booking-analytics";

/**
 * The owner workspace is a private management surface, not guest traffic.
 * The sanitizer is registered on the analytics queue before custom events.
 * `<Analytics>` does not receive a second beforeSend, because inject() would
 * append that registration after any events already queued.
 */
export function PublicAnalytics() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  if (typeof window !== "undefined" && !isAnalyticsBlocked()) {
    try { registerAnalyticsSanitizer(window, sanitizeAnalyticsEvent); } catch { /* Best effort. */ }
  }
  useEffect(() => {
    setEnabled(!isAnalyticsBlocked());
    captureLandingAttribution();
  }, [pathname]);

  // Wait for the client privacy check before injecting the analytics script.
  return enabled && !isAnalyticsBlocked() ? <Analytics /> : null;
}
