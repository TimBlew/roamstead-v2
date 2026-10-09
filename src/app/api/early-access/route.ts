import { NextResponse } from "next/server";

const RECIPIENT = process.env.EARLY_ACCESS_RECIPIENT || "chris@roamstead-co.com";
const ALLOWED_SEASONS = ["", "Winter", "Summer", "Fall", "All 4"];
const ALLOWED_HOMES = ["", "Heber Valley / Wasatch Back", "Salt Lake or Provo area", "Somewhere else"];

export async function POST(request: Request) {
  let payload: { email?: unknown; season?: unknown; home?: unknown };
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const season = typeof payload.season === "string" ? payload.season : "";
  const home = typeof payload.home === "string" ? payload.home : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !ALLOWED_SEASONS.includes(season) || !ALLOWED_HOMES.includes(home)) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.EARLY_ACCESS_FROM;
  if (!apiKey || !sender) {
    console.error("Early access email delivery is not configured");
    return NextResponse.json({ error: "Email delivery unavailable" }, { status: 503 });
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: sender, to: [RECIPIENT], subject: "Roamstead early access signup",
        text: `Email: ${email}\nSeason: ${season || "Not provided"}\nHome: ${home || "Not provided"}`,
        reply_to: email,
      }),
    });
    if (!response.ok) {
      console.error("Early access email delivery failed", response.status);
      return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }
}
