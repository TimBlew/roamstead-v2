type AnalyticsValue = string | number | boolean;
type AnalyticsDetails = Record<string, AnalyticsValue>;

/**
 * Sends privacy-safe conversion events to Vercel Web Analytics.
 * Never send email addresses, names, dates of stay, or other guest data.
 * The Vercel insights script provides window.va after loading.
 */
export function trackRoamsteadEvent(name: string, data?: AnalyticsDetails) {
  if (typeof window === "undefined") return;
  const analyticsWindow = window as Window & {
    va?: (method: string, event: { name: string; data?: AnalyticsDetails }) => void;
  };
  if (!analyticsWindow.va) {
    analyticsWindow.va = (...args: [string, { name: string; data?: AnalyticsDetails }]) => {
      const queueWindow = window as Window & { vaq?: unknown[] };
      (queueWindow.vaq ||= []).push(args);
    };
  }
  analyticsWindow.va("event", { name, ...(data ? { data } : {}) });
}
