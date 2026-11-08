"use client";

import { useEffect } from "react";
import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { captureLandingAttribution } from "@/lib/analytics";
import { prepareAnalyticsEvent } from "@/lib/booking-analytics";

/**
 * The owner workspace is a private management surface, not guest traffic.
 * Drop page views and other analytics events generated on /admin routes
 * before they reach Vercel. Public-site event tracking stays enabled.
 * Page-view URLs keep only allowlisted campaign parameters.
 */
const recentPageViews = new Map<string, number>();

export function PublicAnalytics() {
  useEffect(() => {
    captureLandingAttribution();
  }, []);

  return (
    <Analytics
      beforeSend={(event: BeforeSendEvent) => {
        const next = prepareAnalyticsEvent(event, recentPageViews, Date.now());
        if (!next) return null;
        return next;
      }}
    />
  );
}
