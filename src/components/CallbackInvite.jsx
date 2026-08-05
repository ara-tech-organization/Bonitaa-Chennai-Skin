import { useCallback, useEffect, useRef, useState } from 'react'
import { useScrollLock } from '../hooks'
import Icon from './Icon'
import LeadForm from './LeadForm'

const SCROLL_TRIGGER = 0.55
const TIME_TRIGGER_MS = 3000

/**
 * Fires on whichever comes first: 3 seconds on the page, an exit-intent
 * movement towards the browser chrome (desktop), or 55% scroll depth (touch,
 * where there is no exit intent to detect).
 *
 * Scoped to the page load rather than the browser session, so a refresh shows
 * it again — the `done` ref only stops it re-opening within one visit.
 */
export default function CallbackInvite({ onDismiss, onSubmitted }) {
  const [open, setOpen] = useState(false)
  const done = useRef(false)
  const submitted = useRef(false)

  useScrollLock(open)

  /* Every close path routes through here, so the follow-up cannot be missed by
     one of them — and a completed enquiry never arms it. */
  const close = useCallback(() => {
    setOpen(false)
    if (!submitted.current) onDismiss?.()
  }, [onDismiss])

  useEffect(() => {
    const fire = () => {
      if (done.current) return
      done.current = true
      setOpen(true)
    }

    // `mouseout` fires on every element boundary — a null relatedTarget plus a
    // cursor at the top edge is what actually signals a leave toward the tab bar.
    const onExitIntent = (e) => {
      if (!e.relatedTarget && e.clientY <= 4) fire()
    }

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max > 0 && window.scrollY / max >= SCROLL_TRIGGER) fire()
    }

    const timer = window.setTimeout(fire, TIME_TRIGGER_MS)

    document.addEventListener('mouseout', onExitIntent)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('mouseout', onExitIntent)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null

  return (
    <div className="overlay is-open" onClick={close}>
      <div
        className="invite"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="invite__close" aria-label="Close" onClick={close}>
          <Icon name="X" size={19} />
        </button>

        <span className="eyebrow">
          <Icon name="PhoneCall" size={13} />
          Free Callback
        </span>
        {/* Two lines, not three — and no longer "Before You Go", which only
            ever fitted the exit-intent trigger and now reads as a non-sequitur
            for the five-second and scroll-depth ones. */}
        <h3 id="invite-title">
          Get a Callback From Our <span className="gold-text">Chennai Skin Specialist</span>
        </h3>
        <p className="invite__sub">Takes 15 seconds. We&apos;ll call you back today.</p>

        <LeadForm
          variant="compact"
          idPrefix="invite"
          submitLabel="Request Callback"
          onSuccess={() => {
            submitted.current = true
            /* Close first: the confirmation belongs over the page, not stacked
               inside a popup that is still open behind it. */
            setOpen(false)
            onSubmitted?.()
          }}
        />

        <button type="button" className="invite__dismiss" onClick={close}>
          No thanks, I&apos;ll browse
        </button>
      </div>
    </div>
  )
}
