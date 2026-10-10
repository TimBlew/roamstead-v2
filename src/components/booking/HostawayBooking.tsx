"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    hostawayCalendarWidget?: (config: Record<string, unknown>) => void;
  }
}

const SCRIPT_SRC = "https://d2q3n06xhbi0am.cloudfront.net/calendar.js";
const HOSTAWAY_BASE_URL = "https://roamstead_ventures.holidayfuture.com/";
// Only request the two-month widget when its actual mount has sufficient room.
const TWO_MONTH_MIN_WIDTH = 900;

export function HostawayBooking({ listingId, fallbackUrl }: { listingId: number; fallbackUrl: string }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerId = "hostaway-calendar-widget";
  const [failed, setFailed] = useState(false);
  const [months, setMonths] = useState(1);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

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

  // Hostaway reserves uneven internal space on some layouts. Align the
  // rendered action row with our panel rather than guessing at its DOM widths.
  useEffect(() => {
    if (!loaded || failed) return;
    const mount = wrapperRef.current?.querySelector<HTMLElement>("#hostaway-calendar-widget");
    if (!mount) return;

    let frame = 0;
    const centerControls = () => {
      mount.style.setProperty("--hostaway-offset", "0px");
      const candidates = Array.from(mount.querySelectorAll<HTMLElement>("button, a, [role='button']"));
      const clear = candidates.find((element) => /^clear dates$/i.test(element.textContent?.trim() ?? ""));
      const continueButton = candidates.find((element) => /continue to booking/i.test(element.textContent?.trim() ?? ""));
      if (!clear || !continueButton) return;
      const left = clear.getBoundingClientRect();
      const right = continueButton.getBoundingClientRect();
      const mountRect = mount.getBoundingClientRect();
      if (!left.width || !right.width || !mountRect.width) return;
      const controlsCenter = (Math.min(left.left, right.left) + Math.max(left.right, right.right)) / 2;
      const panelCenter = mountRect.left + mountRect.width / 2;
      const offset = Math.max(-120, Math.min(120, panelCenter - controlsCenter));
      mount.style.setProperty("--hostaway-offset", `${Math.round(offset)}px`);
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(centerControls);
    };
    refresh();
    const observer = new ResizeObserver(refresh);
    observer.observe(mount);
    window.addEventListener("resize", refresh);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", refresh);
      mount.style.removeProperty("--hostaway-offset");
    };
  }, [loaded, failed, months]);

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
    setLoaded(false);
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
    }, 8000);
    const loadedObserver = new MutationObserver(() => {
      if (document.getElementById(containerId)?.children.length) setLoaded(true);
    });
    if (container) loadedObserver.observe(container, { childList: true, subtree: true });

    return () => {
      const mount = document.getElementById(containerId);
      if (mount) mount.innerHTML = "";
      window.clearTimeout(timeout);
      loadedObserver.disconnect();
      script.remove();
    };
  }, [containerId, listingId, months, ready]);

  return (
    <div ref={wrapperRef} className="roamstead-booking-widget mx-auto w-full max-w-[560px]">
      {!loaded && !failed && <div role="status" aria-live="polite" className="flex min-h-[280px] items-center justify-center rounded-[10px] bg-[#F4EFEC]/50 px-4 text-center font-body text-[14px] text-[#6D6057] md:min-h-[340px]">Loading available dates…</div>}
      <div id={containerId} className="mx-auto w-full" />
      {failed ? (
        <div className="py-5 text-center">
          <p className="font-body text-[15px] leading-6 text-[#6D6057]">The live calendar is unavailable right now. You can still check dates securely through our booking partner.</p>
          <a href={fallbackUrl} className="mt-4 inline-flex min-h-11 items-center justify-center bg-[#4A6E57] px-6 font-body text-[14px] font-medium text-white">Check dates with Hostaway</a>
        </div>
      ) : null}
    </div>
  );
}
