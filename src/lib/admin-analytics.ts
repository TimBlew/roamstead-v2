export const ADMIN_TRAFFIC_FILTER = "requestPath ne '/admin' and not startswith(requestPath,'/admin/')";

export function analyticsQueryParams(resource: string, params: Record<string, string | string[]>) {
  const result = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    for (const entry of Array.isArray(value) ? value : [value]) result.append(key, entry);
  }
  if (resource === "/visits/aggregate" || resource === "/events/aggregate") {
    // Exact source + explicitly named PR live-check campaign observed together in production.
    // Unknown sources stay included. Raw historical records are never deleted.
    const firstTouchQA = resource === "/events/aggregate" ? "not (eventData/utm_source eq 'qa_attrib' and eventData/utm_campaign eq 'pr20_live_check')" : null;
    const filters = [ADMIN_TRAFFIC_FILTER, "environment eq 'production'", firstTouchQA, result.get("filter")].filter(Boolean);
    result.set("filter", filters.map(filter => `(${filter})`).join(" and "));
  }
  return result;
}

export const SEARCH_CONSOLE_DIAGNOSTIC = /^(federation_exchange|service_account_impersonation|search_console)_[0-9]{3}(?:_[A-Za-z0-9_]{1,80})?$/;

export type AnalyticsMetric = { timestamp?: string; visitors?: number; pageviews?: number; count?: number; total?: number; eventName?: string; requestPath?: string; referrerHostname?: string; deviceType?: string };
export type AnalyticsBreakdowns = {
  events?: AnalyticsMetric[] | null; eventsAvailable?: boolean;
  pages?: AnalyticsMetric[] | null; pagesAvailable?: boolean;
  referrers?: AnalyticsMetric[] | null; referrersAvailable?: boolean;
  devices?: AnalyticsMetric[] | null; devicesAvailable?: boolean;
};
const actionNames: Record<string, string> = {
  availability_dates_selected: "Dates selected (earlier event)",
  booking_page_view: "Property page view",
  booking_date_check_attempt: "Date check started",
  booking_date_check_success: "Date check loaded",
  booking_date_check_unavailable: "Date check unavailable",
  booking_date_check_error: "Date check error",
  booking_guest_step: "Guest step",
  hostaway_checkout_click: "Checkout handoff",
  early_access_submission_accepted: "Signup submissions"
};
export const metricValue = (row: AnalyticsMetric) => Number(row.pageviews ?? row.count ?? row.total ?? row.visitors ?? 0);

export function deriveAdminAnalytics(data: AnalyticsBreakdowns | null, visitors: number) {
  const eventsAvailable = data?.eventsAvailable !== false && Array.isArray(data?.events);
  const events = eventsAvailable ? data!.events! : null;
  const clicks = events === null ? null : events.filter(row => row.eventName === "hostaway_checkout_click").reduce((sum, row) => sum + metricValue(row), 0);
  return {
    eventsAvailable,
    clicks,
    rate: clicks !== null && visitors > 0 ? ((clicks / visitors) * 100).toFixed(1) + "%" : "—",
    exploredRows: events?.map(row => ({ label: actionNames[row.eventName || ""] || row.eventName || "Other action", value: metricValue(row) })) ?? null,
    pagesAvailable: data?.pagesAvailable !== false && Array.isArray(data?.pages),
    referrersAvailable: data?.referrersAvailable !== false && Array.isArray(data?.referrers),
    devicesAvailable: data?.devicesAvailable !== false && Array.isArray(data?.devices),
  };
}

export type AcquisitionMetric = AnalyticsMetric & { "eventData/utm_source"?: string; "eventData/utm_campaign"?: string };
export function deriveAcquisition(rows: AcquisitionMetric[] | null | undefined, dimension: "utm_source" | "utm_campaign" = "utm_source") {
  if (!Array.isArray(rows)) return null;
  const result = new Map<string, { label: string; views: number; guests: number; handoffs: number; signups: number }>();
  const columns = { booking_page_view: "views", booking_guest_step: "guests", hostaway_checkout_click: "handoffs", early_access_submission_accepted: "signups" } as const;
  for (const row of rows) {
    const column = columns[row.eventName as keyof typeof columns];
    if (!column) continue;
    const label = row[`eventData/${dimension}`] || "Direct / unknown";
    const entry = result.get(label) || { label, views: 0, guests: 0, handoffs: 0, signups: 0 };
    entry[column] += metricValue(row);
    result.set(label, entry);
  }
  return [...result.values()].sort((a, b) => b.handoffs - a.handoffs || b.views - a.views || a.label.localeCompare(b.label));
}
