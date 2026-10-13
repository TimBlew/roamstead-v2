export const siteUrl = new URL(process.env.ROAMSTEAD_SITE_URL || "https://roamstead-v2.vercel.app");
export const launchIndexingEnabled = process.env.ROAMSTEAD_LAUNCH_APPROVED === "true"
  && ["www.roamstead-co.com", "roamstead-co.com"].includes(siteUrl.hostname);
export function canonical(path: string) { return new URL(path, siteUrl).toString(); }
