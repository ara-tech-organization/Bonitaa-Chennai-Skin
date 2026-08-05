import { ArrowUpRight, PhoneCall } from 'lucide-react'
import CallLink from '../CallLink'

/**
 * The hero's CTA pair.
 *
 * These used to be "magnetic" — a pointer-driven spring that leaned each button
 * toward the cursor and dragged its label a little further still. That is gone:
 * a primary call-to-action that moves away from where it was aimed is a target
 * that fights the click. They are plain buttons now, and the hover feedback is
 * the same lift-and-shadow every other button on the page uses.
 *
 * Framer Motion went with them — nothing here animates from JS any more.
 *
 * The call CTA is a `tel:` anchor (see CallLink) rather than a button, so the
 * number is a real link everywhere the page offers a call.
 */
export default function CTAButtons({ onBook }) {
  return (
    <div className="hero__ctas">
      <CallLink className="mbtn mbtn--solid">
        <span className="mbtn__inner">
          <span className="mbtn__icon mbtn__icon--lead">
            <PhoneCall size={16} strokeWidth={1.7} />
          </span>
          <span className="mbtn__label">Call Skin Specialist</span>
        </span>
      </CallLink>

      <button type="button" className="mbtn mbtn--glass" onClick={onBook}>
        <span className="mbtn__inner">
          <span className="mbtn__label">Book a Consultation</span>
          <span className="mbtn__icon">
            <ArrowUpRight size={17} strokeWidth={1.7} />
          </span>
        </span>
      </button>
    </div>
  )
}
