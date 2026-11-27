"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { setAnalyticsOptOut } from "@/lib/analytics";
import { hasBrowserPrivacySignal, isAnalyticsOptedOut } from "@/lib/booking-analytics";

export function AnalyticsChoice() {
  const [off, setOff] = useState(false);
  const [ready, setReady] = useState(false);
  const [signal, setSignal] = useState(false);
  useEffect(() => {
    const refresh = () => setOff(isAnalyticsOptedOut());
    refresh();
    setSignal(hasBrowserPrivacySignal());
    setReady(true);
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  return (
    <div className="space-y-4">
      <p role="status">{ready ? (off || signal ? "Analytics off in this browser" : "Analytics on") : "Checking your choice in this browser…"}</p>
      {signal && <p>Analytics are already off because your browser’s privacy signal is on. This stays off even if you turn analytics back on below.</p>}
      <Button type="button" disabled={!ready} onClick={() => setOff(setAnalyticsOptOut(!off))}>
        {off ? "Turn analytics back on" : "Turn off analytics"}
      </Button>
      <p className="text-sm">We need to save a small note in your browser to remember this choice. If your browser blocks saved notes, we can’t remember it.</p>
    </div>
  );
}
