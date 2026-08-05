import { useEffect } from 'react'
import { CLINIC } from '../data'
import { useScrollLock } from '../hooks'
import { smoothScrollTo } from '../hooks/useSmoothScroll'
import Icon from './Icon'

/**
 * The post-submit confirmation, shown over the landing page rather than as a
 * separate document — this is a one-page site and nothing navigates away.
 *
 * The address bar still changes to /thank-you, pushed by the host. That is
 * what gives GTM a URL to hang a conversion on; an inline success state alone
 * changes nothing an analytics tag can see. Because it is a real history
 * entry, the browser's Back button closes this and returns to the form, which
 * is what someone pressing Back expects.
 */
export default function ThankYou({ open, onClose }) {
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="ty" role="dialog" aria-modal="true" aria-labelledby="ty-title">
      <div className="ty__card">
        <span className="ty__ring" aria-hidden="true">
          <Icon name="Check" size={30} />
        </span>

        <h2 id="ty-title">Thank you — we&rsquo;ve got your request</h2>
        <p className="ty__lede">
          One of our Chennai skin specialists will call you back shortly to confirm your
          appointment.
        </p>

        <div className="ty__next">
          <strong>What happens next</strong>
          We call you in the time slot you chose, within 30 minutes during clinic hours, to confirm
          your date and branch. Keep your phone handy — we call from a local Chennai number.
        </div>

        <div className="ty__actions">
          <a className="btn btn--gold btn--lg" href={CLINIC.phoneHref}>
            <Icon name="PhoneCall" size={17} />
            Call us now
          </a>

          <button
            type="button"
            className="btn btn--outline btn--lg"
            onClick={() => {
              onClose()
              /* Back to the top of the page, not wherever the form happened to
                 be — the visitor is starting again, not resuming. */
              smoothScrollTo(0)
            }}
          >
            Back to the site
          </button>
        </div>

        <p className="ty__fine">
          <Icon name="Lock" size={13} />
          Your details stay confidential. No spam calls, ever.
        </p>
      </div>
    </div>
  )
}
