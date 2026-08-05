import { useEffect, useRef, useState } from 'react'
import { CLINIC, URGENCY } from '../data'
import { useScrollLock } from '../hooks'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import Icon from './Icon'

/* How long after the lead form is dismissed this follows it. */
const DELAY_MS = 3000
/* How often to look again while another dialog is still on screen. */
const RETRY_MS = 800

/** Seconds → "14:56". */
const clock = (total) => {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * The second-chance popup: three seconds after someone dismisses the lead form,
 * offer them the phone instead of another form.
 *
 * `armed` is set by the lead form on the way out, and only when it was
 * dismissed rather than submitted — following a completed enquiry with a
 * "call us now" is badgering someone who has already done what was asked.
 *
 * Shows once per page load. The CTA is a real `tel:` link rather than a button
 * that opens another dialog: this popup exists to shorten the path to a call,
 * so putting one more step in front of it would defeat it.
 */
export default function CallUrgency({ armed }) {
  const [open, setOpen] = useState(false)
  const [left, setLeft] = useState(URGENCY.windowMinutes * 60)
  const done = useRef(false)
  const closeRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  useScrollLock(open)

  useEffect(() => {
    if (!armed || done.current) return

    /* Never two dialogs at once. The lead form is closed by the time this is
       armed, but three seconds is long enough for the visitor to have opened
       the call modal, or submitted elsewhere and landed on the confirmation —
       and stacking a second card on top of either is disorienting.
       Waiting rather than giving up: the offer still lands, just once the
       screen is the visitor's again. */
    let timer = 0

    const tick = () => {
      if (document.querySelector('.overlay, .ty')) {
        timer = window.setTimeout(tick, RETRY_MS)
        return
      }
      done.current = true
      setOpen(true)
    }

    timer = window.setTimeout(tick, DELAY_MS)
    /* Closes over the live id, so a pending retry is cleared too — not just
       the first timeout. */
    return () => window.clearTimeout(timer)
  }, [armed])

  /* Counted down from a fixed end stamp rather than by decrementing once a
     second — a background tab throttles intervals, and a timer that loses
     minutes while you are away is worse than none. */
  useEffect(() => {
    if (!open) return

    const endsAt = Date.now() + URGENCY.windowMinutes * 60_000
    const tick = () => setLeft(Math.max(0, Math.round((endsAt - Date.now()) / 1000)))

    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return (
    <div className="overlay is-open" onClick={() => setOpen(false)}>
      <div
        className="urg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="urg-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          ref={closeRef}
          className="invite__close"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          <Icon name="X" size={19} />
        </button>

        <div className="urg__tags">
          <span className="urg__tag urg__tag--live">
            <span className={`urg__blip${reduced ? '' : ' is-live'}`} aria-hidden="true" />
            Limited slots only
          </span>
          <span className="urg__tag">{URGENCY.slotsLeft} slots left today</span>
        </div>

        <h3 id="urg-title">
          Call Now, Skip The <span className="gold-text">Wait</span>
        </h3>
        <p className="urg__sub">
          Talk to our skin specialist directly — book your slot before today&apos;s offer closes.
        </p>

        <p className="urg__price">
          <s>{URGENCY.wasPrice}</s>
          <Icon name="ArrowRight" size={15} aria-hidden="true" />
          <strong>{URGENCY.nowPrice}</strong>
          <small>{URGENCY.priceNote}</small>
        </p>

        <p className="urg__timer">
          <span>Offer ends in</span>
          {/* Announced only when it runs out — a live region reading every
              second would make the popup unusable with a screen reader. */}
          <time aria-hidden="true">{clock(left)}</time>
          {left === 0 && <span className="sr-only">This offer has ended.</span>}
        </p>

        <a className="urg__cta" href={CLINIC.phoneHref}>
          <Icon name="PhoneCall" size={18} />
          Call Now — {CLINIC.phoneDisplay}
        </a>

        <ul className="urg__proof">
          {URGENCY.proof.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="urg__note">
          <Icon name="Lock" size={13} />
          100% confidential · No spam calls, ever
        </p>

        <button type="button" className="invite__dismiss" onClick={() => setOpen(false)}>
          No thanks, I&apos;ll browse
        </button>
      </div>
    </div>
  )
}
