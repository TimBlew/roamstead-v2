# Admin analytics refinement — November 26, 2026

Review branch based on production merge `da1410d` (PR #20). Production must remain unchanged until Tim approves. No reservation writes, pricing changes, outreach-link changes, or new services.

## Visual refinements

Website bookings uses the existing warm neutral metric cards for confirmed reservations, gross booking revenue, and checkout clicks. Campaign performance has concise labels, right-aligned values, recognizable verified source names, and stacked mobile rows. Detailed definitions remain in keyboard-accessible native disclosures. Booking conversion is omitted: no defensible visitor-to-reservation match exists. The old event-click/visitor ratio is no longer shown.

All screenshots below are **local fixtures, not production results**. A separate temporary source copy supplied stub responses and disabled public analytics; no fixture routes, mock metrics, authentication bypasses, or fixture credentials are included in this branch or its Vercel preview. The local shell reproduces the workspace layout; production navigation code is unchanged.

- [Before desktop](before-desktop.jpg), [after desktop](after-desktop.jpg)
- [After tablet](after-tablet.jpg), [after mobile](after-mobile.jpg)
- [Zero results](zero-mobile.jpg), [Hostaway unavailable](unavailable-mobile.jpg), [loading](loading-mobile.jpg)

## Hostaway verification

**Live reservation response remains unverified.** Production redirected to the admin sign-in page; no authenticated browser session was available. The Vercel connector returned 403, while existing CLI credentials permitted analytics reads. Automatic approval review rejected pulling the entire production environment to a local file because that could copy unrelated secrets. No environment was pulled and no Hostaway request was made.

Code inspection establishes that PR #20's displayed zero can only come from `available:true`, not the error fallback. This is evidence about implementation, not an independent successful production API check.

The reader selects channel 2013 (bookingengine), allows only `new`/`modified`, and filters by reservation creation timestamp in `[since, until)`, not stay dates. Cancelled, declined, expired, inquiry, pending, owner stays and other channels do not count. Hostaway documents UTC timestamps; unzoned SQL timestamps are interpreted as UTC before comparing to Mountain Time boundaries.

Repeated IDs with identical reporting fields count once. Conflicting snapshots for the same ID return unavailable instead of choosing an arbitrary version or counting a cancelled duplicate. Invalid eligible amounts/dates/currencies/listings and missing IDs return unavailable. Empty/boolean amounts no longer coerce to zero. Network, authentication, malformed-response, provider error and scan-cap failures return unavailable. The existing cap remains 500 rows; exhausting it never produces partial totals. Counts/revenue remain independently available when website traffic fails.

Revenue is the sum of Hostaway `totalPrice`, rounded per currency. It includes only fee/tax components already included by Hostaway in that field; none are added again. This is gross reservation value, not rental-only income, net owner payout, or proof of collection. **Account-specific fee/tax composition remains unverified** and is disclosed in the UI. No cross-currency conversion.

References: [Hostaway API: UTC and reservation fields](https://api.hostaway.com/documentation), [Hostaway reservation total and channel-dependent components](https://support.hostaway.com/hc/en-us/articles/4405370048155-Financial-Reporting-Reservation-Total-Formula).

## Internal traffic investigation and exclusions

Read-only production API queries correlated `eventData/utm_source` and `eventData/utm_campaign` over November 20 07:00 UTC–November 27 02:00 UTC:

| Source | Observed campaign | Finding |
| --- | --- | --- |
| `qa_attrib` | `pr20_live_check` | Explicitly tagged attribution QA / PR #20 live check; 10 events: 3 page views, 3 automatic availability attempts, 3 successes, 1 guest step. No checkout event. The operator/browser identity was not established. |
| `ftlcgvba_gufbgef` | `dbfgyfufbe_fcevag4` | 12 events, including 4 page views. Origin unresolved; retained. |
| `ivfvgcbexdvgl` | `dbfgyfufbe_fcevag4` | 6 events, including 2 page views. Origin unresolved; retained. |
| `parkcitysport` | `castlehead_sprint1` | 1 page view plus 1 automatic availability attempt and success. Tag established; guest/outreach click versus scanner/internal origin unresolved. Retained, never described as verified guest engagement. |

Repository/test/docs searches and available project documentation did not establish the actor or mechanism behind the two unusual identifiers. Their spelling is not evidence that they are testing. The automatic availability request on page load also cannot establish human intent.

The exact pair `qa_attrib` + `pr20_live_check` is excluded in the shared query builder for **every custom-event aggregate**: booking activity, checkout clicks, source and campaign tables. A live read verified removal of the 10 QA events while untagged, Google, both unknown sources, and Park City Sport remained. Raw analytics history is retained.

**Historical visitor/page-view exclusion is blocked by the current Vercel plan.** Both native UTM breakdown/filter requests returned 402 requiring Web Analytics Plus/Enterprise. No paid feature was enabled. Those metrics retain historical QA and say so in the visitor disclosure. We do not subtract event counts from unique visitors or claim these populations match. Production environment and admin-path exclusions apply to all visits and event queries.

Future QA: open the first page with `?rs_analytics=internal` before testing. The shared before-send sanitizer suppresses automatic page views and custom events for that tab, preserving the marker in sessionStorage (with memory fallback when blocked). Browser sessions reporting `navigator.webdriver=true` are also suppressed. The marker does not modify campaign links or checkout parameters. Close the marked tab/session to resume ordinary measurement. Automation that hides webdriver must explicitly set the marker; no method can identify all such automation retroactively. Existing anonymous/unmarked QA cannot safely be reconstructed from these aggregates.

## Listing and source mappings

Verified against `next.config.js` redirects, public booking routes, and `docs/launch-handoff.md`: 455635 → Hygge House; 455631 → Granary; 455632 → The Lowell; 455633 → Powder Room. Legacy slugs use those same mappings. Unknown IDs display `Listing <id>`. Booking routes retain the `Book:` distinction.

`parkcitysport` → Park City Sport, `google` → Google, missing source → Direct / Unknown. Original identifiers remain unchanged in data. Unknown campaign names are retained. Routes are labeled, not merged: summing top-N route rows or unique visitor counts could be misleading, and Google rankings/CTR cannot be naively combined.

## Date/timezone diagnosis and resolution

The old chart built dates with `getUTCDate()` and aggregated UTC days; it could display November 27 during November 26 in Utah/New Jersey. Its rolling headline period also differed from the seven displayed calendar days, and longer charts queried a separate full year.

All website analytics and reservation ranges now begin at local midnight on the first of N calendar days including today, in `America/Denver`, and end at the request instant. The daily/weekly chart uses that same period and server-produced calendar dates. Weeks run Sunday–Saturday, clipped at period boundaries; partial first/current weeks are disclosed. No browser timezone-dependent current-day reconstruction.

Each chart point is queried directly for its Mountain Time interval using `by=environment` (filtered to production). **No sum of hourly unique visitor counts and no relabeling of UTC daily buckets.** Live verification confirmed `2026-11-25T07:00Z` through `2026-11-26T06:59:59.999Z` returns a query ending at `2026-11-26T07:00Z`. Vercel rounds inclusive `until` to the next hour; subtracting 1ms from exclusive endpoints avoids requesting the next hour at midnight. Current-hour data is naturally partial and may be delayed. DST tests cover both 23-hour and 25-hour days.

Headline visitors are a direct period aggregate, not a sum of daily/weekly unique counts. Vercel visitors are estimates based on daily identifiers; returning visitors can count again on another day. The 365-day chart can require up to 54 queries, at most four concurrent, plus breakdown queries. Live end-to-end latency through the authenticated route remains an acceptance check.

Google Search Console retains Pacific Time calendar dates and the existing three-day lag, now anchored to the Pacific date rather than UTC. Its fixed semantics are explicitly labeled; it is not relabeled Mountain Time.

Reference: [Vercel API grouping, inclusive bounds and filters](https://vercel.com/docs/rest-api/web-analytics/aggregates-page-views).

## Metric definitions

- Visitors: Vercel's direct aggregate for the selected public production window; not a CRM count or matched booking denominator.
- Page views: automatic public page-view events; separate from custom property views.
- Property views: `booking_page_view` on property **and booking** pages. Repeated actions follow the existing short dedupe window.
- Booking starts: `booking_guest_step`, after choosing dates in guided booking. Standard booking does not emit this event; the disclosure states that limitation. No guest flow changes.
- Checkout clicks: `hostaway_checkout_click`, taps toward external payment, never confirmed reservations.
- Signups: accepted submission events, not deduplicated contacts. The audience card remains stored contacts, all time.
- Campaign engagement: grouped first-touch tags, inferred acquisition only. Hostaway does not preserve these tags; no campaign revenue or Castlehead-generated reservation claim.

## Testing and verification

Baseline: 12/13 test files passed; existing `tests/early-access.test.cjs` fails with `SyntaxError: Cannot use import statement outside a module` in its VM harness. This was reproduced before edits; the legacy test is unchanged.

Final: 15/16 test files pass. Added tests cover all four periods, DST, UTC midnight, contiguous chart windows, exact exclusion predicates, source/property mappings, zero/unavailable responses, malformed metrics, Hostaway duplicate/conflicting records, and authorization isolation. Existing booking, availability, attribution, PII sanitization and checkout URL tests pass. A separate module-aware signup regression test covers acceptance, attribution ledger, existing opt-out preservation, validation, and provider/storage failures with all external integrations stubbed.

Production build and TypeScript check pass; `git diff --check` passes. The first sandboxed build failed solely on blocked Google Fonts DNS; retry with network access passed. Existing Browserslist data-age warning remains.

Browser fixture checks: 1440×1000 desktop, 768×1024 tablet, 390×844 mobile; no document horizontal overflow at tablet/mobile; long source wrapping; 7/30/90/365 selectors; source/campaign selector; chart point detail; expandable definitions; populated, zero, Hostaway-unavailable, Google-unavailable and loading states. Browser viewport overrides restored. Chrome's local fixture failed to hydrate without a reported console error; the in-app browser rendered and passed the checks. No claim of a successful Chrome acceptance run.

## Remaining acceptance checks / blockers

1. Authenticated production Hostaway success and actual zero count for all selected periods; fee/tax breakdown and current account status conventions. No owner access requested.
2. Authenticated Google Search Console live response and protected preview dashboard render. WIF is production-scoped; preview GSC may correctly report unavailable.
3. Historical visitor/page-view QA filtering unavailable on existing plan; unknown-source origins and Park City Sport human/scanner status unresolved. Do not suppress more sources without evidence.
4. Full booking/signup integration acceptance remains fixture-based. No reservation, payment, live signup, notification, or outreach operation was submitted.
5. Review the PR and protected preview; merge/production deployment require Tim's approval.
