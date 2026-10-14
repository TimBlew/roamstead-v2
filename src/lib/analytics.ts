import { track } from "@vercel/analytics";

type AnalyticsValue = string | number | boolean;
type AnalyticsDetails = Record<string, AnalyticsValue>;

/** Record conversion milestones only, without guest personal information. */
export function trackRoamsteadEvent(name: string, data?: AnalyticsDetails) {
  if (typeof window === "undefined") return;
  track(name, data);
}
