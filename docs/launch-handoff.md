# Roamstead launch and operating handoff

Updated October 13, 2026. Status: client review, not approved for public-domain cutover.

The detailed verified QA report and requirements matrix are in the Roamstead Drive handoff:
https://docs.google.com/document/d/1aGYZpYcrWBLMMKWGlCRwMnQoOl5wMWMa9lvOwkPVYpE

## Release gates

- Verify tablet, 390px and 375px with real browser viewports. This QA environment exposed desktop only.
- Complete a non-paid Hostaway checkout test for all four integrated properties. Confirm listing, dates, total guests, taxes, cleaning and guest-channel fees, final total and one personal-information form. Cloud Browser currently encounters a certificate hostname mismatch at the configured Hostaway domain.
- Resolve Daystar: it remains visible on /book, live at 455634, with a four-person selector despite listing capacity twelve. Do not change capacity, inventory, rates or reservation rules without approval. Recommended interim treatment: remove it from booking discovery and retain an approved independent destination only after Chris confirms it.
- Verify one controlled Collective capture in the Resend Roamstead segment and notification receipt. EARLY_ACCESS_RECIPIENT is unset, so notifications default to tim@castlehead.ai. Confirm notification owner and analytics destination.
- Obtain Tim/Chris's production cutover approval and an external DNS-zone export.

## Booking and contact ownership

Hostaway owns availability, arrival/departure restrictions, minimum/maximum stays, final pricing and reservations for Hygge House 455635 (10), Granary 455631 (4), The Lowell 455632 (8) and Powder Room 455633 (4). Roamstead collects dates and adult/child counts only. The checkout query carries their combined total. Do not restore the removed on-site quote estimate.

The Senator uses its own website and Cloudbeds destination. Do not change its booking configuration here.

Collective submissions first request an internal notification, then contact/segment storage through separate Resend credentials. The UI confirms list membership only after the API reports successful contact storage; notification-only outcomes acknowledge receipt. Provider acceptance does not prove inbox delivery. Existing unsubscribe status is preserved.

## Environment names

Keep credentials only in Vercel:
HOSTAWAY_ACCOUNT_ID, HOSTAWAY_API_KEY, RESEND_API_KEY, EARLY_ACCESS_FROM, RESEND_CONTACTS_API_KEY, RESEND_ROAMSTEAD_SEGMENT_ID.
EARLY_ACCESS_RECIPIENT is an optional explicit notification destination.

ROAMSTEAD_SITE_URL defaults to https://roamstead-v2.vercel.app.
ROAMSTEAD_LAUNCH_APPROVED is unset and indexing stays off.
Only after approved cutover: set ROAMSTEAD_SITE_URL=https://www.roamstead-co.com and ROAMSTEAD_LAUNCH_APPROVED=true, then deploy and verify. The launch flag enables indexing only for the approved apex/www hostnames. Preview aliases keep an X-Robots-Tag noindex header. Verify response headers and robots/sitemap after changing configuration.

## Cutover checklist

1. Record main SHA, READY deployment, environment names, existing apex-to-www redirect and both projects' domain assignments.
2. Export the complete Squarespace/external DNS zone, including A/AAAA/CNAME, MX, TXT, SPF, DKIM, DMARC, verification records and SendGrid records. Current values beyond web routing were not independently verified.
3. Keep the current Roamstead-booking project and its deployment available. Its verified deployed source is 5c3df98d86deb6bafe3eef33591fdfbb98e599e8.
4. Complete release gates. Set the approved canonical origin and indexing flag. Deploy and check the precise main SHA is READY.
5. With explicit approval, move www.roamstead-co.com and the apex from the old project to roamstead-v2, preserving the apex-to-www redirect. The public domain already points into Vercel; DNS changes may be unnecessary. Follow the new project's current domain recommendations, not stale planning IP values.
6. Never remove or rewrite mail/verification records. Do not change nameservers, Hostaway configuration, SendGrid or the Senator.
7. Verify TLS, home, Properties, four details, four booking pages, redirects, local gallery assets, signup capture/receipt, analytics, canonical URLs, robots, sitemap and preview noindex.
8. Repeat a non-paid checkout transfer with one availability fixture per property. Observe errors and conversion events for the first 24 hours.
9. Record actual launch time, SHA, approval and test evidence in Current State and Decision Log. Do not mark unchecked items complete.

## Rollback

Before moving domains, save the original domain assignments and DNS zone. Old project: Roamstead-booking, prj_hDK602GYpvdnjNRHynOUJbc2UHhU. Verified old deployment: dpl_4tHFXxV5UsXFM6ZnRJ5YzpB9yj8a, source 5c3df98d86deb6bafe3eef33591fdfbb98e599e8.

If checkout, forms, TLS or major navigation fails after cutover, return both public domains to the old project and preserve the apex-to-www redirect. Restore only web DNS records actually changed, using the saved values. Verify the restored public site and independent booking destinations. Set the new project's launch flag off and redeploy if necessary. Keep mail records and booking systems unchanged. Reverting a new-app commit alone does not restore the old domain assignment.

For a regression on the preview, revert the specific offending commit on main, deploy, confirm READY and retest. Preserve subsequent unrelated work; do not force reset the branch.

## Routine operation

- Availability and rates: Hostaway, never the website source.
- Website facts/photos: src/data/properties.ts and src/components/sections/PropertyGallery.tsx; use verified originals only.
- Branding/copy: follow the six numbered Drive source documents and latest Decision Log. Headings Bricolage Grotesque, body Funnel Sans, warm neutrals/green, primary button corners 8px. No em dashes in rendered copy.
- Content deployment: descriptive commit on main, wait for READY, refresh live preview and test affected interactions.
- Signup health: check contact/segment membership and notification delivery; never treat a success modal alone as proof.
- Quality checks: node tests/early-access.test.cjs; node tests/booking-availability.test.cjs; npm ci && npm run build in a normal authenticated checkout. The local tests mock network calls and send no messages.
- Mobile and external checkout checks remain required before launch. Performance scores, full DNS/mail dependencies and delivery were not certified by this QA run.

## Deferred work

About is currently an approved redirect to home. Stay Longer and Groups/Retreats are deferred, not implemented. Collective is an embedded early-access signup, not a live membership product. Seasonal themes, approved property-specific reviews, occupancy/ADR insights, full-resolution gallery photography and broader Daystar integration remain phase-two work unless Chris explicitly changes scope.
