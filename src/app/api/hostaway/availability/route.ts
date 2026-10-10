import { NextRequest, NextResponse } from "next/server";

// Server-only Hostaway integration; refreshed when production credentials are configured.
export const dynamic = "force-dynamic";
const LISTING_IDS = new Set(["455635", "455631", "455634", "455632", "455633"]);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
type HostawayDay = {
  date?: string; isAvailable?: number | boolean; minimumStay?: number | string | null;
  maximumStay?: number | string | null; closedOnArrival?: number | boolean | null;
  closedOnDeparture?: number | boolean | null;
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const listingId = searchParams.get("listingId") ?? "";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  if (!LISTING_IDS.has(listingId) || !datePattern.test(startDate) || !datePattern.test(endDate) ||
    !Number.isFinite(Date.parse(startDate)) || !Number.isFinite(Date.parse(endDate)) ||
    startDate > endDate || Date.parse(endDate) - Date.parse(startDate) > 1000 * 86400 * 75) {
    return NextResponse.json({ error: "Invalid calendar request" }, { status: 400 });
  }
  const accountId = process.env.HOSTAWAY_ACCOUNT_ID;
  const apiKey = process.env.HOSTAWAY_API_KEY;
  if (!accountId || !apiKey) {
    return NextResponse.json({ error: "Hostaway API connection not configured", configured: false }, { status: 503 });
  }
  try {
    const tokenResponse = await fetch("https://api.hostaway.com/v1/accessTokens", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "client_credentials", client_id: accountId, client_secret: apiKey, scope: "general" }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!tokenResponse.ok) throw new Error("Hostaway authentication error");
    const tokenPayload = await tokenResponse.json() as { access_token?: string };
    if (!tokenPayload.access_token) throw new Error("Missing Hostaway token");
    const params = new URLSearchParams({ startDate, endDate });
    const response = await fetch(`https://api.hostaway.com/v1/listings/${listingId}/calendar?${params}`, {
      headers: { Authorization: `Bearer ${tokenPayload.access_token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(9000),
    });
    if (!response.ok) throw new Error("Hostaway calendar not available");
    const payload = await response.json() as { result?: HostawayDay[] };
    if (!Array.isArray(payload.result)) throw new Error("Invalid Hostaway calendar response");
    const days = payload.result.filter((item) => item.date && datePattern.test(item.date)).map((item) => ({
      date: item.date!,
      available: item.isAvailable === 1 || item.isAvailable === true,
      minimumStay: Math.max(1, Number(item.minimumStay) || 1),
      maximumStay: Math.max(1, Number(item.maximumStay) || 365),
      arrivalAllowed: item.closedOnArrival !== 1 && item.closedOnArrival !== true,
      departureAllowed: item.closedOnDeparture !== 1 && item.closedOnDeparture !== true,
    }));
    return NextResponse.json({ days }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Hostaway availability request failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Live availability temporarily unavailable" }, { status: 502 });
  }
}
