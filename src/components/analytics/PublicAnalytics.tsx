"use client";

import { Analytics } from "@vercel/analytics/next";

/**
 * The owner workspace is a private management surface, not guest traffic.
 * Drop page views and other analytics events generated on /admin routes
 * before they reach Vercel. Public-site event tracking stays enabled.
 */
export function PublicAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        try {
          const path = new URL(event.url, window.location.origin).pathname;
          if (path === "/admin" || path.startsWith("/admin/")) return null;
        } catch {
          // Do not send an event with an unparseable URL.
          return null;
        }
        return event;
      }}
    />
  );
}
