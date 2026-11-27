# Booking funnel events

Custom events go through the existing Vercel Web Analytics client (`track` from `@vercel/analytics`). Automatic page views still come from the `<Analytics>` component. A checkout tap, a redirect, or any event below is not a confirmed booking and is not revenue.

Cross-domain completion is unverified. The Hostaway handoff does not receive a funnel reference. See the handoff section below.

## Shared event properties

Every booking event may include:

| Property | Meaning |
| --- | --- |
| `property_slug` | Site slug, such as `hygge-house` or `granary`. |
| `listing_id` | Hostaway listing id when the page has one. Hygge House is `455635`. Granary is `455631`. The Lowell is `455632`. Powder Room is `455633`. Omitted for The Heber Senator. |
| `page_kind` | `property` or `book`. Only on `booking_page_view`. |
| `nights` | Whole nights between the selected check-in and check-out. Only on the guest step and checkout handoff. |
| `guests` | Adults plus children. A count, not a name. Only on the guest step and checkout handoff. |
| `funnel_ref` | Opaque random UUID for this browser tab. It is not derived from the guest. |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | Present only when the landing query had a safe value. |
| `source` | Present only when `utm_source` is absent and the landing query had a safe `source` value. |
| `referrer_host` | External referrer hostname only, such as `www.google.com`. |
| `landing_path` | First public landing pathname, at most 120 characters; no query or hash. |

Not sent: guest name, email, phone, full referrer URL, raw query string, stay dates, or payment details.

Events have a hard cap of 10 custom properties. If needed, drop `utm_term`, then `utm_content`, then `landing_path` until within the cap.

## Events

### `booking_page_view`

Fires once when a property detail page or a `/book/[slug]` page is shown, after the analytics client queue exists.

`track()` in `@vercel/analytics` does not store the call when `window.va` is missing. The Next client installs that queue from `inject()`, and the Next component that calls `inject()` reads `useSearchParams()` inside `Suspense`, so it can mount after the property page effect. The page-view call is therefore handed to the same queue the package uses, instead of being dropped. It is not fired a second time to make up for a lost call.

Does not fire for the home page, `/properties`, `/book`, or `/admin`. A second call for the same slug and page kind inside 1.5 seconds is dropped only after the first call was handed to the queue. A later visit outside that window counts again.

This is not a second copy of Vercel's automatic page view. `@vercel/analytics` 2 page views cannot carry custom properties, so the listing id is sent on this custom event. Do not add these counts to traffic page views.

### `booking_date_check_attempt`

Fires when the on-site calendar starts a request for the visible month window. A month change or Try again starts another request and another attempt. These events are not dropped by a time window.

Does not fire when a guest taps a date. A request cancelled by leaving the month still counts as an attempt if it started. It does not also count as success, unavailable, or error.

Attempt and outcome used to be deduped separately, with the attempt stamped at the start and the outcome stamped when the response arrived. A return to a month inside 1.5 seconds of the first attempt could drop the new attempt while the slower response still sent a success. That split can make a success total higher than the attempt total. A query window can also omit an event that was sent, so a past count such as 3 successes and 2 attempts is consistent with these mechanisms but cannot be assigned to one of them after the fact. Each started request now keeps its attempt, and each accepted response keeps its one outcome.

### `booking_date_check_success`

Fires when that same request returns HTTP 200 and a `days` array. An empty array is still success: the month data loaded. It does not mean a selected stay is available, it does not mean a unique person, and it does not mean a booking.

### `booking_date_check_unavailable`

Fires when that request returns HTTP 502 or 503. Those are the live-calendar-unavailable and Hostaway-not-configured responses. It does not fire for a single blocked night inside a loaded calendar.

### `booking_date_check_error`

Fires when the request fails any other way: network error, HTTP 400, or a 200 response without a `days` array. An aborted request does not fire this event.

### `booking_guest_step`

Fires when the guest clicks the date-step continue control with a check-out selected and the calendar is not loading. That click stays on roamstead-co.com and opens the guest step. `guests` is the count at that click. The control starts at 2 adults and 0 children, so the event records 2 unless the guest changed it before leaving the date step. Adding adults on the guest step changes the handoff count, not this one.

Does not fire on render, on an unavailable calendar, or on a second click inside 1 second for the same dates and guest count. It replaces the older `availability_dates_selected` event. Historical rows of that older name remain in Vercel. New guest steps are not also recorded under the old name.

### `hostaway_checkout_click`

Fires when the guest clicks the handoff link and the documented checkout URL is ready. The link leaves roamstead-co.com for payment. This is the checkout start. It is not a confirmed booking, not a paid reservation, and not revenue.

Does not fire when the link is disabled. A second click inside 1 second for the same dates and guest count is dropped. Changing the guest count and clicking again counts as a new handoff tap.

## Automatic page views

The existing `<Analytics>` page view still fires once per public page. The same sanitizer is registered at the front of the analytics queue before any custom event, and it is the only `beforeSend` registration. The hosted script replays that queue in order, so the first event's page URL goes through this sanitizer too. It then:

- drops `/admin` URLs
- removes every query parameter except the allowlisted `utm_*` and `source` values above
- drops a second page view for the same sanitized URL inside 1.5 seconds

