import { NextResponse, type NextRequest } from "next/server";
import { siteUrl, launchIndexingEnabled } from "@/lib/site";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/admin") || !launchIndexingEnabled || request.nextUrl.hostname !== siteUrl.hostname) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  if (request.nextUrl.pathname.startsWith("/admin")) response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.svg).*)"] };
