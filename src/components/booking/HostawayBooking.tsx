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

export function HostawayBooking({ listingId, fallbackUrl }: { listingId: number; fallbackUrl: string }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerId = "hostaway-calendar-widget";
  const [failed, setFailed] = useState(false);
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
    setFailed(false);
    script.src = `${SCRIPT_SRC}?v=${listingId}-${months}-${Date.now()}`;
    script.async = true;

    script.onerror = () => setFailed(true);
    script.onload = () => {
      if (!window.hostawayCalendarWidget) {
        setFailed(true);
        return;
      }
      window.hostawayCalendarWidget?.({
        baseUrl: HOSTAWAY_BASE_URL,
        listingId,
        numberOfMonths: months,
        openInNewTab: false,
        rounded: true,
        button: { action: "checkout", text: "Continue to booking" },
        clearButtonText: "Clear dates",
      });
    };

    document.body.appendChild(script);
    const timeout = window.setTimeout(() => {
      if (!document.getElementById(containerId)?.children.length) setFailed(true);
    }, 4500);

    return () => {
      const mount = document.getElementById(containerId);
      if (mount) mount.innerHTML = "";
      window.clearTimeout(timeout);
      script.remove();
    };
  }, [containerId, listingId, months, ready]);

  return (
    <div ref={wrapperRef} className="w-full">
      <div id={containerId} />
      {failed ? (
        <div className="py-5 text-center">
          <p className="font-body text-[15px] leading-6 text-[#6D6057]">The live calendar is unavailable right now. You can still check dates securely through our booking partner.</p>
          <a href={fallbackUrl} className="mt-4 inline-flex min-h-11 items-center justify-center bg-[#4A6E57] px-6 font-body text-[14px] font-medium text-white">Check dates with Hostaway</a>
        </div>
      ) : null}
    </div>
  );
}
