import { CLINIC } from '../data'
import { scrollToBooking } from '../callStore'
import { useReveal } from '../hooks'
import CallLink from './CallLink'
import Icon from './Icon'

/**
 * The closing band, between the FAQ and the footer.
 *
 * New in this pass — the page previously ended on the FAQ's "still have
 * questions?" line, which is a fallback rather than an ask. Someone who has
 * read to the bottom has read everything the page had to offer, and the last
 * thing they should meet is the two actions the whole page is for.
 *
 * Both are given equal weight and separated by an explicit OR, per the brief.
 * That is deliberate rather than lazy: at this point in the page the visitor
 * has already declined the form once at the top, so leading them back to it a
 * second time as the only option is the wrong bet — the call is a genuine
 * alternative, not a secondary action.
 *
 * White ground. It sits directly above the footer's dark bronze, and a dark
 * band there closed the page on one heavy block instead of a clear last ask.
 */
export default function FinalCta() {
  const ref = useReveal()

  return (
    <section className="fcta" aria-labelledby="fcta-title" ref={ref}>
      {/* Two blurred gold blooms, drawn in CSS — no image request. Far weaker
          than the hero's: on white they warm the ground, they are not its
          light source. */}
      <span className="fcta__bloom fcta__bloom--a" aria-hidden="true" />
      <span className="fcta__bloom fcta__bloom--b" aria-hidden="true" />

      <div className="shell fcta__inner">
        {/* Heading and two actions, which is all the brief gives this band —
            no eyebrow and no sub-line, because anything here would be a
            sentence nobody wrote sitting between the page's closing ask and
            the buttons that answer it.

            Heading and contact line share the left column so the two actions
            can hold the right one as a single stacked pair. */}
        <div className="fcta__copy">
          <h2 className="fcta__title reveal" id="fcta-title">
            Ready for Healthy, <span className="gold-text">Glowing Skin?</span>
          </h2>

          {/* Not copy — the number and the two locations, which the page states
              in the header and footer already. Kept because this is the last
              thing on the page before the footer and a closing ask with no way
              to act on it in view is a dead end. */}
          <p className="fcta__note reveal" style={{ '--delay': '130ms' }}>
            <Icon name="Phone" size={14} />
            {CLINIC.phoneDisplay}
            <i aria-hidden="true">·</i>
            Mylapore &amp; Velachery, Chennai
          </p>
        </div>

        <div className="fcta__actions reveal" style={{ '--delay': '80ms' }}>
          <CallLink className="btn btn--gold btn--lg fcta__btn">
            <Icon name="PhoneCall" size={18} />
            Call Our Skin Specialist Today
          </CallLink>

          {/* A rule with the word set into it, rather than a bare "OR" floating
              between two buttons — it has to read as a fork, and on the wide
              layout two buttons with a word between them read as three
              controls in a row.

              Not `aria-hidden`. The rules either side are pseudo-elements and
              are never announced anyway, but the word itself is content the
              brief asks for, and it is what tells someone the two buttons are
              alternatives rather than steps. */}
          <span className="fcta__or">OR</span>

          <button
            type="button"
            className="btn btn--ghost btn--lg fcta__btn"
            onClick={scrollToBooking}
          >
            Book Your Consultation
            <Icon name="ArrowRight" size={18} className="arrow" />
          </button>
        </div>
      </div>
    </section>
  )
}
