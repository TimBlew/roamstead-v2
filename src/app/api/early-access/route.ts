import { NextResponse } from "next/server";

const RECIPIENT = process.env.EARLY_ACCESS_RECIPIENT || "tim@castlehead.ai";
const ALLOWED_SEASONS = ["", "Winter", "Spring", "Summer", "Fall", "All Four", "All 4"];
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
      const detail = await response.json().catch(() => ({})) as { name?: string; message?: string; statusCode?: number };
      console.error("Early access Resend rejection", { status: response.status, code: detail.name || "unknown", message: detail.message || "No detail" });
      return NextResponse.json({ error: "Email provider rejected the request", code: detail.name || "provider_error" }, { status: 502 });
    }
    // Contact storage is activated only after a dedicated Resend contact-management
    // key and Roamstead segment have been configured. Keep send-only credentials separate.
    const contactsKey = process.env.RESEND_CONTACTS_API_KEY;
    const segmentId = process.env.RESEND_ROAMSTEAD_SEGMENT_ID;
    if (contactsKey && segmentId) {
      try {
        const contactResponse = await fetch("https://api.resend.com/contacts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${contactsKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            unsubscribed: false,
            segments: [{ id: segmentId }],
          }),
        });
        if (contactResponse.status === 409) {
          // Existing contacts are global in Resend; add them to this specific segment.
          const membershipResponse = await fetch(
            `https://api.resend.com/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${contactsKey}` },
            },
          );
          if (!membershipResponse.ok && membershipResponse.status !== 409) {
            console.error("Roamstead segment membership failed", membershipResponse.status);
          }
        } else if (!contactResponse.ok) {
          console.error("Roamstead contact storage failed", contactResponse.status);
        }
      } catch (error) {
        console.error("Roamstead contact storage unavailable", error instanceof Error ? error.message : "Unknown error");
      }
    } else {
      console.info("Roamstead contact storage not activated: contact key or segment missing");
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Early access email request failed", error instanceof Error ? error.message : "Unknown network error");
    return NextResponse.json({ error: "Email service connection failed", code: "network_error" }, { status: 502 });
  }
}
