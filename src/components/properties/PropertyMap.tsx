"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function PropertyMap({ mapQuery }: { mapQuery: string }) {
  const [showMap, setShowMap] = useState(false);
  if (showMap) {
    return (
      <iframe
        title={`Map of ${mapQuery}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
        className="h-[300px] w-full rounded-[18px] border-0 md:h-[420px] md:rounded-[20px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }
  return (
    <div className="flex h-[300px] w-full flex-col items-center justify-center gap-4 rounded-[18px] bg-bg-surface p-6 text-center md:h-[420px] md:rounded-[20px]">
      <p className="font-body text-lg text-brand-text">Map of {mapQuery}</p>
      <Button type="button" onClick={() => setShowMap(true)}>Show map</Button>
      <p className="font-body text-sm text-text-secondary">Showing the map loads it from Google.</p>
    </div>
  );
}
