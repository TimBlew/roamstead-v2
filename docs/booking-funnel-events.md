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

Fires once when a property detail page or a `/book/[slug]` page is shown.

Does not fire for the home page, `/properties`, `/book`, or `/admin`. Does not fire again for the same slug and page kind inside 1.5 seconds (this collapses React strict-mode double mounts). A later visit outside that window counts again.

This is not a second copy of Vercel's automatic page view. `@vercel/analytics` 2 page views cannot carry custom properties, so the listing id is sent on this custom event. Do not add these counts to traffic page views.

### `booking_date_check_attempt`

Fires when the on-site calendar requests live availability for the visible month window. A month change or Try again starts another check. The dedupe key is the listing, the requested window, and the retry count, for 1.5 seconds.

Does not fire when a guest taps a date, and does not fire for an aborted request's result. A request cancelled by leaving the month still counts as an attempt if it started. It does not also count as success, unavailable, or error.

### `booking_date_check_success`

Fires when that same request returns HTTP 200 and a `days` array. An empty array is still success: the calendar loaded. It does not mean a stay is available, and it does not mean a booking exists.

### `booking_date_check_unavailable`

Fires when that request returns HTTP 502 or 503. Those are the live-calendar-unavailable and Hostaway-not-configured responses. It does not fire for a single blocked night inside a loaded calendar.

### `booking_date_check_error`

Fires when the request fails any other way: network error, HTTP 400, or a 200 response without a `days` array. An aborted request does not fire this event.

### `booking_guest_step`

Fires when the guest clicks the date-step continue control with a check-out selected and the calendar is not loading. That click stays on roamstead-co.com and opens the guest step.

Does not fire on render, on an unavailable calendar, or on a second click inside 1 second for the same dates and guest count. It replaces the older `availability_dates_selected` event. Historical rows of that older name remain in Vercel. New guest steps are not also recorded under the old name.

### `hostaway_checkout_click`

Fires when the guest clicks the handoff link and the documented checkout URL is ready. The link leaves roamstead-co.com for payment. This is the checkout start. It is not a confirmed booking, not a paid reservation, and not revenue.

Does not fire when the link is disabled. A second click inside 1 second for the same dates and guest count is dropped. Changing the guest count and clicking again counts as a new handoff tap.

## Automatic page views

The existing `<Analytics>` page view still fires once per public page. `beforeSend` then:

- drops `/admin` URLs
- removes every query parameter except the allowlisted `utm_*` and `source` values above
- drops a second page view for the same sanitized URL inside 1.5 seconds

Custom events use the same URL cleanup. Their names are not deduped there, because the page-view filter cannot see the event name. Custom-event dedupe happens before `track`.

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
