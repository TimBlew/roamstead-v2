import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const LISTINGS = new Set([455635, 455631, 455632, 455633]);
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request: NextRequest) {
  let body: { listingId?: number; checkIn?: string; checkOut?: string; adults?: number; children?: number };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const { listingId, checkIn, checkOut, adults, children } = body;
  const guests = (adults ?? 0) + (children ?? 0);
  const nights = checkIn && checkOut ? (Date.parse(checkOut) - Date.parse(checkIn)) / 86400000 : 0;
  if (!listingId || !LISTINGS.has(listingId) || !checkIn || !checkOut || !DATE.test(checkIn) || !DATE.test(checkOut) || !Number.isInteger(nights) || nights < 1 || nights > 90 || checkIn < new Date().toISOString().slice(0,10) || !Number.isInteger(adults) || !Number.isInteger(children) || (adults ?? 0) < 1 || (children ?? 0) < 0 || guests > 20) {
    return NextResponse.json({ error: "Please check your dates and guests" }, { status: 400 });
  }
  if (!process.env.HOSTAWAY_ACCOUNT_ID || !process.env.HOSTAWAY_API_KEY) return NextResponse.json({ error: "Pricing is temporarily unavailable" }, { status: 503 });
  try {
    const auth = await fetch("https://api.hostaway.com/v1/accessTokens", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "client_credentials", client_id: process.env.HOSTAWAY_ACCOUNT_ID, client_secret: process.env.HOSTAWAY_API_KEY, scope: "general" }), cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!auth.ok) throw new Error("Authentication unavailable");
    const token = (await auth.json() as { access_token?: string }).access_token;
    if (!token) throw new Error("Authentication unavailable");
    const response = await fetch(`https://api.hostaway.com/v1/listings/${listingId}/calendar/priceDetails`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ startingDate: checkIn, endingDate: checkOut, numberOfGuests: guests, version: 2 }), cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Price quote unavailable");
    const payload = await response.json() as { status?: string; result?: { totalPrice?: number; components?: Array<{ name?: string; title?: string; total?: number; isIncludedInTotalPrice?: number }> } };
    const quote = payload.result;
    if (payload.status !== "success" || !quote || typeof quote.totalPrice !== "number" || !Number.isFinite(quote.totalPrice) || quote.totalPrice < 0) throw new Error("Invalid price quote");
    return NextResponse.json({ totalPrice: quote.totalPrice, currency: "USD", components: (quote.components ?? []).filter(c => c.isIncludedInTotalPrice === 1 && typeof c.total === "number").map(c => ({ label: c.title || c.name || "Charge", amount: c.total })) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Hostaway quote failed:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Live pricing is temporarily unavailable. Please try again." }, { status: 502 });
  }
}
