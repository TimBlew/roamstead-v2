import { NextResponse, type NextRequest } from "next/server";
import { siteUrl, launchIndexingEnabled } from "@/lib/site";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (!launchIndexingEnabled || request.nextUrl.hostname !== siteUrl.hostname) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.svg).*)"] };
