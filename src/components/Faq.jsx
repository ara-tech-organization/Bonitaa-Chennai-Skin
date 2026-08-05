import { useState } from 'react'
import { FAQS } from '../data'
import { useReveal } from '../hooks'
import CallLink from './CallLink'
import Icon from './Icon'

export default function Faq() {
  const ref = useReveal()
  const [open, setOpen] = useState(0)

  return (
    <section className="section section--cream faq" id="faq" ref={ref}>
      {/* Two columns: the heading and the "still have questions" call sit in a
          sticky left rail while the questions run down the right. Centred over
          a full-width accordion, the head was a lot of empty air above four
          short rows — and the call underneath was below the fold by the time
          anyone had opened one. */}
      <div className="shell faq__inner">
        <div className="faq__side">
          <div className="section-head reveal">
            <span className="eyebrow">
              <Icon name="MessageCircleQuestion" size={13} />
              FAQ
            </span>
            <h2>Frequently Asked Questions</h2>
            <div className="rule" />
          </div>

          <div className="faq__cta reveal">
            <p>Still have questions about your skin?</p>
            <CallLink className="btn btn--outline btn--lg">
              <Icon name="PhoneCall" size={18} />
              Call the Clinic Directly
            </CallLink>
          </div>
        </div>

        <div className="faq__list">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              /* Deliberately not a `.reveal`. That class parks an element at
                 opacity 0 until an observer adds `.is-in`, and a miss leaves
                 the question invisible while its box still takes up the room —
                 which read as a tall blank gap above the answers that did
                 appear. The heading and the CTA still animate in; the
                 questions, which are the section's whole content, just show. */
              <div key={item.q} className={`qa${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="qa__q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <span className="qa__icon" aria-hidden="true">
                    <Icon name="ChevronDown" size={18} />
                  </span>
                </button>
                {/* Kept mounted so the open/close height can animate; `inert` keeps
                    collapsed answers out of the a11y tree and tab order. */}
                <div className="qa__panel" id={`faq-panel-${i}`} role="region" inert={!isOpen}>
                  <p>{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
