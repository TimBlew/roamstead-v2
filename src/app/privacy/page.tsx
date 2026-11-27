import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { TextHero } from "@/components/ui/TextHero";
import { AnalyticsChoice } from "@/components/privacy/AnalyticsChoice";

export const metadata: Metadata = {
  title: "Privacy | Roamstead Collective",
  description: "What Roamstead stores, how booking and early-access information is handled, and your analytics choices.",
  alternates: { canonical: "/privacy" },
};

function PrivacySection({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return <section id={id} className="scroll-mt-20 space-y-4"><h2 className="text-h4 text-brand-text">{title}</h2>{children}</section>;
}

export default function PrivacyPage() {
  return (
    <>
      <TextHero label="Privacy" title="Privacy and your choices" description="Here’s what we save when you visit, where your information goes, and what you can choose." />
      <Container>
        <div className="mx-auto max-w-[860px] space-y-12 pb-16 font-body text-md text-text-secondary md:pb-24">
          <PrivacySection title="Who we are">
            <p>We’re [OWNER TO CONFIRM: legal entity name], and we run roamstead-co.com.</p>
            <p>You can reach us about privacy at [OWNER TO CONFIRM: privacy contact email].</p>
            <p>Effective date: [OWNER TO CONFIRM: effective date]</p>
          </PrivacySection>
          <PrivacySection title="Castlehead, the website operator">
            <p>Castlehead operates roamstead-co.com and provides website services for Roamstead.</p>
            <p>Because of that role, Castlehead can access:</p>
            <ul className="list-disc space-y-4 pl-6">
              <li>Copies of early-access signup notifications. Those copies are sent as a BCC so Castlehead can see new signups and monitor how people find the site.</li>
              <li>Vercel Web Analytics for this site, including the page views and the booking and signup events described on this page.</li>
              <li>The private /admin dashboard, after signing in, which can show early-access contacts and site analytics.</li>
              <li>Vercel request and runtime logs for this site.</li>
              <li>The Roamstead early-access contact list in Resend, which stores email, preferred season and home area.</li>
              <li>A private Google Sheet of early-access signups, which Castlehead owns. An automated service writes new signups to that sheet.</li>
            </ul>
            <p>Castlehead uses this access to run and maintain the website, send signup notifications, and monitor acquisition. How long signup notification copies, Resend contacts and the Google Sheet are kept is listed under “How long information stays” and needs owner confirmation.</p>
          </PrivacySection>
          <PrivacySection title="What we save in your browser">
            <p>We don’t set advertising cookies or cookies that track you across other sites.</p>
            <ul className="list-disc space-y-4 pl-6">
              <li>We save a small note about your first visit. It tells us which link or ad brought you here and which page you arrived on.</li>
              <li>We also keep a note for the tab you’re using. It helps us connect the steps you take toward booking. It goes away when you close the tab.</li>
              <li>If you turn analytics off below, we save that choice in your browser. It stays until you turn analytics back on or clear your browser’s saved information.</li>
              <li>We set a sign-in cookie only when the owner signs in to the private management pages. It isn’t a guest cookie.</li>
            </ul>
          </PrivacySection>
          <PrivacySection title="Analytics">
            <p>We use Vercel Web Analytics to see which pages you visit and how you move through booking. We count property page visits, calendar month checks, the step where you choose nights and guests, taps to continue to checkout, and accepted early-access signups. For calendar checks, we record when a check starts, succeeds, is unavailable or fails. Tapping “Continue to booking” doesn’t mean you’ve booked a stay.</p>
            <p>These records can include which property you viewed, which link brought you here, the site you came from and the page where you arrived. They don’t include your name, email address, phone number or stay dates. The technical details below list the information sent with each kind of record.</p>
          </PrivacySection>
          <PrivacySection title="Booking">
            <p>When you check a calendar and prices, your browser asks our site about that property’s availability for the month. We then ask Hostaway. Those checks use the property and dates, not your guest details. We don’t keep a record of calendar checks ourselves. Our hosting service still keeps site request records, described below. Hostaway’s privacy policy covers its side.</p>
            <p>“Continue to booking” takes you to Hostaway’s Holiday Future checkout at roamstead_ventures.holidayfuture.com. The link includes the property, dates, number of guests and campaign tags from your first visit, when available. You enter your guest and payment details there, and their terms apply. <a href="https://www.hostaway.com/privacy-policy/" className="underline">Read Hostaway’s privacy policy.</a></p>
            <p>The Heber Senator link takes you to hebersenator.com with campaign tags showing where you came from. You book through Cloudbeds at us2.cloudbeds.com. Those sites handle the information you enter there. <a href="https://www.cloudbeds.com/privacy-policy/" className="underline">Read Cloudbeds’ privacy policy.</a></p>
          </PrivacySection>
          <PrivacySection title="Early-access list">
            <p>When you join, we collect your email, preferred season, home area, your agreement to receive emails and campaign tags from your first visit. We use Resend to email the owner about your signup. The site’s developer, Castlehead, gets a copy too. The notification includes your email, preferred season, home area and a short summary of how we think you first found us, when available. Replies to that notification go to your email address.</p>
            <p>Resend also keeps your email, season and home area in a Roamstead contact list. We keep a record in a private Google Sheet, including your signup details and whether the messages were delivered. The full list of details is below. If you turn analytics off or your browser sends a privacy signal, we don’t send information about how you first found us. <a href="https://resend.com/legal/privacy-policy" className="underline">Read Resend’s privacy policy.</a></p>
            <p>To be removed from the early-access list, contact us at [OWNER TO CONFIRM: privacy contact email].</p>
          </PrivacySection>
          <PrivacySection title="Content from other services">
            <p>All the fonts you see come from our own site. Your browser doesn’t contact Google to load them.</p>
            <p>The map only loads if you choose “Show map.” Then your browser connects to Google and <a href="https://policies.google.com/privacy" className="underline">Google’s privacy policy</a> applies.</p>
            <p>Property photos come from our site through Vercel’s image service. Vercel gets some original photos from CloudFront; your browser doesn’t fetch those originals.</p>
            <p>Vercel keeps records of requests to our site and how the site runs. Our own error records don’t include guest emails. <a href="https://vercel.com/legal/privacy-notice" className="underline">Read Vercel’s privacy notice.</a></p>
            <p>The email and phone links in the footer open your own apps. You choose what to send.</p>
          </PrivacySection>
          <PrivacySection title="How long information stays">
            <ul className="list-disc space-y-4 pl-6">
              <li>The note about your first visit has a set lifetime, listed below. The note for your current tab lasts until you close it. The owner’s sign-in cookie also has a set lifetime, listed below.</li>
              <li>Your analytics choice doesn’t expire automatically. Turning analytics back on or clearing your browser’s saved information removes it.</li>
              <li>Vercel guarantees to keep analytics data for the plan’s reporting window: at least 12 months on Pro, the plan required for this site’s custom events. Vercel may keep it longer. <a href="https://vercel.com/docs/analytics/limits-and-pricing" className="underline">See Vercel’s reporting windows.</a></li>
              <li>We don’t save calendar checks ourselves or ask our hosting service to cache the results. <a href="https://www.hostaway.com/privacy-policy/" className="underline">Hostaway’s privacy policy</a> covers information kept on its side.</li>
              <li>Early-access emails in the owner’s inbox and the developer’s copy, Resend contacts and the private Google Sheet: how long these stay needs owner confirmation. [OWNER TO CONFIRM: retention for early-access owner inbox and developer copy] [OWNER TO CONFIRM: retention for Resend contacts] [OWNER TO CONFIRM: retention for the private Google Sheet]</li>
              <li>Vercel keeps runtime records for 1 day on Pro, or up to 30 days with its Observability Plus add-on. <a href="https://vercel.com/docs/logs/runtime" className="underline">See Vercel’s runtime log details.</a></li>
              <li>Other services follow their own rules for keeping information. See the policies for <a href="https://www.hostaway.com/privacy-policy/" className="underline">Hostaway</a>, <a href="https://www.cloudbeds.com/privacy-policy/" className="underline">Cloudbeds</a>, <a href="https://policies.google.com/privacy" className="underline">Google</a>, <a href="https://vercel.com/legal/privacy-notice" className="underline">Vercel</a> and <a href="https://resend.com/legal/privacy-policy" className="underline">Resend</a>. The Heber Senator handles information you enter on its site.</li>
              <li>The footer fonts we host and the property images don’t store guest details. Email and phone links use your own apps. [OWNER TO CONFIRM: retention for messages visitors send]</li>
            </ul>
          </PrivacySection>
          <PrivacySection title="Your choices" id="choices">
            <p>If your browser has Do Not Track or Global Privacy Control turned on, all of this site’s analytics are off. We don’t save or use notes about how you found us or the steps you take toward booking. We don’t send those notes with an early-access signup or add campaign tags to your Holiday Future checkout link.</p>
            <p>You can turn off this site’s analytics in this browser below. This clears the notes about how you found us and stops us adding campaign tags to the Holiday Future checkout link. You can still book. If you turn analytics back on, we can start saving those notes on the next public page you visit, unless your browser’s privacy signal is still on.</p>
            <AnalyticsChoice />
            <p>If you have questions about privacy, you can reach us at [OWNER TO CONFIRM: privacy contact email].</p>
          </PrivacySection>
          <PrivacySection title="Changes">
            <p>[OWNER TO CONFIRM: how changes will be announced]</p>
          </PrivacySection>
          <PrivacySection title="Technical details">
            <ul className="list-disc space-y-4 pl-6 text-sm">
              <li><code>rs_first_touch</code> uses localStorage for first-touch campaign tags (utm_source, utm_medium, utm_campaign, utm_content, utm_term or source), referring site hostname, landing path, capture time and expiry time. It expires after 90 days and is replaced on the next visit after expiry. It contains no names, emails, phones, click IDs or full referrer URLs.</li>
              <li><code>rs_booking_attr</code> uses sessionStorage for this tab’s campaign tags and a random per-tab funnel ID. It lasts until the tab closes. <code>rs_analytics_optout</code> uses localStorage for your analytics choice, with no automatic expiry in code. Opting back in or clearing browser storage removes it. Opting out clears stored and in-memory attribution and blocks analytics in this browser.</li>
              <li><code>roamstead_admin_session</code> is an owner-only cookie set on sign-in, lasting 8 hours. It is httpOnly, secure and SameSite=Strict, with path /admin.</li>
              <li>Vercel Web Analytics page views include the path and allowlisted campaign tags. Other query parameters and fragments are stripped; /admin is dropped. Booking events can include property, listing ID, campaign tags, referrer hostname, landing path and random funnel ID, plus nights and guest count at the guest step. Early-access events carry campaign and first-touch fields without a funnel ID. This site sets no cookies for Vercel Web Analytics. Vercel receives the request’s IP address and user agent, but records analytics data points anonymously, without tying them to an IP address. It identifies visitors with a hash of the incoming request, discarded after 24 hours. <a href="https://vercel.com/docs/analytics/privacy-policy" className="underline">Vercel explains its analytics data handling here.</a> Vercel Speed Insights is not installed.</li>
              <li>Calendar and price checks go through our server to Hostaway using listing IDs and dates. The availability route is dynamic; both upstream requests and the response use no-store, with no saved calendar-check record. The quote route exists but is not called by the site today. The Holiday Future checkout link carries the listing, dates, guest count and first-touch utm_source, utm_medium and utm_campaign when available.</li>
              <li>Our server sends early-access notifications through Resend to the owner inbox, with a BCC to Castlehead and your email as reply-to. Resend stores email, season and home area in a Roamstead contact segment. The notification includes email, preferred season, home area and an inferred first-visit source summary when available. Google Apps Script sends the private Google Sheet an ID, created and updated times, email, season, home area, consent, delivery statuses, a contact ID field and Source with campaign tags. The contact ID field is currently sent empty. With DNT, GPC or opt-out, the form sends no first-visit attribution; the notification uses the default “Direct” summary and the sheet uses the site’s name without campaign tags.</li>
              <li>Bricolage Grotesque and Funnel Sans (weights 400 and 500, display swap), plus the footer credit’s DM Sans and DM Serif Display, are self-hosted through next/font at build time. Google Maps is embedded from google.com/maps only after “Show map” is clicked; the iframe retains lazy loading. Property images use Vercel image optimization; Vercel fetches some originals from CloudFront.</li>
              <li>Retention is not set in code for early-access owner emails and developer copies, Resend contacts or the private Google Sheet. Vercel request/runtime log details include request path, search parameters, user agent, time, status and region. Our error logs do not explicitly log guest email fields. Do Not Track / Global Privacy Control and the opt-out flag block page views, custom events, first-touch and session attribution reads/writes, stored campaign tags on checkout links and first-visit attribution in signup submissions. On a fresh load while blocked, the analytics script is not injected; the shared sanitizer also drops events if analytics is blocked after the script has loaded.</li>
            </ul>
          </PrivacySection>
        </div>
      </Container>
    </>
  );
}
