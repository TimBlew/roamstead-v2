"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { setAnalyticsOptOut } from "@/lib/analytics";
import { isAnalyticsOptedOut } from "@/lib/booking-analytics";

export function AnalyticsChoice() {
  const [off, setOff] = useState(false);
  const [ready, setReady] = useState(false);
  const [signal, setSignal] = useState(false);
  useEffect(() => {
    const refresh = () => setOff(isAnalyticsOptedOut());
    refresh();
    setSignal((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true
      || navigator.doNotTrack === "1"
      || (window as Window & { doNotTrack?: string }).doNotTrack === "1");
    setReady(true);
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  return (
    <div className="space-y-4">
      <p role="status">{ready ? (off ? "Analytics off in this browser" : "Analytics on") : "Checking this browser’s analytics choice…"}</p>
      {signal && <p>Your browser&apos;s privacy signal is on, so campaign attribution is already off.</p>}
      <Button type="button" disabled={!ready} onClick={() => setOff(setAnalyticsOptOut(!off))}>
        {off ? "Turn analytics back on" : "Turn off analytics"}
      </Button>
      <p className="text-sm">This choice needs local storage. If your browser blocks it, the choice cannot be saved.</p>
    </div>
  );
}
