/**
 * Single exit point for every enquiry on the page (booking section + exit
 * popup), and therefore the one place the analytics event belongs: both forms
 * route through here, so neither can be added or changed without it.
 *
 * DELIVERY — posts to the clinic's own mail handler, which sends the notifying
 * email and forwards a row to the Google Sheet.
 *
 * Absolute, not relative. A relative path only works when the site is served
 * from the same host as the PHP, and it is not: the build is a static bundle
 * (GitHub Pages / Vercel) with no PHP behind it, so `/api/email.php` there is
 * a 404 — and so is `/api` on the dev server. Cross-origin is what the handler
 * expects anyway; it answers OPTIONS and sends `Access-Control-Allow-Origin`.
 *
 * https, not http. The endpoint was given as `http://`, but a page served over
 * https is not allowed to post to it — browsers block mixed content outright,
 * with no request ever leaving. If the host has no certificate, that has to be
 * fixed on the server; it cannot be worked around from here.
 *
 * Set VITE_LEAD_ENDPOINT to point somewhere else, or to `off` to stop delivery
 * entirely while developing — the UI still reports success.
 */
const LEAD_ENDPOINT =
  import.meta.env.VITE_LEAD_ENDPOINT || 'https://chennai.bonitaa.co.in/api/email.php'
const DELIVERY_OFF = LEAD_ENDPOINT === 'off'

/* How long the visitor waits before being thanked regardless. */
const ACK_MS = 3000

/* Hard ceiling on the request itself, long after the visitor has stopped
   waiting — a backstop against a hung connection, not a performance target. */
const REQUEST_TIMEOUT_MS = 20000

/**
 * Fires `lead_form_submitted` on the GTM dataLayer.
 *
 * The array is created if it does not exist yet: GTM adopts whatever
 * `window.dataLayer` already holds when the container loads, so a push made
 * before the tag arrives is queued rather than lost. That matters here — the
 * form can be submitted from the exit popup within seconds of first paint.
 *
 * `form_source` rides along so booking-section and popup leads can be told
 * apart in GTM. It is an extra key on the event, not a replacement for it: any
 * trigger matching on the event name alone is unaffected.
 */
function trackLeadSubmitted(source) {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'lead_form_submitted',
    form_source: source,
  })
}

/** Where the enquiry came from, in words the person reading the mail knows. */
const SOURCE_LABEL = {
  'booking-section': 'Booking form (page)',
  'callback-invite': 'Callback popup',
}

/**
 * Maps the form's answers onto the handler's payload.
 *
 * One key per question, and nothing else. `email`, `time`, `treatment` and
 * `message` are gone: the form asks for a phone rather than an email, because
 * the page promises a callback; the Morning/Afternoon/Evening choice is a date
 * picker again; and treatment was never asked. Sending a key the form cannot
 * fill only puts blank rows in the notification email and blank columns in the
 * sheet.
 *
 * ⚠ THIS SHAPE REQUIRES A MATCHING email.php, AND IT IS A BLOCKING CHECK.
 * The handler was built for {name, phone, city, branch, date}. `city` is no
 * longer asked, so if the handler still treats it as required it will reject
 * EVERY enquiry as "Missing required fields" — silently, because the visitor
 * is thanked before the answer arrives (see ACK_MS below). Confirm the handler
 * accepts {name, phone, branch, date} before this goes live. Set
 * VITE_LEAD_ENDPOINT=off to test the UI without delivery.
 */
function toApiPayload(lead) {
  return {
    name: lead.name ?? '',
    phone: lead.phone ?? '',
    branch: lead.branch ?? '',
    date: lead.date ?? '',
    source: SOURCE_LABEL[lead.source] ?? lead.source ?? 'Website Form',
  }
}

