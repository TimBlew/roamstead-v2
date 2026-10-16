import { NextResponse } from "next/server";
import settings from "@/data/early-access-settings.json";

const RECIPIENT = settings.notificationEmail;
const BCC_RECIPIENT = "tim@castlehead.ai";
const ALLOWED_SEASONS = ["", "Winter", "Spring", "Summer", "Fall", "All Four", "All 4"];
const ALLOWED_HOMES = ["", "Heber Valley / Wasatch Back", "Salt Lake or Provo area", "Somewhere else"];

const EMAIL_LOGO_URL = new URL("/api/email-logo", process.env.ROAMSTEAD_SITE_URL || "https://roamstead-v2.vercel.app").toString();

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character] || character);

function signupEmailHtml(email: string, season: string, home: string) {
  const safeEmail = escapeHtml(email);
  const safeSeason = escapeHtml(season || "Not provided");
  const safeHome = escapeHtml(home || "Not provided");
  const row = (label: string, value: string) => `<tr><td style="padding:15px 20px 5px;color:#7A7168;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;font-weight:700;">${label}</td></tr><tr><td style="padding:0 20px 16px;color:#1F3125;font-size:17px;line-height:1.45;">${value}</td></tr>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#F4EFEC;font-family:Arial,Helvetica,sans-serif;color:#1F3125;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F4EFEC;"><tr><td align="center" style="padding:32px 16px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background:#FFFCFB;border:1px solid #E7DFDB;border-radius:12px;"><tr><td style="padding:28px 28px 22px;background:#1F3125;border-radius:11px 11px 0 0;"><img src="${EMAIL_LOGO_URL}" alt="Roamstead Collective" width="190" height="57" style="display:block;width:190px;height:auto;max-width:100%;margin:0 0 18px;border:0;outline:0;text-decoration:none;color:#FFFCFB;font-size:16px;font-weight:700;" /><h1 style="margin:12px 0 0;font-size:26px;line-height:1.2;font-weight:600;color:#FFFCFB;">New early access signup</h1><p style="margin:10px 0 0;font-size:14px;line-height:1.5;color:#E2E9E0;">A guest is interested in staying connected.</p></td></tr><tr><td style="padding:24px 24px 12px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E7DFDB;border-radius:8px;background:#FBF8F7;">${row("Email", `<a href="mailto:${safeEmail}" style="color:#365E47;text-decoration:underline;overflow-wrap:anywhere;">${safeEmail}</a>`)}${row("Preferred season", safeSeason)}${row("Home area", safeHome)}</table><p style="margin:20px 4px 8px;font-size:12px;line-height:1.5;color:#8F7E73;">Early access interest · Roamstead Collective</p></td></tr></table></td></tr></table></body></html>`;
}

export async function POST(request: Request) {
  let payload: { email?: unknown; season?: unknown; home?: unknown; consent?: unknown };
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const season = typeof payload.season === "string" ? payload.season : "";
  const home = typeof payload.home === "string" ? payload.home : "";
  const consent = payload.consent === true;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !ALLOWED_SEASONS.includes(season) || !ALLOWED_HOMES.includes(home) || !consent) {
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
        from: sender, to: [RECIPIENT], bcc: [BCC_RECIPIENT], subject: "Roamstead early access signup",
        text: `New early access signup\n\nEmail: ${email}\nPreferred season: ${season || "Not provided"}\nHome area: ${home || "Not provided"}\n\nRoamstead Collective`,
        html: signupEmailHtml(email, season, home),
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
    let audienceStored = false;
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
            properties: { roamstead_season: season, roamstead_home_area: home },
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
          // Update preferences for an existing contact without changing their
          // global subscription status or resubscribing an opted-out address.
          const updateResponse = await fetch(
            `https://api.resend.com/contacts/${encodeURIComponent(email)}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${contactsKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ properties: { roamstead_season: season, roamstead_home_area: home } }),
            },
          );
          if (!updateResponse.ok) console.error("Roamstead contact preferences update failed", updateResponse.status);
          if (!membershipResponse.ok && membershipResponse.status !== 409) {
            console.error("Roamstead segment membership failed", membershipResponse.status);
          }
          audienceStored = (membershipResponse.ok || membershipResponse.status === 409) && updateResponse.ok;
        } else if (contactResponse.ok) {
          audienceStored = true;
        } else {
          console.error("Roamstead contact storage failed", contactResponse.status);
        }
      } catch (error) {
        console.error("Roamstead contact storage unavailable", error instanceof Error ? error.message : "Unknown error");
      }
    } else {
      console.error("Roamstead signup requires follow-up: contact storage not configured; notification email delivered");
    }
    if (!audienceStored) console.error("Roamstead signup requires follow-up: notification delivered but list storage unconfirmed");
    return NextResponse.json({ ok: true, audienceStored });
  } catch (error) {
    console.error("Early access email request failed", error instanceof Error ? error.message : "Unknown network error");
    return NextResponse.json({ error: "Email service connection failed", code: "network_error" }, { status: 502 });
  }
}
