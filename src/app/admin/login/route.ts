import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, newSession, passwordMatches, sessionCookieName } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") || "");
  if (!adminConfigured() || !passwordMatches(password)) {
    return NextResponse.redirect(new URL("/admin?error=1", req.url), 303);
  }
  const session = newSession();
  const response = NextResponse.redirect(new URL("/admin", req.url), 303);
  response.cookies.set(sessionCookieName(), session.value, { httpOnly: true, secure: true, sameSite: "strict", path: "/admin", maxAge: session.maxAge });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
