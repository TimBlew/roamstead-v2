export const siteUrl = new URL(process.env.ROAMSTEAD_SITE_URL || "https://roamstead-v2.vercel.app");
export const launchIndexingEnabled = process.env.ROAMSTEAD_LAUNCH_APPROVED === "true"
  && ["www.roamstead-co.com", "roamstead-co.com"].includes(siteUrl.hostname);
export function canonical(path: string) { return new URL(path, siteUrl).toString(); }

/**
 * Optional Google Search Console HTML-tag token.
 * Tim/Ops can set ROAMSTEAD_GOOGLE_SITE_VERIFICATION to the Google-issued
 * content value in the deployment environment. An approved rebuild is required
 * before the tag can appear. A blank value emits nothing. This slot does not
 * verify a property, add a user, or change DNS. Do not commit a token.
 */
export function googleSiteVerification(): string | undefined {
  const token = process.env.ROAMSTEAD_GOOGLE_SITE_VERIFICATION?.trim();
  return token || undefined;
}

export const socialImage = { url: canonical("/opengraph-image"), width: 1200, height: 630, alt: "Roamstead Collective" };
