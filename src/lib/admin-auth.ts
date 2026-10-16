import "server-only";
import { createHmac, timingSafeEqual, scryptSync } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "roamstead_admin_session";
const AGE = 60 * 60 * 8;

function secret() { return process.env.ROAMSTEAD_ADMIN_SECRET || ""; }
export function adminConfigured() {
  return Boolean(process.env.ROAMSTEAD_ADMIN_PASSWORD && secret().length >= 32);
}
export function passwordMatches(value: string) {
  const expected = process.env.ROAMSTEAD_ADMIN_PASSWORD;
  if (!expected || !secret() || value.length > 512) return false;
  return timingSafeEqual(scryptSync(value, secret(), 32), scryptSync(expected, secret(), 32));
}
function sign(data: string) { return createHmac("sha256", secret()).update(data).digest("hex"); }
export function sessionCookieName() { return COOKIE; }
export function newSession() {
  const expires = String(Math.floor(Date.now() / 1000) + AGE);
  return { value: expires + "." + sign(expires), maxAge: AGE };
}
export async function adminAuthenticated() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value || "";
  const [expiry, signature] = value.split(".");
  if (!expiry || !signature || !/^\d+$/.test(expiry) || Number(expiry) <= Date.now() / 1000) return false;
  const expected = sign(expiry);
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
