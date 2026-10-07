"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    hostawayCalendarWidget?: (config: Record<string, unknown>) => void;
  }
}

const SCRIPT_SRC = "https://d2q3n06xhbi0am.cloudfront.net/calendar.js";
const HOSTAWAY_BASE_URL = "https://roamstead_ventures.holidayfuture.com/";
const TWO_MONTH_MIN_WIDTH = 760;

export function HostawayBooking({ listingId }: { listingId: number }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerId = `hostaway-calendar-${listingId}`;
  const [months, setMonths] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const update = () => {
      setMonths(el.getBoundingClientRect().width >= TWO_MONTH_MIN_WIDTH ? 2 : 1);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    const timer = window.setTimeout(() => setReady(true), 120);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const container = document.getElementById(containerId);
    if (container) container.innerHTML = "";

    document.querySelectorAll(`script[src^="${SCRIPT_SRC}"]`).forEach((script) => script.remove());

    try {
      delete window.hostawayCalendarWidget;
    } catch {
      window.hostawayCalendarWidget = undefined;
    }

    const script = document.createElement("script");
    script.src = `${SCRIPT_SRC}?v=${listingId}-${months}-${Date.now()}`;
    script.async = true;

    script.onload = () => {
      window.hostawayCalendarWidget?.({
        baseUrl: HOSTAWAY_BASE_URL,
        listingId,
        numberOfMonths: months,
        openInNewTab: true,
        rounded: true,
        button: { action: "checkout", text: "Continue to booking" },
        clearButtonText: "Clear dates",
      });
    };

    document.body.appendChild(script);

    return () => {
      const mount = document.getElementById(containerId);
      if (mount) mount.innerHTML = "";
      script.remove();
    };
  }, [containerId, listingId, months, ready]);

  return (
    <div ref={wrapperRef} className="w-full">
      <div id={containerId} />
    </div>
  );
}