export async function submitLead(lead) {
  const payload = toApiPayload(lead)

  if (DELIVERY_OFF) {
    if (import.meta.env.DEV) {
      console.info('[lead] delivery off (VITE_LEAD_ENDPOINT=off) — payload:', payload)
    }
    await new Promise((resolve) => setTimeout(resolve, 700))
    /* Still tracked: the UI reports success and shows the thank-you state, so
       the analytics have to agree with what the visitor was told. */
    trackLeadSubmitted(lead.source)
    return { ok: true, delivered: false }
  }

  /* The visitor only ever sees "something went wrong" — deliberately, since
     none of this is theirs to fix. But a silent failure is impossible to
     diagnose from a screenshot, so the actual reason is logged. */
  const fail = (reason) => {
    console.error(`[lead] not submitted — ${reason}`, { endpoint: LEAD_ENDPOINT, payload })
    return new Error(reason)
  }

  /** The whole round trip: post, then decide whether it counted. */
  const deliver = async () => {
    const abort = new AbortController()
    const timer = window.setTimeout(() => abort.abort(), REQUEST_TIMEOUT_MS)

    let res
    try {
      res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: abort.signal,
        /* Survives the page being closed or navigated mid-flight, so a lead
           already on the wire is not thrown away. */
        keepalive: true,
      })
    } catch (networkError) {
      /* fetch only rejects before it gets an answer at all: DNS, TLS, a
         blocked mixed-content request, a CORS preflight the handler did not
         answer — or the timeout above. All deployment problems, not bad
         submissions. */
      throw fail(
        networkError.name === 'AbortError'
          ? `handler did not answer within ${REQUEST_TIMEOUT_MS / 1000}s`
          : `could not reach the handler (${networkError.message})`,
      )
    } finally {
      window.clearTimeout(timer)
    }

    if (!res.ok) throw fail(`handler answered ${res.status}`)

    /* A handler that answers JSON gets read for an explicit failure; one that
       answers anything else is trusted on its status code, since PHP mail
       handlers commonly just echo a string or nothing at all. */
    const body = await res.json().catch(() => null)
    if (body && body.success === false) {
      throw fail(`handler rejected it${body.message ? ` — "${body.message}"` : ''}`)
    }
  }

  /*
   * Nobody waits longer than ACK_MS to be thanked.
   *
   * The handler sends an email and pushes a row to a Google Apps Script before
   * it replies, and an Apps Script cold start alone can run past ten seconds.
   * That is a real ~20s wait on a submit button, which reads as a broken form
   * and gets clicked again.
   *
   * So the two are decoupled: a failure that lands inside the window is still
   * reported, and after it the request is simply left to finish on its own.
   *
   * The trade-off, stated plainly: a failure occurring after ACK_MS is logged
   * but never shown — the visitor has already been thanked. That is the right
   * side to err on here, because the slow path is the handler succeeding
   * slowly, and the fast failures (host down, TLS, CORS) all reject in well
   * under a second. The proper fix is still server-side: answer the browser
   * first, write the sheet after.
   */
  const request = deliver()
  /* Claimed here so a late rejection is never an unhandled one. */
  request.catch(() => {})

  const settledInTime = await Promise.race([
    request.then(() => true),
    new Promise((resolve) => window.setTimeout(() => resolve(false), ACK_MS)),
  ])

  if (!settledInTime) {
    /* Still in flight. Track only if it actually lands. */
    request.then(
      () => trackLeadSubmitted(lead.source),
      () => {},
    )
    return { ok: true, delivered: false }
  }

  trackLeadSubmitted(lead.source)
  return { ok: true, delivered: true }
}

/** Strips formatting and a leading 91 down to the bare 10 digits. */
function digitsOnly(raw) {
  return raw.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
}

/** Indian mobile numbers: 10 digits beginning 6–9, ignoring +91 / spaces. */
export function validatePhone(raw) {
  return /^[6-9]\d{9}$/.test(digitsOnly(raw))
}

/** E.164 form, so the CRM always receives the country code the field implies. */
export function normalizePhone(raw) {
  return `+91${digitsOnly(raw)}`
}
