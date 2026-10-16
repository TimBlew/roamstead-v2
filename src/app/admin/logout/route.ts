import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/admin-auth";
export async function POST(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin", req.url), 303);
  response.cookies.set(sessionCookieName(), "", { path: "/admin", maxAge: 0, httpOnly: true, sameSite: "strict", secure: true });
  return response;
}
