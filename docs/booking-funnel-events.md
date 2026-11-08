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

Not sent: guest name, email, phone, full referrer URL, raw query string, stay dates, or payment details.

Vercel may drop custom properties above the plan limit. The event name still records the step.

## Events

### `booking_page_view`

Fires once when a property detail page or a `/book/[slug]` page is shown, after the analytics client queue exists.

`track()` in `@vercel/analytics` does not store the call when `window.va` is missing. The Next client installs that queue from `inject()`, and the Next component that calls `inject()` reads `useSearchParams()` inside `Suspense`, so it can mount after the property page effect. The page-view call is therefore handed to the same queue the package uses, instead of being dropped. It is not fired a second time to make up for a lost call.

Does not fire for the home page, `/properties`, `/book`, or `/admin`. A second call for the same slug and page kind inside 1.5 seconds is dropped only after the first call was handed to the queue. A later visit outside that window counts again.

This is not a second copy of Vercel's automatic page view. `@vercel/analytics` 2 page views cannot carry custom properties, so the listing id is sent on this custom event. Do not add these counts to traffic page views.

### `booking_date_check_attempt`

Fires when the on-site calendar starts a request for the visible month window. A month change or Try again starts another request and another attempt. These events are not dropped by a time window.

Does not fire when a guest taps a date. A request cancelled by leaving the month still counts as an attempt if it started. It does not also count as success, unavailable, or error.

Attempt and outcome used to be deduped separately, with the attempt stamped at the start and the outcome stamped when the response arrived. A return to a month inside 1.5 seconds of the first attempt could drop the new attempt while the slower response still sent a success. That made success totals higher than attempt totals. Each started request now keeps its attempt, and each accepted response keeps its one outcome.

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

The existing `<Analytics>` page view still fires once per public page. `beforeSend` then:

- drops `/admin` URLs
- removes every query parameter except the allowlisted `utm_*` and `source` values above
- drops a second page view for the same sanitized URL inside 1.5 seconds

Custom events use the same URL cleanup. Their names are not deduped there, because the page-view filter cannot see the event name. Page views, the guest step, and the handoff are still deduped before `track`. Date-check attempt and outcome are not.

## How to read totals

`booking_page_view` is the property-identified custom event. Vercel traffic page views are separate and must not be added to it.

For calendar checks, every started request emits one `booking_date_check_attempt`. An aborted request has no outcome. A finished request emits exactly one of success, unavailable, or error. Attempt totals can be higher than the sum of outcomes by the number of aborted requests. They should not be lower. A success total is the number of month payloads that loaded, not bookable stays and not bookings.

A query window can still omit an event that was sent just outside the selected times. That is separate from the client accounting above. This site does not record whether Vercel stored an event.

## Attribution

Values are kept for the browser tab, first touch wins, and they are stored only after sanitizing.

A safe token is 1 to 64 characters of letters, numbers, `.`, `_`, `~`, and `-`. Values that look like an email address or a phone number are dropped. Unknown query keys, including click ids and guest fields, are dropped.

`referrer_host` is the hostname of an external `document.referrer`. Same-site hosts, including `www.roamstead-co.com`, `roamstead-co.com`, and Roamstead Vercel hosts, are not stored. The path and query of the referrer are not stored.

`funnel_ref` is `crypto.randomUUID()`, saved in `sessionStorage` under `rs_booking_attr`. A stored value that is not a UUID is ignored and replaced. The reference is not written into the address bar.

## Hostaway handoff

The checkout URL stays:

`https://roamstead_ventures.holidayfuture.com/checkout/{listingId}?start=YYYY-MM-DD&end=YYYY-MM-DD&numberOfGuests={adults+children}`

`docs/launch-handoff.md` says Roamstead sends dates and the combined guest total only. There is no documented Hostaway parameter for a booking reference, and adding one is not verified to leave checkout behavior unchanged. The funnel reference is tracked only in Vercel events on this site.

Completion after the guest leaves for Hostaway is unverified. Do not read a handoff as a reservation.

## Where this runs

Property pages and `/book/[slug]` send `booking_page_view`. The shared calendar sends the date-check, guest, and handoff events for every home that uses it, including The Lowell and Powder Room. This tracking change does not change their booking screens. The Heber Senator still uses its own Cloudbeds link and only gets `booking_page_view` with its slug.
