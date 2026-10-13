import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { siteUrl, launchIndexingEnabled, canonical } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host")?.split(":")[0];
  const canIndex = launchIndexingEnabled && host === siteUrl.hostname;
  return {
    rules: { userAgent: "*", ...(canIndex ? { allow: "/", disallow: ["/api/", "/book/"] } : { disallow: "/" }) },
    ...(canIndex ? { sitemap: canonical("/sitemap.xml") } : {}),
  };
}