Custom events use the same URL cleanup. Their names are not deduped there, because the page-view filter cannot see the event name. Page views, the guest step, and the handoff are still deduped before `track`. Date-check attempt and outcome are not.

## How to read totals

`booking_page_view` is the property-identified custom event. Vercel traffic page views are separate and must not be added to it.

For calendar checks, every started request emits one `booking_date_check_attempt`. An aborted request has no outcome. A finished request emits exactly one of success, unavailable, or error. Attempt totals can be higher than the sum of outcomes by the number of aborted requests. They should not be lower. A success total is the number of month payloads that loaded, not bookable stays and not bookings.

A query window can still omit an event that was sent just outside the selected times. That is separate from the client accounting above. This site does not record whether Vercel stored an event.

## Attribution

The first public landing captures a whole record in first-party localStorage key `rs_first_touch`: version `v:1`, allowlisted attribution fields, optional `landing_path`, ISO `captured_at`, and `expires_at` exactly 90 days later. Later visits never overwrite or fill missing fields. A direct landing also creates a record; absent source tags report as Direct / unknown. Expired or malformed records are replaced on the next public landing. `/admin` and its descendants never create or alter the record.

Safe campaign tokens are 1–64 letters, numbers, `.`, `_`, `~`, or `-`, beginning with a letter or number. Email-like and phone-like values are rejected. Only allowlisted keys are accepted; click IDs, email, phone, and full referrer URLs are not stored or sent. Referrers are external hostnames only. Landing paths contain only slash-separated safe alphanumeric/underscore/hyphen segments, at most 120 characters, with no query or hash.

When `navigator.globalPrivacyControl === true`, localStorage is neither read nor written for attribution. Blocked storage also falls back to the existing session/in-memory attribution. That fallback remains per-field within the tab. `rs_booking_attr` and the opaque per-tab `funnel_ref` remain unchanged. First touch supplies the entire attribution record when available, including an empty/direct record; it is never merged with later session campaign fields.

Booking events include first touch and the per-tab funnel reference, subject to the 10-property cap (drop `utm_term`, `utm_content`, then `landing_path`). The existing `early_access_submission_accepted` event includes only first-touch source, medium, campaign, referrer host, and landing path. Native traffic page views keep their existing URL sanitizer and dedupe behavior.

The inquiry POST carries sanitized first-touch fields; the server independently revalidates them. The existing sheet Source column uses `roamstead-co.com|s=source|m=medium|c=campaign|r=host|l=/path`, capped at 100 characters. Whole segments are dropped in landing, referrer, campaign, medium, source order if necessary. No attribution remains exactly `roamstead-co.com`. Sheet columns and the separately deployed Apps Script are unchanged. The owner email has a First touch row.

Tag future campaigns with lowercase safe tokens, for example:
`/properties/granary?utm_source=gohebervalley&utm_medium=email&utm_campaign=castlehead_sprint1`.
Never put guest identifiers or click IDs in campaign values.

## Hostaway handoff

The checkout starts with the existing ordered parameters:
`https://roamstead_ventures.holidayfuture.com/checkout/{listingId}?start=YYYY-MM-DD&end=YYYY-MM-DD&numberOfGuests={adults+children}`.

When first touch exists, sanitized `utm_source`, `utm_medium`, and `utm_campaign` are appended in that order when present. No referrer, landing path, or funnel reference is sent. With no first touch, the original URL is unchanged.

Operator-verified: Holiday Future returns 200 with those extra UTMs, without redirect or page changes. Its JavaScript does not read them into the reservation body, which contains dates, guests, ages, coupon id, fee components and, for Google VR only, channelId. Hostaway does not store these UTMs on reservations. They only help if booking-engine analytics is later enabled. A checkout click is a booking attempt, not a reservation; this site has no reliable completion event.

Admin acquisition queries use repeated `by=eventName&by=eventData/utm_source` (or `utm_campaign`), supported on the current plan per operator verification, limited to 100 groups. Empty tags appear as Direct / unknown, including historical events without attribution. Counts are events, not unique guests.

The admin-only Hostaway reader exchanges a token and GETs reservations with `channelId=2013` (bookingengine). Channel 2000 is direct and 2022 is Google. It filters `reservationDate` to the selected period locally, excludes cancelled/canceled, declined, expired and inquiry statuses, counts by listing, and sums totalPrice separately per currency. It scans at most five pages of 100; missing configuration, failures, malformed data or reaching the cap return unavailable, not a partial total. Only aggregates leave the server; no guest PII, reservation IDs, or individual dates are returned. Revenue covers all website checkout sources and cannot be split by campaign.

Campaign-level reservation attribution would need Hostaway booking-engine analytics, per-campaign coupon codes, or an owner-set custom field. Those require Hostaway account changes and are out of scope. No live checkout was submitted to implement or test this change.

## Where this runs

Property pages and `/book/[slug]` send `booking_page_view`. The shared calendar sends the date-check, guest, and handoff events for every home that uses it, including The Lowell and Powder Room. This tracking change does not change their booking screens. The Heber Senator still uses its own Cloudbeds link and only gets `booking_page_view` with its slug.
