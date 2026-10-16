import { NextRequest, NextResponse } from "next/server";
import { adminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  if (!await adminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const field = req.nextUrl.searchParams.get("field") || "";
  const expected = req.nextUrl.searchParams.get("expected") || "";
  if (!expected || expected.length > 500 || !/^(homepage\.(headline\.[01]|description\.[01]|intro\.(title|body)|pillars\.[012]\.(title|body)|featuredHeading|cards\.(hygge-house|granary|lowell|powder-room)\.(name|highlight))|properties\.(intro|listHeading|hero\.(eyebrow|headline|body|accent))|hooks\.(hygge-house|granary|lowell|powder-room)|shared\.(senator\.(eyebrow|headline|body)|community\.(eyebrow|headline|body|perks)))$/.test(field))
    return NextResponse.json({ error: "Invalid publishing check." }, { status: 400 });
  const page = field.startsWith("homepage") ? "/" : field.startsWith("properties") ? "/properties" : "/";
  const host = process.env.ROAMSTEAD_SITE_URL || "https://www.roamstead-co.com";
  try {
    const res = await fetch(new URL(page, host), { cache: "no-store", headers: { "Cache-Control": "no-cache" }, signal: AbortSignal.timeout(7000) });
    if (!res.ok) return NextResponse.json({ status: "pending" }, { headers: { "Cache-Control": "no-store" } });
    const html = await res.text();
    // React SSR escapes quotation marks and ampersands; compare both raw and escaped variants.
    const escaped = expected.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    return NextResponse.json({ status: html.includes(expected) || html.includes(escaped) ? "live" : "pending", page }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "unknown", page }, { headers: { "Cache-Control": "no-store" } });
  }
}
