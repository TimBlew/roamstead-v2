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
      <TextHero label="Privacy" title="Privacy and your choices" description="How information moves through this site, and the choices you can make in this browser." />
      <Container>
        <div className="mx-auto max-w-[860px] space-y-12 pb-16 font-body text-md text-text-secondary md:pb-24">
          <PrivacySection title="Who we are">
            <p>[OWNER TO CONFIRM: legal entity name] operates roamstead-co.com.</p>
            <p>Privacy contact: [OWNER TO CONFIRM: privacy contact email]</p>
            <p>Effective date: [OWNER TO CONFIRM: effective date]</p>
          </PrivacySection>
          <PrivacySection title="What this site stores in your browser">
            <p>There are no advertising or cross-site tracking cookies set by this site.</p>
            <ul className="list-disc space-y-4 pl-6">
              <li><code>rs_first_touch</code> in localStorage remembers the first visit’s campaign tags (utm_source, utm_medium, utm_campaign, utm_content, utm_term or source), referring site hostname, landing path, capture time and expiry time. It helps us see which links bring guests here. It lasts 90 days, then is replaced on the next visit. It contains no names, emails, phones, click IDs or full referrer URLs.</li>
              <li><code>rs_booking_attr</code> in sessionStorage holds campaign tags for this tab and a random per-tab funnel ID. It lasts until the tab closes.</li>
              <li><code>rs_analytics_optout</code> in localStorage saves your analytics choice below. It has no automatic expiry in code; turning analytics back on removes it. Clearing browser storage also removes the choice.</li>
              <li><code>roamstead_admin_session</code> is an owner-only sign-in cookie for /admin, lasting 8 hours. It is httpOnly, secure and SameSite=Strict, scoped to /admin, and is set only when the owner signs in.</li>
            </ul>
          </PrivacySection>
          <PrivacySection title="Analytics">
            <p>We use Vercel Web Analytics for page views and custom events: property page views; calendar month checks that start, succeed, are unavailable or fail; the guest step (nights and guest count); checkout handoffs; and accepted early-access submissions. A checkout tap is an attempt to continue booking, not a confirmed booking.</p>
            <p>Page views include the path and allowlisted campaign tags. Other query parameters and fragments are stripped, and /admin is dropped. Booking event fields can include the property, listing ID, campaign tags, referring hostname, landing path and random funnel ID. Early-access events carry campaign and first-touch fields without a funnel ID. Events do not include guest names, email addresses, phone numbers or stay dates.</p>
            <p>This site sets no cookies for Vercel Web Analytics. Vercel receives the visitor’s IP address and user agent as part of the request. [OWNER TO CONFIRM: IP address and user agent handling against Vercel’s documentation]</p>
            <p>Vercel Speed Insights is not installed.</p>
          </PrivacySection>
          <PrivacySection title="Booking">
            <p>For calendar and price checks, your browser asks our server for a listing’s month availability, and our server asks Hostaway. These checks use listing IDs and dates, not guest details. A quote route exists but is not currently called by the site.</p>
            <p>“Continue to booking” opens roamstead_ventures.holidayfuture.com with the listing, dates, guest count and first-touch utm_source, utm_medium and utm_campaign tags when available. Booking, guest details and payment happen on Hostaway’s Holiday Future checkout, under their terms. [OWNER TO CONFIRM: link to Hostaway/Holiday Future privacy policy]</p>
            <p>The Heber Senator link opens hebersenator.com with referral campaign tags; its booking uses Cloudbeds at us2.cloudbeds.com. Information you enter there is handled by those sites.</p>
          </PrivacySection>
          <PrivacySection title="Early-access list">
            <p>The early-access form collects your email, preferred season, home area, consent and first-touch campaign tags. Our server sends an owner notification via Resend to the owner inbox, with a BCC copy to the site’s developer, Castlehead. Your email is the reply-to address.</p>
            <p>Resend also stores your email, season and home area in a Roamstead contact segment. A private Google Sheet, reached through Google Apps Script, records an ID, time, email, season, home area, consent, delivery statuses, Resend contact ID and Source with campaign tags.</p>
            <p>Unsubscribe anytime. [OWNER TO CONFIRM: how to request removal]</p>
          </PrivacySection>
          <PrivacySection title="Third-party content">
            <p>Google Fonts loads Bricolage Grotesque and Funnel Sans from fonts.googleapis.com and fonts.gstatic.com on every page. Google receives browser requests. [OWNER TO CONFIRM: Google Fonts IP address and user agent handling] The footer credit’s DM Sans and DM Serif Display fonts are self-hosted at build time.</p>
            <p>Property pages embed Google Maps from google.com/maps, loaded lazily when scrolled into view. [OWNER TO CONFIRM: cookies Google may set when a map loads]</p>
            <p>Property images are served from our site through Vercel image optimization. Some originals are fetched by Vercel from CloudFront, rather than by your browser.</p>
            <p>Vercel handles request and runtime logs; application errors are logged without guest emails. [OWNER TO CONFIRM: IP address and user agent in platform request logs]</p>
            <p>Footer email and phone links open your own apps. You choose what to send.</p>
          </PrivacySection>
          <PrivacySection title="Retention">
            <ul className="list-disc space-y-4 pl-6">
              <li>First touch: 90 days, replaced on the next visit after expiry. Tab attribution: until the tab closes. Owner admin cookie: 8 hours.</li>
              <li>Analytics choice: no automatic expiry; removed when you turn analytics back on or clear browser storage.</li>
              <li>Vercel Web Analytics: not set in code — needs owner confirmation. [OWNER TO CONFIRM: retention for Vercel Web Analytics on the owner’s plan]</li>
              <li>Hostaway calendar checks: not set in code — needs owner confirmation. [OWNER TO CONFIRM: retention for Hostaway calendar checks]</li>
              <li>Early-access owner inbox and developer copy, Resend contact list and private Google Sheet: not set in code — needs owner confirmation. [OWNER TO CONFIRM: retention for early-access owner inbox and developer copy] [OWNER TO CONFIRM: retention for Resend contacts] [OWNER TO CONFIRM: retention for the private Google Sheet]</li>
              <li>Vercel server logs: not set in code — needs owner confirmation. [OWNER TO CONFIRM: retention for Vercel request and runtime logs]</li>
              <li>Holiday Future / Hostaway checkout, The Heber Senator, Cloudbeds, Google Fonts and Google Maps follow their providers’ retention practices. [OWNER TO CONFIRM: third-party retention details]</li>
              <li>The self-hosted footer fonts and property images do not store guest details. Email and phone links use your own apps. [OWNER TO CONFIRM: retention for messages visitors send]</li>
            </ul>
          </PrivacySection>
          <PrivacySection title="Your choices" id="choices">
            <p>Do Not Track and Global Privacy Control turn off campaign attribution storage automatically. Those signals do not turn off analytics events; events still send without first-touch fields.</p>
            <p>The control below turns off this site’s analytics in this browser, clears stored and in-memory attribution, and stops campaign tags being added to the Holiday Future checkout link. Booking remains available. Turning analytics back on allows capture on the next public page.</p>
            <AnalyticsChoice />
            <p>For privacy questions, contact [OWNER TO CONFIRM: privacy contact email].</p>
          </PrivacySection>
          <PrivacySection title="Changes">
            <p>[OWNER TO CONFIRM: how changes will be announced]</p>
          </PrivacySection>
        </div>
      </Container>
    </>
  );
}
