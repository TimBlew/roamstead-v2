import "server-only";

export type ReservationSummary = { available: false } | {
  available: true; count: number; revenue: Record<string, number>; byListing: Record<string, number>;
};

export function aggregateReservations(rows: Record<string, unknown>[], since: string, until: string): ReservationSummary {
  const start = Date.parse(since), end = Date.parse(until);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return { available: false };
  const revenue: Record<string, number> = {}, byListing: Record<string, number> = {};
  let count = 0;
  for (const row of rows) {
    if (Number(row.channelId) !== 2013) continue;
    const status = typeof row.status === "string" ? row.status.toLowerCase().trim() : "";
    if (!status || /^(cancelled|canceled|declined|expired|inquiry)/.test(status)) continue;
    // Hostaway timestamps without an offset are treated as UTC, consistently across servers.
    const raw = typeof row.reservationDate === "string" ? row.reservationDate : "";
    const date = Date.parse(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(raw) ? raw.replace(" ", "T") + "Z" : raw);
    if (!Number.isFinite(date)) return { available: false };
    if (date < start || date >= end) continue;
    const amount = Number(row.totalPrice), currency = row.currency;
    const listing = String(row.listingMapId);
    if (!Number.isFinite(amount) || row.totalPrice == null || typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency) || !/^\d+$/.test(listing)) return { available: false };
    count++;
    revenue[currency] = (revenue[currency] || 0) + amount;
    byListing[listing] = (byListing[listing] || 0) + 1;
  }
  for (const currency of Object.keys(revenue)) revenue[currency] = Math.round(revenue[currency] * 100) / 100;
  return { available: true, count, revenue, byListing };
}

/** Read-only, bounded scan; unknown date-filter support means we filter reservationDate locally.
 * Reaching the cap returns unavailable, never an apparently complete partial count.
 */
export async function websiteReservations(since: string, until: string, options: {
  accountId?: string; apiKey?: string; fetcher?: typeof fetch;
} = {}): Promise<ReservationSummary> {
  const accountId = options.accountId ?? process.env.HOSTAWAY_ACCOUNT_ID;
  const apiKey = options.apiKey ?? process.env.HOSTAWAY_API_KEY;
  if (!accountId || !apiKey) return { available: false };
  const fetcher = options.fetcher ?? fetch;
  try {
    const auth = await fetcher("https://api.hostaway.com/v1/accessTokens", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "client_credentials", client_id: accountId, client_secret: apiKey, scope: "general" }),
      cache: "no-store", signal: AbortSignal.timeout(8000),
    });
    if (!auth.ok) return { available: false };
    const token = await auth.json();
    if (typeof token.access_token !== "string" || !token.access_token) return { available: false };
    const rows: Record<string, unknown>[] = [];
    for (let page = 0; page < 5; page++) {
      const params = new URLSearchParams({ channelId: "2013", limit: "100", offset: String(page * 100) });
      const response = await fetcher(`https://api.hostaway.com/v1/reservations?${params}`, {
        headers: { Authorization: `Bearer ${token.access_token}` }, cache: "no-store", signal: AbortSignal.timeout(9000),
      });
      if (!response.ok) return { available: false };
      const payload = await response.json();
      if (!Array.isArray(payload.result) || payload.result.some((row: unknown) => !row || typeof row !== "object" || Array.isArray(row))) return { available: false };
      rows.push(...payload.result);
      if (payload.result.length < 100) return aggregateReservations(rows, since, until);
    }
    return { available: false };
  } catch { return { available: false }; }
}
